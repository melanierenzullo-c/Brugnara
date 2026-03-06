import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { requireEmployeeOrAdmin } from "./authz";

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
    await requireEmployeeOrAdmin(ctx);

    const slug = args.slug.trim();
    if (!slug) {
      throw new ConvexError("slug required");
    }

    return await ctx.db.insert("produkte", {
      name: args.name,
      beschreibung: args.beschreibung,
      foto: args.foto,
      nameIt: args.nameIt,
      beschreibungIt: args.beschreibungIt,
      kategorieId: args.kategorieId,
      slug,
    });
  },
});
