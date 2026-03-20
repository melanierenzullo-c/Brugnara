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
    titel: v.string(),
    inhalt: v.string(),
    foto: v.id("_storage"),
    titelIt: v.string(),
    inhaltIt: v.string(),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  aktivitaeten: defineTable({
    userId: v.id("users"),
    aktion: v.string(),
    entity: v.string(),
    entityName: v.string(),
    details: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_user", ["userId", "timestamp"]),
});
