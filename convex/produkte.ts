import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByKategorie = query({
  args: { kategorieId: v.id("kategorien") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("produkte")
      .withIndex("by_kategorie", (q) => q.eq("kategorieId", args.kategorieId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    beschreibung: v.string(),
    foto: v.string(),
    nameIt: v.string(),
    beschreibungIt: v.string(),
    kategorieId: v.id("kategorien"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("produkte", {
      name: args.name,
      beschreibung: args.beschreibung,
      foto: args.foto,
      nameIt: args.nameIt,
      beschreibungIt: args.beschreibungIt,
      kategorieId: args.kategorieId,
    });
  },
});
