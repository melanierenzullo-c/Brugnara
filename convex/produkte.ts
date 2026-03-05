import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByKategorie = query({
  args: { kategorieId: v.id("kategorien") },
  handler: async (ctx, args) => {
    const produkte = await ctx.db
      .query("produkte")
      .withIndex("by_kategorie", (q) => q.eq("kategorieId", args.kategorieId))
      .collect();

    // Attach the resolved image URL to each product
    return Promise.all(
      produkte.map(async (produkt) => {
        const imageUrl = await ctx.storage.getUrl(produkt.foto);
        return {
          ...produkt,
          imageUrl,
        };
      })
    );
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    beschreibung: v.string(),
    foto: v.id("_storage"),
    nameIt: v.string(),
    beschreibungIt: v.string(),
    kategorieId: v.id("kategorien"),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("produkte", {
      name: args.name,
      beschreibung: args.beschreibung,
      foto: args.foto,
      nameIt: args.nameIt,
      beschreibungIt: args.beschreibungIt,
      kategorieId: args.kategorieId,
      slug: args.slug,
    });
  },
});
