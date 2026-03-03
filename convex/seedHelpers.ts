import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const insertKategorie = internalMutation({
  args: {
    name: v.string(),
    nameIt: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("kategorien")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!existing) {
      await ctx.db.insert("kategorien", {
        name: args.name,
        nameIt: args.nameIt,
        slug: args.slug,
      });
    }
  },
});

export const insertOeffnungszeit = internalMutation({
  args: {
    tag: v.string(),
    von1: v.optional(v.string()),
    bis1: v.optional(v.string()),
    von2: v.optional(v.string()),
    bis2: v.optional(v.string()),
    geschlossen: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("oeffnungszeiten")
      .withIndex("by_tag", (q) => q.eq("tag", args.tag))
      .unique();

    if (!existing) {
      await ctx.db.insert("oeffnungszeiten", {
        tag: args.tag,
        von1: args.von1,
        bis1: args.bis1,
        von2: args.von2,
        bis2: args.bis2,
        geschlossen: args.geschlossen,
      });
    }
  },
});
