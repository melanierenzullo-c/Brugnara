import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { requireEmployeeOrAdmin } from "./authz";
import { internal } from "./_generated/api";

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

/* ─── Public: newest first (nur nicht-archivierte) ─── */

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("news")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();

    const aktive = items.filter((n) => !n.archiviertAm);

    return Promise.all(
      aktive.map(async (n) => {
        const imageUrl = await ctx.storage.getUrl(n.foto);
        return { ...n, imageUrl };
      })
    );
  },
});

/* ─── Admin: list all (nur nicht-archivierte) ─── */

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireEmployeeOrAdmin(ctx);
    const items = await ctx.db
      .query("news")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();

    const aktive = items.filter((n) => !n.archiviertAm);

    return Promise.all(
      aktive.map(async (n) => {
        const imageUrl = await ctx.storage.getUrl(n.foto);
        return { ...n, imageUrl };
      })
    );
  },
});

/* ─── Admin: list archiviert ─── */

export const listArchiviert = query({
  args: {},
  handler: async (ctx) => {
    await requireEmployeeOrAdmin(ctx);
    const items = await ctx.db
      .query("news")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();

    const archiviert = items.filter((n) => !!n.archiviertAm);

    return Promise.all(
      archiviert.map(async (n) => {
        const imageUrl = await ctx.storage.getUrl(n.foto);
        return { ...n, imageUrl };
      })
    );
  },
});

export const getByIdForAdmin = query({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    await requireEmployeeOrAdmin(ctx);
    const item = await ctx.db.get(args.id);
    if (!item) throw new ConvexError("News-Beitrag nicht gefunden");
    const imageUrl = await ctx.storage.getUrl(item.foto);
    return { ...item, imageUrl };
  },
});

export const getDraftByIdForAdmin = query({
  args: { id: v.id("newsEntwuerfe") },
  handler: async (ctx, args) => {
    await requireEmployeeOrAdmin(ctx);
    const draft = await ctx.db.get(args.id);
    if (!draft) {
      throw new ConvexError("Entwurf nicht gefunden");
    }
    const imageUrl = draft.foto ? await ctx.storage.getUrl(draft.foto) : null;
    return { ...draft, imageUrl };
  },
});

