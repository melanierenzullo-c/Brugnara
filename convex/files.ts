import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Generate a short-lived upload URL for the frontend.
 * The client will perform a POST request to this URL to upload the file,
 * and receive a `storageId` in return.
 */
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});

/**
 * Optional helper query if we want to resolve a single image URL explicitly.
 * (In `produkte.ts`, we also resolve them directly during list fetches for performance).
 */
export const getImageUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});
