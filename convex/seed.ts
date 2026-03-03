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

    // Seed opening hours
    const hours = [
      { tag: "Mo-Fr", von1: "08:00", bis1: "12:00", von2: "14:30", bis2: "18:30", geschlossen: false },
      { tag: "Sa", von1: "08:00", bis1: "12:00", geschlossen: false },
      { tag: "So", geschlossen: true },
    ];

    for (const hour of hours) {
      await ctx.runMutation(internal.seedHelpers.insertOeffnungszeit, {
        tag: hour.tag,
        von1: hour.von1,
        bis1: hour.bis1,
        von2: hour.von2,
        bis2: hour.bis2,
        geschlossen: hour.geschlossen,
      });
    }
  },
});
