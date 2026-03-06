import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    authUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("employee")),
    disabled: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_auth_user_id", ["authUserId"])
    .index("by_email", ["email"]),

  invites: defineTable({
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("employee")),
    tokenHash: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    createdByUserId: v.optional(v.id("users")),
    usedAt: v.optional(v.number()),
    usedByAuthUserId: v.optional(v.string()),
  })
    .index("by_token_hash", ["tokenHash"])
    .index("by_email", ["email"]),

  kategorien: defineTable({
    name: v.string(),
    nameIt: v.string(),
    slug: v.string(),
  }).index("by_slug", ["slug"]),

  produkte: defineTable({
    name: v.string(),
    beschreibung: v.string(),
    foto: v.id("_storage"),
    nameIt: v.string(),
    beschreibungIt: v.string(),
    kategorieId: v.id("kategorien"),
    slug: v.string(),
  }).index("by_kategorie", ["kategorieId"]),

  news: defineTable({
    name: v.string(),
    beschreibung: v.string(),
    foto: v.string(),
    nameIt: v.string(),
    beschreibungIt: v.string(),
  }),

  oeffnungszeiten: defineTable({
    tag: v.string(),
    von1: v.optional(v.string()),
    bis1: v.optional(v.string()),
    von2: v.optional(v.string()),
    bis2: v.optional(v.string()),
    geschlossen: v.boolean(),
  }).index("by_tag", ["tag"]),
});
