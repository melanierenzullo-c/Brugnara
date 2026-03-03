import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  kategorien: defineTable({
    name: v.string(),
    nameIt: v.string(),
    slug: v.string(),
  }).index("by_slug", ["slug"]),

  produkte: defineTable({
    name: v.string(),
    beschreibung: v.string(),
    foto: v.string(),
    nameIt: v.string(),
    beschreibungIt: v.string(),
    kategorieId: v.id("kategorien"),
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
