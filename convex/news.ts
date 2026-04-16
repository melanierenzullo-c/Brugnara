import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { requireEmployeeOrAdmin } from "./authz";
import { internal } from "./_generated/api";

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

/* ─── Create ─── */

export const create = mutation({
  args: {
    titel: v.string(),
    inhalt: v.string(),
    foto: v.id("_storage"),
    titelIt: v.string(),
    inhaltIt: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);

    const id = await ctx.db.insert("news", {
      titel: args.titel,
      inhalt: args.inhalt,
      foto: args.foto,
      titelIt: args.titelIt,
      inhaltIt: args.inhaltIt,
      createdAt: Date.now(),
    });

    await ctx.runMutation(internal.aktivitaeten.logActivity, {
      userId: user._id,
      aktion: "News erstellt",
      entity: "News",
      entityName: args.titel,
      details: `IT: ${args.titelIt}`,
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
    foto: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new ConvexError("News-Beitrag nicht gefunden");

    await ctx.db.patch(args.id, {
      titel: args.titel,
      inhalt: args.inhalt,
      titelIt: args.titelIt,
      inhaltIt: args.inhaltIt,
      ...(args.foto ? { foto: args.foto } : {}),
    });

    await ctx.runMutation(internal.aktivitaeten.logActivity, {
      userId: user._id,
      aktion: "News bearbeitet",
      entity: "News",
      entityName: args.titel,
      details: `IT: ${args.titelIt}`,
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
