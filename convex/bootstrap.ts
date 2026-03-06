import { mutation } from "./_generated/server";
import { ConvexError } from "convex/values";

export const bootstrapInitialAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const authEmail = (identity.email ?? "").trim().toLowerCase();
    if (!authEmail) {
      throw new ConvexError("Auth user has no email");
    }

    const initialAdminEmailRaw = process.env.INITIAL_ADMIN_EMAIL;
    if (!initialAdminEmailRaw) {
      return { created: false as const };
    }

    const initialAdminEmail = initialAdminEmailRaw.trim().toLowerCase();
    if (authEmail !== initialAdminEmail) {
      return { created: false as const };
    }

    const alreadyProvisioned = await ctx.db
      .query("users")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", identity.subject))
      .unique();
    if (alreadyProvisioned) {
      return { created: false as const };
    }

    const existingAnyUser = await ctx.db.query("users").take(1);
    if (existingAnyUser.length > 0) {
      return { created: false as const };
    }

    const now = Date.now();
    await ctx.db.insert("users", {
      authUserId: identity.subject,
      email: authEmail,
      name: identity.name ?? undefined,
      role: "admin",
      disabled: false,
      createdAt: now,
      updatedAt: now,
    });

    return { created: true as const };
  },
});

