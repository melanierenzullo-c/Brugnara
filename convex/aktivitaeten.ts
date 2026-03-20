import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./authz";
import type { Id } from "./_generated/dataModel";

export const logActivity = internalMutation({
  args: {
    userId: v.id("users"),
    aktion: v.string(),
    entity: v.string(),
    entityName: v.string(),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("aktivitaeten", {
      userId: args.userId,
      aktion: args.aktion,
      entity: args.entity,
      entityName: args.entityName,
      details: args.details,
      timestamp: Date.now(),
    });
  },
});

export const listAktivitaeten = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const eintraege = await ctx.db
      .query("aktivitaeten")
      .withIndex("by_timestamp")
      .order("desc")
      .take(200);

    const userCache = new Map<string, { email: string; name: string | null }>();

    return Promise.all(
      eintraege.map(async (e) => {
        const key = e.userId as string;
        if (!userCache.has(key)) {
          const user = await ctx.db.get(e.userId as Id<"users">);
          userCache.set(key, {
            email: user?.email ?? "Unbekannt",
            name: user?.name ?? null,
          });
        }
        const user = userCache.get(key)!;
        return {
          _id: e._id,
          aktion: e.aktion,
          entity: e.entity,
          entityName: e.entityName,
          details: e.details ?? null,
          timestamp: e.timestamp,
          userId: e.userId,
          userEmail: user.email,
          userName: user.name,
        };
      })
    );
  },
});
