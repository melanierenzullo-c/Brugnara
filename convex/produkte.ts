import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { requireEmployeeOrAdmin } from "./authz";
import { internal } from "./_generated/api";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireEmployeeOrAdmin(ctx);
    const produkte = await ctx.db.query("produkte").collect();
    const aktive = produkte.filter((p) => !p.archiviertAm);
    return Promise.all(
      aktive.map(async (p) => {
        const imageUrl = await ctx.storage.getUrl(p.foto);
        const kategorie = await ctx.db.get(p.kategorieId);
        return { ...p, imageUrl, kategorieName: kategorie?.name ?? "–" };
      })
    );
  },
});

export const listArchiviert = query({
  args: {},
  handler: async (ctx) => {
    await requireEmployeeOrAdmin(ctx);
    const produkte = await ctx.db.query("produkte").collect();
    const archiviert = produkte.filter((p) => !!p.archiviertAm);
    return Promise.all(
      archiviert.map(async (p) => {
        const imageUrl = await ctx.storage.getUrl(p.foto);
        const kategorie = await ctx.db.get(p.kategorieId);
        return { ...p, imageUrl, kategorieName: kategorie?.name ?? "–" };
      })
    );
  },
});

export const update = mutation({
  args: {
    id: v.id("produkte"),
    name: v.string(),
    beschreibung: v.string(),
    nameIt: v.string(),
    beschreibungIt: v.string(),
    kategorieId: v.id("kategorien"),
    slug: v.string(),
    foto: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new ConvexError("Produkt nicht gefunden");

    const slug = args.slug.trim();
    await ctx.db.patch(args.id, {
      name: args.name,
      beschreibung: args.beschreibung,
      nameIt: args.nameIt,
      beschreibungIt: args.beschreibungIt,
      kategorieId: args.kategorieId,
      slug,
      ...(args.foto ? { foto: args.foto } : {}),
    });

    const kategorie = await ctx.db.get(args.kategorieId);
    await ctx.runMutation(internal.aktivitaeten.logActivity, {
      userId: user._id,
      aktion: "Produkt bearbeitet",
      entity: "Produkt",
      entityName: args.name,
      details: `IT: ${args.nameIt} · Kategorie: ${kategorie?.name ?? "–"} · Slug: ${slug}`,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("produkte") },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new ConvexError("Produkt nicht gefunden");

    const kategorie = await ctx.db.get(existing.kategorieId);
    await ctx.db.patch(args.id, { archiviertAm: Date.now() });

    await ctx.runMutation(internal.aktivitaeten.logActivity, {
      userId: user._id,
      aktion: "Produkt in Papierkorb verschoben",
      entity: "Produkt",
      entityName: existing.name,
      details: `Kategorie: ${kategorie?.name ?? "–"}`,
    });
  },
});

export const restore = mutation({
  args: { id: v.id("produkte") },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new ConvexError("Produkt nicht gefunden");

    await ctx.db.patch(args.id, { archiviertAm: undefined });

    const kategorie = await ctx.db.get(existing.kategorieId);
    await ctx.runMutation(internal.aktivitaeten.logActivity, {
      userId: user._id,
      aktion: "Produkt wiederhergestellt",
      entity: "Produkt",
      entityName: existing.name,
      details: `Kategorie: ${kategorie?.name ?? "–"}`,
    });
  },
});

export const deletePermanent = mutation({
  args: { id: v.id("produkte") },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new ConvexError("Produkt nicht gefunden");

    const kategorie = await ctx.db.get(existing.kategorieId);
    await ctx.db.delete(args.id);

    await ctx.runMutation(internal.aktivitaeten.logActivity, {
      userId: user._id,
      aktion: "Produkt endgültig gelöscht",
      entity: "Produkt",
      entityName: existing.name,
      details: `Kategorie: ${kategorie?.name ?? "–"}`,
    });
  },
});

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const produkte = await ctx.db.query("produkte").collect();
    const aktive = produkte.filter((p) => !p.archiviertAm);
    return Promise.all(
      aktive.map(async (p) => {
        const imageUrl = await ctx.storage.getUrl(p.foto);
        const kategorie = await ctx.db.get(p.kategorieId);
        return {
          ...p,
          imageUrl,
          kategorieName: kategorie?.name ?? "–",
          kategorieNameIt: kategorie?.nameIt ?? "–",
        };
      })
    );
  },
});

export const listByKategorie = query({
  args: { kategorieId: v.id("kategorien") },
  handler: async (ctx, args) => {
    const produkte = await ctx.db
      .query("produkte")
      .withIndex("by_kategorie", (q) => q.eq("kategorieId", args.kategorieId))
      .collect();

    const aktive = produkte.filter((p) => !p.archiviertAm);

    return Promise.all(
      aktive.map(async (produkt) => {
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
    const user = await requireEmployeeOrAdmin(ctx);

    const slug = args.slug.trim();
    if (!slug) {
      throw new ConvexError("slug required");
    }

    const id = await ctx.db.insert("produkte", {
      name: args.name,
      beschreibung: args.beschreibung,
      foto: args.foto,
      nameIt: args.nameIt,
      beschreibungIt: args.beschreibungIt,
      kategorieId: args.kategorieId,
      slug,
    });

    const kategorie = await ctx.db.get(args.kategorieId);
    await ctx.runMutation(internal.aktivitaeten.logActivity, {
      userId: user._id,
      aktion: "Produkt erstellt",
      entity: "Produkt",
      entityName: args.name,
      details: `IT: ${args.nameIt} · Kategorie: ${kategorie?.name ?? "–"} · Slug: ${slug}`,
    });

    return id;
  },
});
