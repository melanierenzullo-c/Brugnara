import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const update = mutation({
    args: {
        tag: v.string(),
        von1: v.optional(v.string()),
        bis1: v.optional(v.string()),
        von2: v.optional(v.string()),
        bis2: v.optional(v.string()),
        geschlossen: v.boolean(),
    },
    handler: async (ctx, args) => {
        // Check if the entry for this day already exists.
        const existing = await ctx.db
            .query("oeffnungszeiten")
            .withIndex("by_tag", (q) => q.eq("tag", args.tag))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, args);
        } else {
            await ctx.db.insert("oeffnungszeiten", args);
        }
    },
});
