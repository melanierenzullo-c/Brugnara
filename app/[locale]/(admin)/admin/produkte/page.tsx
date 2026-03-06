"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function AdminProduktePage() {
  const t = useTranslations("Admin");

  const kategorien = useQuery(api.kategorien.list);
  const createProdukt = useMutation(api.produkte.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [name, setName] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [nameIt, setNameIt] = useState("");
  const [beschreibungIt, setBeschreibungIt] = useState("");
  const [kategorieId, setKategorieId] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [meldung, setMeldung] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMeldung("");

    if (!kategorieId) {
      setMeldung(t("bitteKategorie"));
      return;
    }

    if (!selectedImage) {
      setMeldung(t("bitteFoto"));
      return;
    }

    try {
      setSaving(true);

      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage,
      });

      if (!result.ok) {
        throw new Error("Fehler beim Hochladen des Bildes");
      }

      const { storageId } = await result.json();

      await createProdukt({
        name,
        beschreibung,
        foto: storageId,
        nameIt,
        beschreibungIt,
        kategorieId: kategorieId as Id<"kategorien">,
        slug: name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      });

      setName("");
      setBeschreibung("");
      setNameIt("");
      setBeschreibungIt("");
      setKategorieId("");
      setSelectedImage(null);
      setMeldung("✅ Produkt gespeichert!");

      const fileInput = document.getElementById(
        "foto-upload"
      ) as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      setMeldung(`❌ Fehler: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-950">
      <div className="mx-auto min-h-screen max-w-6xl px-4 py-6 lg:px-8 lg:py-10">
        <header className="mb-6">
          <h1 className="text-xl font-semibold text-sky-100">
            {t("produkte")}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Produktdaten gepflegt und konsistent halten.
          </p>
        </header>

        {meldung && (
          <p className="mb-4 rounded-md border border-sky-500/40 bg-sky-950/40 px-3 py-2 text-sm text-sky-100">
            {meldung}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-sky-900/60 bg-slate-900/70 p-5 shadow-sm"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-sky-100">
                  {t("produktName")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-sky-100">
                  {t("produktNameIt")}
                </label>
                <input
                  type="text"
                  value={nameIt}
                  onChange={(e) => setNameIt(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-sky-100">
                  {t("produktBeschreibung")}
                </label>
                <textarea
                  value={beschreibung}
                  onChange={(e) => setBeschreibung(e.target.value)}
                  maxLength={300}
                  required
                  className="min-h-[90px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <p className="text-[10px] text-slate-500">
                  {beschreibung.length}/300
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-sky-100">
                  {t("produktBeschreibungIt")}
                </label>
                <textarea
                  value={beschreibungIt}
                  onChange={(e) => setBeschreibungIt(e.target.value)}
                  maxLength={300}
                  required
                  className="min-h-[90px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <p className="text-[10px] text-slate-500">
                  {beschreibungIt.length}/300
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-sky-100">
                  {t("kategorieWaehlen")}
                </label>
                <select
                  value={kategorieId}
                  onChange={(e) => setKategorieId(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="">{t("bitteWaehlen")}</option>
                  {kategorien?.map((kat) => (
                    <option key={kat._id} value={kat._id}>
                      {kat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-sky-100">
                  {t("fotDateiname")}
                </label>
                <input
                  id="foto-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setSelectedImage(e.target.files?.[0] || null)
                  }
                  required
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 file:mr-3 file:rounded file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-950 hover:file:bg-sky-500"
                />
                <p className="text-[10px] text-slate-500">
                  Optimal: quadratisches Bild, max. 1–2&nbsp;MB.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-w-[180px] items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Speichern…" : t("produktSpeichern")}
              </button>
            </div>
          </form>

          <aside className="space-y-4 rounded-xl border border-sky-900/60 bg-slate-900/70 p-5 text-xs text-slate-300">
            <div>
              <h2 className="text-sm font-semibold text-sky-100">
                Hinweis zur Pflege
              </h2>
              <p className="mt-2">
                Produkte werden auf der Website in mehreren Sprachen
                ausgespielt. Achte darauf, dass die deutschen und italienischen
                Texte jeweils vollständig sind.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-sky-100">
                Bildempfehlungen
              </h3>
              <ul className="list-disc pl-4">
                <li>Klare, helle Produktfotos</li>
                <li>Keine Logos im Bild</li>
                <li>Vorzugsweise 1:1 oder 4:3 Format</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

