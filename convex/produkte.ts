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
    nameEn: v.string(),
    beschreibungEn: v.string(),
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
      nameEn: args.nameEn,
      beschreibungEn: args.beschreibungEn,
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
      details: `IT: ${args.nameIt} · EN: ${args.nameEn} · Kategorie: ${kategorie?.name ?? "–"} · Slug: ${slug}`,
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

export const getByIdForAdmin = query({
  args: { id: v.id("produkte") },
  handler: async (ctx, args) => {
    await requireEmployeeOrAdmin(ctx);
    const produkt = await ctx.db.get(args.id);
    if (!produkt) throw new ConvexError("Produkt nicht gefunden");
    const imageUrl = await ctx.storage.getUrl(produkt.foto);
    const kategorie = await ctx.db.get(produkt.kategorieId);
    return {
      ...produkt,
      imageUrl,
      kategorieName: kategorie?.name ?? "–",
      kategorieNameIt: kategorie?.nameIt ?? "–",
    };
  },
});

export const getDraftByIdForAdmin = query({
  args: { id: v.id("produktEntwuerfe") },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const draft = await ctx.db.get(args.id);
    if (!draft || draft.ownerUserId !== user._id) {
      throw new ConvexError("Entwurf nicht gefunden");
    }
    const imageUrl = draft.foto ? await ctx.storage.getUrl(draft.foto) : null;
    const kategorie = draft.kategorieId ? await ctx.db.get(draft.kategorieId) : null;
    return {
      ...draft,
      imageUrl,
      kategorieName: kategorie?.name ?? "–",
      kategorieNameIt: kategorie?.nameIt ?? "–",
    };
  },
});

export const listDrafts = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const drafts = await ctx.db.query("produktEntwuerfe").collect();
    const sortedDrafts = drafts.sort((a, b) => b.updatedAt - a.updatedAt);

    return Promise.all(
      sortedDrafts.map(async (draft) => {
        const imageUrl = draft.foto ? await ctx.storage.getUrl(draft.foto) : null;
        const kategorie = draft.kategorieId ? await ctx.db.get(draft.kategorieId) : null;
        const owner = await ctx.db.get(draft.ownerUserId);
        return {
          ...draft,
          imageUrl,
          kategorieName: kategorie?.name ?? "–",
          ownerName: owner?.name ?? owner?.email ?? "Unbekannt",
          isOwner: draft.ownerUserId === user._id,
        };
      })
    );
  },
});

export const createDraft = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const now = Date.now();
    const id = await ctx.db.insert("produktEntwuerfe", {
      ownerUserId: user._id,
      name: "",
      beschreibung: "",
      nameIt: "",
      beschreibungIt: "",
      nameEn: "",
      beschreibungEn: "",
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

export const loadDraft = query({
  args: { id: v.id("produktEntwuerfe") },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const draft = await ctx.db.get(args.id);
    if (!draft || draft.ownerUserId !== user._id) {
      throw new ConvexError("Entwurf nicht gefunden");
    }
    const imageUrl = draft.foto ? await ctx.storage.getUrl(draft.foto) : null;
    const kategorie = draft.kategorieId ? await ctx.db.get(draft.kategorieId) : null;
    return {
      ...draft,
      imageUrl,
      kategorieName: kategorie?.name ?? "–",
    };
  },
});

export const saveDraft = mutation({
  args: {
    id: v.id("produktEntwuerfe"),
    name: v.string(),
    beschreibung: v.string(),
    nameIt: v.string(),
    beschreibungIt: v.string(),
    nameEn: v.string(),
    beschreibungEn: v.string(),
    kategorieId: v.optional(v.id("kategorien")),
    foto: v.optional(v.union(v.id("_storage"), v.null())),
  },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const draft = await ctx.db.get(args.id);
    if (!draft || draft.ownerUserId !== user._id) {
      throw new ConvexError("Entwurf nicht gefunden");
    }
    await ctx.db.patch(args.id, {
      name: args.name,
      beschreibung: args.beschreibung,
      nameIt: args.nameIt,
      beschreibungIt: args.beschreibungIt,
      nameEn: args.nameEn,
      beschreibungEn: args.beschreibungEn,
      kategorieId: args.kategorieId,
      ...(args.foto === null ? { foto: undefined } : {}),
      ...(args.foto ? { foto: args.foto } : {}),
      updatedAt: Date.now(),
    });
  },
});

export const deleteDraft = mutation({
  args: { id: v.id("produktEntwuerfe") },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const draft = await ctx.db.get(args.id);
    if (!draft || draft.ownerUserId !== user._id) {
      throw new ConvexError("Entwurf nicht gefunden");
    }
    if (draft.foto) {
      await ctx.storage.delete(draft.foto);
    }
    await ctx.db.delete(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    beschreibung: v.string(),
    foto: v.id("_storage"),
    nameIt: v.string(),
    beschreibungIt: v.string(),
    nameEn: v.string(),
    beschreibungEn: v.string(),
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
      nameEn: args.nameEn,
      beschreibungEn: args.beschreibungEn,
      kategorieId: args.kategorieId,
      slug,
    });

    const kategorie = await ctx.db.get(args.kategorieId);
    await ctx.runMutation(internal.aktivitaeten.logActivity, {
      userId: user._id,
      aktion: "Produkt erstellt",
      entity: "Produkt",
      entityName: args.name,
      details: `IT: ${args.nameIt} · EN: ${args.nameEn} · Kategorie: ${kategorie?.name ?? "–"} · Slug: ${slug}`,
    });

    return id;
  },
});
