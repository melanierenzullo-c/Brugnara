"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation } from "convex/react";
import Image from "next/image";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { AdminHeader } from "@/components/admin-header";

/* ─────────────────── shared types ─────────────────── */

type Lang = "de" | "it";

interface ProduktRow {
  _id: Id<"produkte">;
  name: string;
  beschreibung: string;
  nameIt: string;
  beschreibungIt: string;
  kategorieId: Id<"kategorien">;
  slug: string;
  foto: Id<"_storage">;
  imageUrl: string | null;
  kategorieName: string;
}

/* ─────────────────── small UI pieces ─────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-foreground">{label}</label>
      {children}
    </div>
  );
}

function LangTabInput({
  label, valueDe, valueIt, onChangeDe, onChangeIt,
  multiline = false, required = false, maxLength,
}: {
  label: string; valueDe: string; valueIt: string;
  onChangeDe: (v: string) => void; onChangeIt: (v: string) => void;
  multiline?: boolean; required?: boolean; maxLength?: number;
}) {
  const [lang, setLang] = useState<Lang>("de");
  const value = lang === "de" ? valueDe : valueIt;
  const onChange = lang === "de" ? onChangeDe : onChangeIt;

  const cls =
    "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        <div className="flex items-center gap-0.5 rounded-full bg-slate-100 p-0.5">
          {(["de", "it"] as Lang[]).map((l) => {
            const isEmpty = required && (l === "de" ? valueDe : valueIt).trim() === "";
            return (
              <button key={l} type="button" onClick={() => setLang(l)}
                className={`relative rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all ${lang === l ? "bg-white text-foreground shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
                {l.toUpperCase()}
                {isEmpty && <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-red-400" />}
              </button>
            );
          })}
        </div>
      </div>
      {multiline ? (
        <>
          <textarea value={value} onChange={(e) => onChange(e.target.value)}
            maxLength={maxLength} required={required && lang === "de"}
            className={`${cls} min-h-[110px] resize-none`} />
          {maxLength && (
            <p className="text-xs text-slate-400 text-right">{value.length} / {maxLength}</p>
          )}
        </>
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          required={required && lang === "de"} className={cls} />
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function Alert({ text, ok }: { text: string; ok: boolean }) {
  return (
    <div className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${ok ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-700"}`}>
      {ok
        ? <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        : <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      }
      {text}
    </div>
  );
}

/* ─────────────────── main page ─────────────────── */

