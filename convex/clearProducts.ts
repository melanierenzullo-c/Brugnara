import { mutation } from "./_generated/server";
import { requireAdmin } from "./authz";

export const clearProducts = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAdmin(ctx);
        const products = await ctx.db.query("produkte").collect();
        for (const p of products) {
            await ctx.db.delete(p._id);
        }
        return `Deleted ${products.length} products`;
    },
});
