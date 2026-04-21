import { mutation } from "./_generated/server";
import { requireAdmin } from "./authz";

export const backfillEnglish = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const produkte = await ctx.db.query("produkte").collect();
    for (const p of produkte) {
      if (!p.nameEn?.trim()) {
        await ctx.db.patch(p._id, {
          nameEn: p.name,
          beschreibungEn: p.beschreibung,
        });
      }
    }

    const news = await ctx.db.query("news").collect();
    for (const n of news) {
      if (!n.titelEn?.trim()) {
        await ctx.db.patch(n._id, {
          titelEn: n.titel,
          inhaltEn: n.inhalt,
        });
      }
    }

    const produktDrafts = await ctx.db.query("produktEntwuerfe").collect();
    for (const d of produktDrafts) {
      if (!d.nameEn?.trim()) {
        await ctx.db.patch(d._id, {
          nameEn: d.name,
          beschreibungEn: d.beschreibung,
        });
      }
    }

    const newsDrafts = await ctx.db.query("newsEntwuerfe").collect();
    for (const d of newsDrafts) {
      if (!d.titelEn?.trim()) {
        await ctx.db.patch(d._id, {
          titelEn: d.titel,
          inhaltEn: d.inhalt,
        });
      }
    }

    return {
      produkte: produkte.length,
      news: news.length,
      produktEntwuerfe: produktDrafts.length,
      newsEntwuerfe: newsDrafts.length,
    };
  },
});

