import { ConvexError } from "convex/values";

import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

export type AppRole = "admin" | "employee";

export async function getIdentityOrThrow(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Not authenticated");
  }
  return identity;
}

export async function getCurrentUserOrThrow(
  ctx: MutationCtx | QueryCtx
): Promise<Doc<"users">> {
  const identity = await getIdentityOrThrow(ctx);

  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_user_id", (q) => q.eq("authUserId", identity.subject))
    .unique();

  if (!user) {
    throw new ConvexError("User not provisioned");
  }
  if (user.disabled) {
    throw new ConvexError("User disabled");
  }
  return user;
}

export async function requireAdmin(
  ctx: MutationCtx | QueryCtx
): Promise<Doc<"users">> {
  const user = await getCurrentUserOrThrow(ctx);
  if (user.role !== "admin") {
    throw new ConvexError("Admin access required");
  }
  return user;
}

export async function requireEmployeeOrAdmin(
  ctx: MutationCtx | QueryCtx
): Promise<Doc<"users">> {
  const user = await getCurrentUserOrThrow(ctx);
  if (user.role !== "admin" && user.role !== "employee") {
    throw new ConvexError("Insufficient permissions");
  }
  return user;
}