export default function AdminProduktePage() {
  const t = useTranslations("Admin");
  const kategorien = useQuery(api.kategorien.list);
  const produkte = useQuery(api.produkte.list) as ProduktRow[] | undefined;

  const createProdukt = useMutation(api.produkte.create);
  const updateProdukt = useMutation(api.produkte.update);
  const removeProdukt = useMutation(api.produkte.remove);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  /* ── form state (shared for create & edit) ── */
  const [editingId, setEditingId] = useState<Id<"produkte"> | null>(null);
  const [name, setName] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [nameIt, setNameIt] = useState("");
  const [beschreibungIt, setBeschreibungIt] = useState("");
  const [kategorieId, setKategorieId] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [meldung, setMeldung] = useState<{ text: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  /* ── delete state ── */
  const [deletingId, setDeletingId] = useState<Id<"produkte"> | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isEditing = editingId !== null;

  const resetForm = useCallback(() => {
    setEditingId(null);
    setName("");
    setBeschreibung("");
    setNameIt("");
    setBeschreibungIt("");
    setKategorieId("");
    setSelectedImage(null);
    const fi = document.getElementById("foto-upload") as HTMLInputElement | null;
    if (fi) fi.value = "";
  }, []);

  const startEdit = useCallback((p: ProduktRow) => {
    setEditingId(p._id);
    setName(p.name);
    setBeschreibung(p.beschreibung);
    setNameIt(p.nameIt);
    setBeschreibungIt(p.beschreibungIt);
    setKategorieId(p.kategorieId);
    setSelectedImage(null);
    setMeldung(null);
    const fi = document.getElementById("foto-upload") as HTMLInputElement | null;
    if (fi) fi.value = "";
    // scroll to form
    setTimeout(() => document.getElementById("produkt-form")?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  const handleDelete = async (id: Id<"produkte">) => {
    setDeleting(true);
    try {
      await removeProdukt({ id });
      setMeldung({ text: "Produkt erfolgreich gelöscht.", ok: true });
      if (editingId === id) resetForm();
    } catch (error) {
      setMeldung({ text: error instanceof Error ? error.message : "Fehler beim Löschen", ok: false });
    } finally {
      setDeleting(false);
      setDeletingId(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMeldung(null);
    if (!name.trim() || !nameIt.trim()) {
      setMeldung({ text: "Bitte Produktname in Deutsch und Italienisch eingeben.", ok: false }); return;
    }
    if (!beschreibung.trim() || !beschreibungIt.trim()) {
      setMeldung({ text: "Bitte Beschreibung in Deutsch und Italienisch eingeben.", ok: false }); return;
    }
    if (!kategorieId) { setMeldung({ text: t("bitteKategorie"), ok: false }); return; }
    if (!isEditing && !selectedImage) { setMeldung({ text: t("bitteFoto"), ok: false }); return; }

    try {
      setSaving(true);
      let storageId: Id<"_storage"> | undefined;
      if (selectedImage) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, { method: "POST", headers: { "Content-Type": selectedImage.type }, body: selectedImage });
        if (!result.ok) throw new Error("Fehler beim Hochladen des Bildes");
        const json = await result.json();
        storageId = json.storageId as Id<"_storage">;
      }

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      if (isEditing) {
        await updateProdukt({
          id: editingId,
          name,
          beschreibung,
          nameIt,
          beschreibungIt,
          kategorieId: kategorieId as Id<"kategorien">,
          slug,
          ...(storageId ? { foto: storageId } : {}),
        });
        setMeldung({ text: "Produkt erfolgreich aktualisiert.", ok: true });
        resetForm();
      } else {
        if (!storageId) throw new Error("Kein Bild ausgewählt");
        await createProdukt({
          name, beschreibung, foto: storageId, nameIt, beschreibungIt,
          kategorieId: kategorieId as Id<"kategorien">, slug,
        });
        setMeldung({ text: "Produkt erfolgreich gespeichert.", ok: true });
        resetForm();
      }
    } catch (error) {
      setMeldung({ text: error instanceof Error ? error.message : "Unbekannter Fehler", ok: false });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition";

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader title="Produkte" backHref="/admin" backLabel="Dashboard" />

      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">

        {meldung && <Alert text={meldung.text} ok={meldung.ok} />}

        {/* ────────── Product list ────────── */}
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Alle Produkte</h1>
              <p className="mt-0.5 text-sm text-slate-500">
                {produkte ? `${produkte.length} Produkte` : "Laden…"}
              </p>
            </div>
          </div>

          {!produkte ? (
            <div className="flex items-center justify-center py-16 text-slate-400 text-sm gap-2">
              <Spinner /> Laden…
            </div>
          ) : produkte.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
              Noch keine Produkte vorhanden.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Bild</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Name (DE)</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">Name (IT)</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">Kategorie</th>
                    <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {produkte.map((p) => (
                    <tr key={p._id}
                      className={`border-b border-slate-50 transition hover:bg-slate-50/60 ${editingId === p._id ? "bg-primary/5" : ""}`}>
                      {/* Thumbnail */}
                      <td className="px-4 py-3">
                        {p.imageUrl ? (
                          <Image src={p.imageUrl} alt={p.name} width={44} height={44}
                            className="h-11 w-11 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                          </div>
                        )}
                      </td>
                      {/* Name DE */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">{p.name}</p>
                        <p className="mt-0.5 text-xs text-slate-400 truncate max-w-[220px]">{p.beschreibung}</p>
                      </td>
                      {/* Name IT */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-foreground">{p.nameIt}</p>
                      </td>
                      {/* Kategorie */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{p.kategorieName}</span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        {deletingId === p._id ? (
                          <div className="inline-flex items-center gap-2">
                            <span className="text-xs text-red-600 font-semibold">Löschen?</span>
                            <button type="button" disabled={deleting}
                              onClick={() => handleDelete(p._id)}
                              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50">
                              {deleting ? <Spinner /> : "Ja"}
                            </button>
                            <button type="button" onClick={() => setDeletingId(null)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                              Nein
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            <button type="button" onClick={() => startEdit(p)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-primary/30 hover:text-primary">
                              Bearbeiten
                            </button>
                            <button type="button" onClick={() => setDeletingId(p._id)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600">
                              Löschen
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ────────── Create / Edit form ────────── */}
        <section id="produkt-form">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-foreground">
              {isEditing ? "Produkt bearbeiten" : "Neues Produkt anlegen"}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {isEditing
                ? "Ändere die Daten und speichere."
                : "Füge ein neues Produkt in Deutsch und Italienisch hinzu."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">

              {/* Main card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">

                <LangTabInput
                  label="Produktname"
                  valueDe={name} valueIt={nameIt}
                  onChangeDe={setName} onChangeIt={setNameIt}
                  required
                />

                <LangTabInput
                  label="Beschreibung"
                  valueDe={beschreibung} valueIt={beschreibungIt}
                  onChangeDe={setBeschreibung} onChangeIt={setBeschreibungIt}
                  multiline required maxLength={300}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Kategorie">
                    <select value={kategorieId} onChange={(e) => setKategorieId(e.target.value)} required className={inputClass}>
                      <option value="">Bitte wählen…</option>
                      {kategorien?.map((kat) => <option key={kat._id} value={kat._id}>{kat.name}</option>)}
                    </select>
                  </Field>

                  <Field label={isEditing ? "Neues Produktbild (optional)" : "Produktbild"}>
                    <input id="foto-upload" type="file" accept="image/*"
                      onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                      required={!isEditing}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-foreground file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 transition cursor-pointer" />
                    <p className="text-xs text-slate-400 mt-1">
                      {isEditing ? "Nur wählen wenn du das Bild ändern möchtest." : "Quadratisch, max. 1–2 MB"}
                    </p>
                  </Field>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Save card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                  <button type="submit" disabled={saving}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
                    {saving && <Spinner />}
                    {saving
                      ? "Wird gespeichert…"
                      : isEditing
                        ? "Änderungen speichern"
                        : "Produkt speichern"}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={resetForm}
                      className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                      Abbrechen
                    </button>
                  )}
                  <p className="text-xs text-center text-slate-400">Beide Sprachen müssen ausgefüllt sein.</p>
                </div>

                {/* Tips card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-foreground">Bildtipps</p>
                  <ul className="space-y-2.5 text-xs text-slate-500">
                    {[
                      "Format 1:1 oder 4:3",
                      "Helles, klares Produktfoto",
                      "Keine Logos im Bild",
                      "Max. 1–2 MB Dateigröße",
                    ].map((text) => (
                      <li key={text} className="flex items-center gap-2">
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Language reminder */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-xs font-bold text-primary">Zweisprachig</p>
                  </div>
                  <p className="text-xs text-primary/80 leading-relaxed">Mit den <strong>DE / IT</strong>-Tabs zwischen den Sprachen wechseln.</p>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
