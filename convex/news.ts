import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { requireEmployeeOrAdmin } from "./authz";
import { internal } from "./_generated/api";

/* ─── Public: newest first ─── */

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("news")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();

    return Promise.all(
      items.map(async (n) => {
        const imageUrl = await ctx.storage.getUrl(n.foto);
        return { ...n, imageUrl };
      })
    );
  },
});

/* ─── Admin: list all ─── */

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireEmployeeOrAdmin(ctx);
    const items = await ctx.db
      .query("news")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();

    return Promise.all(
      items.map(async (n) => {
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

/* ─── Remove ─── */

export const remove = mutation({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    const user = await requireEmployeeOrAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new ConvexError("News-Beitrag nicht gefunden");

    await ctx.db.delete(args.id);

    await ctx.runMutation(internal.aktivitaeten.logActivity, {
      userId: user._id,
      aktion: "News gelöscht",
      entity: "News",
      entityName: existing.titel,
    });
  },
});
