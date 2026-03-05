"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

/**
 * Admin page for creating new products.
 * Categories are loaded from the Convex database;
 * new products are persisted via the `produkte.create` mutation.
 */
export default function AdminProduktePage() {
  const t = useTranslations("Admin");

  /* Live category list from DB */
  const kategorien = useQuery(api.kategorien.list);
  const createProdukt = useMutation(api.produkte.create);

  const [name, setName] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [nameIt, setNameIt] = useState("");
  const [beschreibungIt, setBeschreibungIt] = useState("");
  const [kategorieId, setKategorieId] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [meldung, setMeldung] = useState("");
  const [saving, setSaving] = useState(false);

  /* Convex mutations */
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  /** Validate and persist a new product */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMeldung("");

    if (!kategorieId) {
      setMeldung(t("bitteKategorie"));
      return;
    }

    if (!selectedImage) {
      setMeldung(t("bitteFoto")); // Make sure translation key exists or is obvious
      return;
    }

    try {
      setSaving(true);

      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage,
      });

      if (!result.ok) {
        throw new Error("Fehler beim Hochladen des Bildes");
      }

      const { storageId } = await result.json();

      // Step 3: Save the newly allocated storage id to the database
      await createProdukt({
        name,
        beschreibung,
        foto: storageId,
        nameIt,
        beschreibungIt,
        kategorieId: kategorieId as Id<"kategorien">,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      });

      /* Reset form on success */
      setName("");
      setBeschreibung("");
      setNameIt("");
      setBeschreibungIt("");
      setKategorieId("");
      setSelectedImage(null);
      setMeldung("✅ Produkt gespeichert!");

      // Reset the file input visually
      const fileInput = document.getElementById("foto-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unbekannter Fehler";
      setMeldung(`❌ Fehler: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#5A759E]">
      <div className="mx-auto min-h-screen px-5 py-5 lg:w-[80%]">
        <br />

        {meldung && (
          <p className="text-center font-bold text-white">{meldung}</p>
        )}

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="mt-5 flex w-full max-w-[600px] flex-col gap-4 rounded-lg bg-[#f8f8f8] p-5 shadow-md"
          >
            <label>{t("produktName")}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded p-2.5 text-[16px]" />

            <label>{t("produktBeschreibung")}</label>
            <textarea value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} maxLength={300} required className="w-full rounded p-2.5 text-[16px]" />

            <label>{t("produktNameIt")}</label>
            <input type="text" value={nameIt} onChange={(e) => setNameIt(e.target.value)} required className="w-full rounded p-2.5 text-[16px]" />

            <label>{t("produktBeschreibungIt")}</label>
            <textarea value={beschreibungIt} onChange={(e) => setBeschreibungIt(e.target.value)} maxLength={300} required className="w-full rounded p-2.5 text-[16px]" />

            <label>{t("kategorieWaehlen")}</label>
            <select value={kategorieId} onChange={(e) => setKategorieId(e.target.value)} required className="w-full rounded p-2.5 text-[16px]">
              <option value="">{t("bitteWaehlen")}</option>
              {kategorien?.map((kat) => (
                <option key={kat._id} value={kat._id}>{kat.name}</option>
              ))}
            </select>

            <label>{t("fotDateiname")}</label>
            <input
              id="foto-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              required
              className="w-full rounded p-2.5 text-[16px] bg-white"
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full cursor-pointer rounded bg-[#A5BDD8] p-2.5 text-[16px] transition-all hover:scale-105 hover:bg-[#B3D0EB] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Speichern…" : t("produktSpeichern")}
            </button>
          </form>
        </div>
        <br /><br />
      </div>
    </div>
  );
}
