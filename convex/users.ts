import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

import { getCurrentUserOrThrow, requireAdmin } from "./authz";

const INVITE_TOKEN_BYTES = 32;
const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function base64UrlEncode(bytes: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function randomToken(): string {
  const bytes = new Uint8Array(INVITE_TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const me = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return {
      _id: user._id,
      email: user.email,
      name: user.name ?? null,
      role: user.role,
      disabled: user.disabled,
    };
  },
});

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const users = await ctx.db.query("users").collect();
    return users.map((u) => ({
      _id: u._id,
      email: u.email,
      name: u.name ?? null,
      role: u.role,
      disabled: u.disabled,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
  },
});

export const ensureCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", identity.subject))
      .unique();
    if (existing) {
      return { created: false as const };
    }

    const email = (identity.email ?? "").trim().toLowerCase();
    if (!email) {
      throw new ConvexError("User not provisioned");
    }

    const invites = await ctx.db
      .query("invites")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();

    const now = Date.now();
    const activeInvite = invites.find(
      (invite) => !invite.usedAt && invite.expiresAt > now
    );

    if (!activeInvite) {
      return { created: false as const };
    }

    const createdAt = now;
    const userId = await ctx.db.insert("users", {
      authUserId: identity.subject,
      email,
      name: identity.name ?? undefined,
      role: activeInvite.role,
      disabled: false,
      createdAt,
      updatedAt: createdAt,
    });

    await ctx.db.patch(activeInvite._id, {
      usedAt: now,
      usedByAuthUserId: identity.subject,
    });

    return { created: true as const, userId };
  },
});

export const getInviteInfoByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const token = args.token.trim();
    if (!token) {
      return null;
    }

    const tokenHash = await sha256Hex(token);
    const invite = await ctx.db
      .query("invites")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash))
      .unique();

    if (!invite) {
      return null;
    }

    const now = Date.now();
    const expired = invite.expiresAt < now;
    const used = !!invite.usedAt;

    return {
      email: invite.email,
      role: invite.role,
      expired,
      used,
    };
  },
});

export const setUserDisabled = mutation({
  args: { userId: v.id("users"), disabled: v.boolean() },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    if (admin._id === args.userId) {
      throw new ConvexError("Cannot change own status");
    }

    const existing = await ctx.db.get(args.userId);
    if (!existing) {
      throw new ConvexError("User not found");
    }

    const now = Date.now();
    await ctx.db.patch(args.userId, { disabled: args.disabled, updatedAt: now });
  },
});

export const createEmployeeInvite = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);

    const email = args.email.trim().toLowerCase();
    if (!email) {
      throw new ConvexError("email required");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existingUser) {
      throw new ConvexError("User already exists");
    }

    const token = randomToken();
    const tokenHash = await sha256Hex(token);
    const now = Date.now();
    const expiresAt = now + INVITE_TTL_MS;

    await ctx.db.insert("invites", {
      email,
      role: "employee",
      tokenHash,
      expiresAt,
      createdAt: now,
      createdByUserId: admin._id,
    });

    return { token, expiresAt, email, role: "employee" as const };
  },
});

export const acceptInvite = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const token = args.token.trim();
    if (!token) {
      throw new ConvexError("token required");
    }

    const tokenHash = await sha256Hex(token);
    const invite = await ctx.db
      .query("invites")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash))
      .unique();

    if (!invite) {
      throw new ConvexError("Invalid invite");
    }
    if (invite.usedAt) {
      throw new ConvexError("Invite already used");
    }
    if (invite.expiresAt < Date.now()) {
      throw new ConvexError("Invite expired");
    }

    const authEmail = (identity.email ?? "").trim().toLowerCase();
    if (!authEmail) {
      throw new ConvexError("Auth user has no email");
    }
    if (authEmail !== invite.email) {
      throw new ConvexError("Invite email does not match");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", identity.subject))
      .unique();
    if (existingUser) {
      throw new ConvexError("User already provisioned");
    }

    const now = Date.now();
    await ctx.db.insert("users", {
      authUserId: identity.subject,
      email: authEmail,
      name: identity.name ?? undefined,
      role: invite.role,
      disabled: false,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(invite._id, {
      usedAt: now,
      usedByAuthUserId: identity.subject,
    });
  },
});

