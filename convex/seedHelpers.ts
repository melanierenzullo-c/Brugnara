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
        nameEn: args.name,
        slug: args.slug,
      });
    }
  },
});

