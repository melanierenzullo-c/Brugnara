import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const seedData = internalAction({
  args: {},
  handler: async (ctx) => {
    // Seed categories
    const categories = [
      { name: "Eisenwaren", nameIt: "Ferramenta", slug: "eisenwaren" },
      { name: "Haushaltsartikel", nameIt: "Articoli per la casa", slug: "haushaltsartikel" },
      { name: "Werkzeug", nameIt: "Attrezzi", slug: "werkzeug" },
      { name: "Elektrogeräte", nameIt: "Elettrodomestici", slug: "elektrogeraete" },
      { name: "Gartengeräte", nameIt: "Attrezzi da giardino", slug: "gartengeraete" },
      { name: "Öfen & Herde", nameIt: "Forni e stufe", slug: "oefen-herde" },
    ];

    for (const cat of categories) {
      await ctx.runMutation(internal.seedHelpers.insertKategorie, cat);
    }

  },
});