export const listDrafts = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const drafts = await ctx.db.query("newsEntwuerfe").collect();
    const sortedDrafts = drafts.sort((a, b) => b.updatedAt - a.updatedAt);

    return Promise.all(
      sortedDrafts.map(async (draft) => {
        const imageUrl = draft.foto ? await ctx.storage.getUrl(draft.foto) : null;
        const owner = await ctx.db.get(draft.ownerUserId);
        return {
          ...draft,
          imageUrl,
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
    const id = await ctx.db.insert("newsEntwuerfe", {
      ownerUserId: user._id,
      titel: "",
      inhalt: "",
      titelIt: "",
      inhaltIt: "",
      titelEn: "",
      inhaltEn: "",
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

export const loadDraft = query({
  args: { id: v.id("newsEntwuerfe") },
  handler: async (ctx, args) => {
    await requireEmployeeOrAdmin(ctx);
    const draft = await ctx.db.get(args.id);
    if (!draft) {
      throw new ConvexError("Entwurf nicht gefunden");
    }
    const imageUrl = draft.foto ? await ctx.storage.getUrl(draft.foto) : null;
    return { ...draft, imageUrl };
  },
});

export const saveDraft = mutation({
  args: {
    id: v.id("newsEntwuerfe"),
    titel: v.string(),
    inhalt: v.string(),
    titelIt: v.string(),
    inhaltIt: v.string(),
    titelEn: v.optional(v.string()),
    inhaltEn: v.optional(v.string()),
    foto: v.optional(v.union(v.id("_storage"), v.null())),
  },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const draft = await ctx.db.get(args.id);
    if (!draft) {
      throw new ConvexError("Entwurf nicht gefunden");
    }
    const canEdit = draft.ownerUserId === user._id || user.role === "admin";
    if (!canEdit) {
      throw new ConvexError("Nur Ersteller oder Admin darf diesen Entwurf bearbeiten");
    }
    await ctx.db.patch(args.id, {
      titel: args.titel,
      inhalt: args.inhalt,
      titelIt: args.titelIt,
      inhaltIt: args.inhaltIt,
      titelEn: args.titelEn ?? "",
      inhaltEn: args.inhaltEn ?? "",
      ...(args.foto === null ? { foto: undefined } : {}),
      ...(args.foto ? { foto: args.foto } : {}),
      updatedAt: Date.now(),
    });
  },
});

export const deleteDraft = mutation({
  args: { id: v.id("newsEntwuerfe") },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const draft = await ctx.db.get(args.id);
    if (!draft) {
      throw new ConvexError("Entwurf nicht gefunden");
    }
    const canDelete = draft.ownerUserId === user._id || user.role === "admin";
    if (!canDelete) {
      throw new ConvexError("Nur Ersteller oder Admin darf diesen Entwurf löschen");
    }
    if (draft.foto) {
      await ctx.storage.delete(draft.foto);
    }
    await ctx.db.delete(args.id);
  },
});

/* ─── Create ─── */

export const create = mutation({
  args: {
    titel: v.string(),
    inhalt: v.string(),
    foto: v.id("_storage"),
    titelIt: v.string(),
    inhaltIt: v.string(),
    titelEn: v.string(),
    inhaltEn: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);

    const allNews = await ctx.db.query("news").collect();
    const normalizedTitel = normalizeText(args.titel);
    const duplicateTitel = allNews.find(
      (n) => !n.archiviertAm && normalizeText(n.titel) === normalizedTitel
    );
    if (duplicateTitel) {
      throw new ConvexError("Ein News-Beitrag mit diesem Titel existiert bereits");
    }

    const id = await ctx.db.insert("news", {
      titel: args.titel,
      inhalt: args.inhalt,
      foto: args.foto,
      titelIt: args.titelIt,
      inhaltIt: args.inhaltIt,
      titelEn: args.titelEn,
      inhaltEn: args.inhaltEn,
      createdAt: Date.now(),
    });

    await ctx.runMutation(internal.aktivitaeten.logActivity, {
      userId: user._id,
      aktion: "News erstellt",
      entity: "News",
      entityName: args.titel,
      details: `DE: ${args.titel} · IT: ${args.titelIt} · EN: ${args.titelEn}`,
    });

    return id;
  },
});

/* ─── Update ─── */

export const update = mutation({
  args: {
    id: v.id("news"),
    titel: v.string(),
    inhalt: v.string(),
    titelIt: v.string(),
    inhaltIt: v.string(),
    titelEn: v.string(),
    inhaltEn: v.string(),
    foto: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new ConvexError("News-Beitrag nicht gefunden");

    const allNews = await ctx.db.query("news").collect();
    const normalizedTitel = normalizeText(args.titel);
    const duplicateTitel = allNews.find(
      (n) =>
        n._id !== args.id &&
        !n.archiviertAm &&
        normalizeText(n.titel) === normalizedTitel
    );
    if (duplicateTitel) {
      throw new ConvexError("Ein News-Beitrag mit diesem Titel existiert bereits");
    }

    await ctx.db.patch(args.id, {
      titel: args.titel,
      inhalt: args.inhalt,
      titelIt: args.titelIt,
      inhaltIt: args.inhaltIt,
      titelEn: args.titelEn,
      inhaltEn: args.inhaltEn,
      ...(args.foto ? { foto: args.foto } : {}),
    });

    const detailsParts = [];
    if (existing.titel !== args.titel) detailsParts.push(`DE: ${args.titel}`);
    if (existing.titelIt !== args.titelIt) detailsParts.push(`IT: ${args.titelIt}`);
    if ((args.titelEn ?? "") !== (existing.titelEn ?? "")) detailsParts.push(`EN: ${args.titelEn}`);

    await ctx.runMutation(internal.aktivitaeten.logActivity, {
      userId: user._id,
      aktion: "News bearbeitet",
      entity: "News",
      entityName: args.titel,
      details: detailsParts.join(" · "),
    });
  },
});

/* ─── Remove (Soft-Delete → Papierkorb) ─── */

export const remove = mutation({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new ConvexError("News-Beitrag nicht gefunden");

    await ctx.db.patch(args.id, { archiviertAm: Date.now() });

    await ctx.runMutation(internal.aktivitaeten.logActivity, {
      userId: user._id,
      aktion: "News in Papierkorb verschoben",
      entity: "News",
      entityName: existing.titel,
    });
  },
});

/* ─── Restore ─── */

export const restore = mutation({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new ConvexError("News-Beitrag nicht gefunden");

    await ctx.db.patch(args.id, { archiviertAm: undefined });

    await ctx.runMutation(internal.aktivitaeten.logActivity, {
      userId: user._id,
      aktion: "News wiederhergestellt",
      entity: "News",
      entityName: existing.titel,
    });
  },
});

/* ─── Delete permanent ─── */

export const deletePermanent = mutation({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new ConvexError("News-Beitrag nicht gefunden");

    await ctx.db.delete(args.id);

    await ctx.runMutation(internal.aktivitaeten.logActivity, {
      userId: user._id,
      aktion: "News endgültig gelöscht",
      entity: "News",
      entityName: existing.titel,
    });
  },
});
