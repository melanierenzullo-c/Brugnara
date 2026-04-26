"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import Image from "next/image";
import { Search } from "lucide-react";

import Link from "next/link";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { AdminHeader } from "@/components/admin-header";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ─────────────────── shared types ─────────────────── */

type Lang = "de" | "it" | "en";

interface ProduktRow {
  _id: Id<"produkte">;
  name: string;
  beschreibung: string;
  nameIt: string;
  beschreibungIt: string;
  nameEn?: string;
  beschreibungEn?: string;
  kategorieId: Id<"kategorien">;
  slug: string;
  foto: Id<"_storage">;
  imageUrl: string | null;
  kategorieName: string;
}

interface ProduktDraftRow {
  _id: Id<"produktEntwuerfe">;
  name: string;
  beschreibung: string;
  nameIt: string;
  beschreibungIt: string;
  nameEn?: string;
  beschreibungEn?: string;
  kategorieId?: Id<"kategorien">;
  foto?: Id<"_storage">;
  updatedAt: number;
  ownerName?: string;
  isOwner?: boolean;
}

function getFriendlyErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) return fallback;
  const message = error.message ?? "";
  const convexMatch = message.match(/ConvexError:\s*([\s\S]+?)(?:\s+at handler|$)/);
  if (convexMatch?.[1]) return convexMatch[1].trim();
  return message.trim() || fallback;
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
  label, valueDe, valueIt, valueEn, onChangeDe, onChangeIt, onChangeEn,
  multiline = false, required = false, maxLength,
  onTranslate, translating = false,
  lang: externalLang, onLangChange,
  showLangSwitcher = true,
  isDotVisibleDe,
  isDotVisibleIt,
  isDotVisibleEn,
}: {
  label: string; valueDe: string; valueIt: string; valueEn: string;
  onChangeDe: (v: string) => void; onChangeIt: (v: string) => void; onChangeEn: (v: string) => void;
  multiline?: boolean; required?: boolean; maxLength?: number;
  onTranslate?: () => void; translating?: boolean;
  lang?: Lang; onLangChange?: (l: Lang) => void;
  showLangSwitcher?: boolean;
  isDotVisibleDe?: boolean;
  isDotVisibleIt?: boolean;
  isDotVisibleEn?: boolean;
}) {
  const [internalLang, setInternalLang] = useState<Lang>("de");
  const lang = externalLang ?? internalLang;
  const setLang = onLangChange ?? setInternalLang;
  const value = lang === "de" ? valueDe : lang === "it" ? valueIt : valueEn;
  const onChange = lang === "de" ? onChangeDe : lang === "it" ? onChangeIt : onChangeEn;

  const cls =
    "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        <div className="flex items-center gap-1.5">
          {onTranslate && valueDe.trim() && (
            <button type="button" onClick={onTranslate} disabled={translating}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary transition hover:bg-primary/20 disabled:opacity-50">
              {translating ? <Spinner /> : "DE -> IT + EN"}
            </button>
          )}
          {showLangSwitcher && (
            <div className="flex items-center gap-0.5 rounded-full bg-slate-100 p-0.5">
              {(["de", "it", "en"] as Lang[]).map((l) => {
                const defaultIsEmpty = required && (l === "de" ? valueDe : l === "it" ? valueIt : valueEn).trim() === "";
                const showDot = (l === "de" ? isDotVisibleDe : l === "it" ? isDotVisibleIt : isDotVisibleEn) ?? defaultIsEmpty;
                return (
                  <button key={l} type="button" onClick={() => setLang(l)}
                    className={`relative rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all ${lang === l ? "bg-white text-foreground shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
                    {l.toUpperCase()}
                    {showDot && <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-red-400" />}
                  </button>
                );
              })}
            </div>
          )}
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
  const { isAuthenticated } = useConvexAuth();
  const kategorien = useQuery(api.kategorien.list, isAuthenticated ? {} : "skip");
  const produkte = useQuery(api.produkte.list, isAuthenticated ? {} : "skip") as ProduktRow[] | undefined;
  const drafts = useQuery(api.produkte.listDrafts, isAuthenticated ? {} : "skip") as ProduktDraftRow[] | undefined;

  const createProdukt = useMutation(api.produkte.create);
  const updateProdukt = useMutation(api.produkte.update);
  const removeProdukt = useMutation(api.produkte.remove);
  const createDraft = useMutation(api.produkte.createDraft);
  const saveDraft = useMutation(api.produkte.saveDraft);
  const deleteDraft = useMutation(api.produkte.deleteDraft);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const deleteFile = useMutation(api.files.deleteFile);

  /* ── form state (shared for create & edit) ── */
  const [editingId, setEditingId] = useState<Id<"produkte"> | null>(null);
  const [name, setName] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [nameIt, setNameIt] = useState("");
  const [beschreibungIt, setBeschreibungIt] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [beschreibungEn, setBeschreibungEn] = useState("");
  const [kategorieId, setKategorieId] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [meldung, setMeldung] = useState<{ text: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState<Id<"produktEntwuerfe"> | null>(null);
  const [activeDraftFotoId, setActiveDraftFotoId] = useState<Id<"_storage"> | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [lastDraftSavedAt, setLastDraftSavedAt] = useState<number | null>(null);
  const creatingDraftRef = useRef(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [draftTab, setDraftTab] = useState("produkte");

  /* ── delete state ── */
  const [deletingId, setDeletingId] = useState<Id<"produkte"> | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ── shared language tab ── */
  const [formLang, setFormLang] = useState<Lang>("de");

  /* ── translation ── */
  const [translatingField, setTranslatingField] = useState<string | null>(null);
  const [translatingAll, setTranslatingAll] = useState(false);

  const translate = async (text: string, target: "it" | "en"): Promise<string> => {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, target }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(
        typeof data?.error === "string"
          ? data.error
          : "Übersetzung fehlgeschlagen. Bitte versuche es erneut."
      );
    }
    const data = await res.json();
    return data.translation;
  };

  const handleTranslateField = async (
    field: string,
    value: string,
    setterIt: (v: string) => void,
    setterEn: (v: string) => void
  ) => {
    if (!value.trim() || translatingField) return;
    setTranslatingField(field);
    try {
      const [translatedIt, translatedEn] = await Promise.all([
        translate(value, "it"),
        translate(value, "en"),
      ]);
      setterIt(translatedIt);
      setterEn(translatedEn);
    } catch {
      setMeldung({ text: "Übersetzung fehlgeschlagen. Bitte versuche es erneut.", ok: false });
    } finally {
      setTranslatingField(null);
    }
  };

  const handleTranslateAll = async () => {
    if (translatingAll) return;
    setTranslatingAll(true);
    try {
      const [
        translatedNameIt,
        translatedNameEn,
        translatedBeschreibungIt,
        translatedBeschreibungEn,
      ] = await Promise.all([
        name.trim() ? translate(name, "it") : Promise.resolve(nameIt),
        name.trim() ? translate(name, "en") : Promise.resolve(nameEn),
        beschreibung.trim() ? translate(beschreibung, "it") : Promise.resolve(beschreibungIt),
        beschreibung.trim() ? translate(beschreibung, "en") : Promise.resolve(beschreibungEn),
      ]);
      if (name.trim()) {
        setNameIt(translatedNameIt);
        setNameEn(translatedNameEn);
      }
      if (beschreibung.trim()) {
        setBeschreibungIt(translatedBeschreibungIt);
        setBeschreibungEn(translatedBeschreibungEn);
      }
      setMeldung({ text: "Alle Felder wurden auf IT und EN übersetzt.", ok: true });
    } catch {
      setMeldung({ text: "Übersetzung fehlgeschlagen. Bitte versuche es erneut.", ok: false });
    } finally {
      setTranslatingAll(false);
    }
  };

  const isEditing = editingId !== null;

  const ensureActiveDraftId = useCallback(async (): Promise<Id<"produktEntwuerfe"> | null> => {
    if (activeDraftId) return activeDraftId;
    try {
      creatingDraftRef.current = true;
      const id = await createDraft({});
      setActiveDraftId(id);
      return id;
    } catch {
      setMeldung({ text: "Entwurf konnte nicht erstellt werden.", ok: false });
      return null;
    } finally {
      creatingDraftRef.current = false;
    }
  }, [activeDraftId, createDraft]);

  useEffect(() => {
    if (isEditing || activeDraftId || creatingDraftRef.current) return;
    const hasContent = Boolean(
      name.trim() ||
      beschreibung.trim() ||
      nameIt.trim() ||
      beschreibungIt.trim() ||
      nameEn.trim() ||
      beschreibungEn.trim() ||
      kategorieId
    );
    if (!hasContent) return;
    void ensureActiveDraftId();
  }, [isEditing, activeDraftId, name, beschreibung, nameIt, beschreibungIt, nameEn, beschreibungEn, kategorieId, ensureActiveDraftId]);

  useEffect(() => {
    if (!activeDraftId || isEditing) return;
    const timer = setTimeout(async () => {
      const isEmpty =
        name.trim() === "" &&
        beschreibung.trim() === "" &&
        nameIt.trim() === "" &&
        beschreibungIt.trim() === "" &&
        nameEn.trim() === "" &&
        beschreibungEn.trim() === "" &&
        !kategorieId &&
        !activeDraftFotoId;

      try {
        setSavingDraft(true);
        if (isEmpty) {
          await deleteDraft({ id: activeDraftId });
          setActiveDraftId(null);
          setActiveDraftFotoId(null);
          setLastDraftSavedAt(null);
        } else {
          await saveDraft({
            id: activeDraftId,
            name,
            beschreibung,
            nameIt,
            beschreibungIt,
            nameEn,
            beschreibungEn,
            kategorieId: kategorieId ? (kategorieId as Id<"kategorien">) : undefined,
          });
          setLastDraftSavedAt(Date.now());
        }
      } catch {
        setMeldung({ text: "Entwurf konnte nicht gespeichert werden.", ok: false });
      } finally {
        setSavingDraft(false);
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [activeDraftId, name, beschreibung, nameIt, beschreibungIt, nameEn, beschreibungEn, kategorieId, activeDraftFotoId, isEditing, saveDraft, deleteDraft]);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setName("");
    setBeschreibung("");
    setNameIt("");
    setBeschreibungIt("");
    setNameEn("");
    setBeschreibungEn("");
    setKategorieId("");
    setSelectedImage(null);
    const fi = document.getElementById("foto-upload") as HTMLInputElement | null;
    if (fi) fi.value = "";
  }, []);

  const handleCreateDraft = async () => {
    try {
      const id = await createDraft({});
      setActiveDraftId(id);
      setEditingId(null);
      setName("");
      setBeschreibung("");
      setNameIt("");
      setBeschreibungIt("");
      setNameEn("");
      setBeschreibungEn("");
      setKategorieId("");
      setSelectedImage(null);
      setActiveDraftFotoId(null);
      setMeldung({ text: "Neuer Entwurf erstellt.", ok: true });
    } catch {
      setMeldung({ text: "Entwurf konnte nicht erstellt werden.", ok: false });
    }
  };

  const handleLoadDraft = (draft: ProduktDraftRow) => {
    setEditingId(null);
    setActiveDraftId(draft._id);
    setName(draft.name);
    setBeschreibung(draft.beschreibung);
    setNameIt(draft.nameIt);
    setBeschreibungIt(draft.beschreibungIt);
    setNameEn(draft.nameEn ?? draft.name);
    setBeschreibungEn(draft.beschreibungEn ?? draft.beschreibung);
    setKategorieId(draft.kategorieId ?? "");
    setActiveDraftFotoId(draft.foto ?? null);
    setSelectedImage(null);
    // Keep the bottom tab state as-is (e.g. Entwürfe stays open)
  };

  const handleDeleteDraft = async (id: Id<"produktEntwuerfe">) => {
    try {
      await deleteDraft({ id });
      if (activeDraftId === id) {
        setActiveDraftId(null);
        setActiveDraftFotoId(null);
        resetForm();
      }
      setMeldung({ text: "Entwurf gelöscht.", ok: true });
    } catch {
      setMeldung({ text: "Entwurf konnte nicht gelöscht werden.", ok: false });
    }
  };

  const startEdit = useCallback((p: ProduktRow) => {
    setEditingId(p._id);
    setName(p.name);
    setBeschreibung(p.beschreibung);
    setNameIt(p.nameIt);
    setBeschreibungIt(p.beschreibungIt);
    setNameEn(p.nameEn ?? p.name);
    setBeschreibungEn(p.beschreibungEn ?? p.beschreibung);
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
      setMeldung({ text: getFriendlyErrorMessage(error, "Fehler beim Löschen"), ok: false });
    } finally {
      setDeleting(false);
      setDeletingId(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMeldung(null);
    if (!name.trim() || !nameIt.trim() || !nameEn.trim()) {
      setMeldung({ text: "Bitte Produktname in Deutsch, Italienisch und Englisch eingeben.", ok: false }); return;
    }
    if (!beschreibung.trim() || !beschreibungIt.trim() || !beschreibungEn.trim()) {
      setMeldung({ text: "Bitte Beschreibung in Deutsch, Italienisch und Englisch eingeben.", ok: false }); return;
    }
    if (!kategorieId) { setMeldung({ text: t("bitteKategorie"), ok: false }); return; }
    if (!isEditing && !selectedImage && !activeDraftFotoId) { setMeldung({ text: t("bitteFoto"), ok: false }); return; }

    try {
      setSaving(true);
      let storageId: Id<"_storage"> | undefined = activeDraftFotoId ?? undefined;
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
          nameEn,
          beschreibungEn,
          kategorieId: kategorieId as Id<"kategorien">,
          slug,
          ...(storageId ? { foto: storageId } : {}),
        });
        setMeldung({ text: "Produkt erfolgreich aktualisiert.", ok: true });
        resetForm();
      } else {
        if (!storageId) throw new Error("Kein Bild ausgewählt");
        await createProdukt({
          name, beschreibung, foto: storageId, nameIt, beschreibungIt, nameEn, beschreibungEn,
          kategorieId: kategorieId as Id<"kategorien">, slug,
        });
        setMeldung({ text: "Produkt erfolgreich gespeichert.", ok: true });
        if (activeDraftId) {
          await deleteDraft({ id: activeDraftId });
          setActiveDraftId(null);
          setActiveDraftFotoId(null);
        }
        resetForm();
      }
    } catch (error) {
      setMeldung({ text: getFriendlyErrorMessage(error, "Unbekannter Fehler"), ok: false });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition";
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProdukte = produkte?.filter((p) => {
    if (!normalizedQuery) return true;
    return (
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.nameIt.toLowerCase().includes(normalizedQuery) ||
      p.beschreibung.toLowerCase().includes(normalizedQuery) ||
      p.beschreibungIt.toLowerCase().includes(normalizedQuery) ||
      p.kategorieName.toLowerCase().includes(normalizedQuery)
    );
  });

  const handleDraftImageChange = async (file: File | null) => {
    setSelectedImage(file);
    if (!file || isEditing) return;

    const draftId = await ensureActiveDraftId();
    if (!draftId) return;

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!result.ok) throw new Error("Fehler beim Hochladen des Bildes");
      const json = await result.json();
      const storageId = json.storageId as Id<"_storage">;

      if (activeDraftFotoId && activeDraftFotoId !== storageId) {
        await deleteFile({ storageId: activeDraftFotoId });
      }

      await saveDraft({
        id: draftId,
        name,
        beschreibung,
        nameIt,
        beschreibungIt,
        nameEn,
        beschreibungEn,
        kategorieId: kategorieId ? (kategorieId as Id<"kategorien">) : undefined,
        foto: storageId,
      });
      setActiveDraftFotoId(storageId);
      setLastDraftSavedAt(Date.now());
    } catch {
      setMeldung({ text: "Entwurfsbild konnte nicht gespeichert werden.", ok: false });
    }
  };

  const missingFields = [];
  if (!name.trim() || !nameIt.trim() || !nameEn.trim()) missingFields.push("Produktname (alle Sprachen)");
  if (!beschreibung.trim() || !beschreibungIt.trim() || !beschreibungEn.trim()) missingFields.push("Beschreibung (alle Sprachen)");
  if (!kategorieId) missingFields.push("Kategorie");
  if (!isEditing && !selectedImage && !activeDraftFotoId) missingFields.push("Produktbild");

  const deIncomplete = !name.trim() || !beschreibung.trim() || !kategorieId || (!isEditing && !selectedImage && !activeDraftFotoId);
  const itIncomplete = !nameIt.trim() || !beschreibungIt.trim() || !kategorieId || (!isEditing && !selectedImage && !activeDraftFotoId);
  const enIncomplete = !nameEn.trim() || !beschreibungEn.trim() || !kategorieId || (!isEditing && !selectedImage && !activeDraftFotoId);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader title="Produkte" backHref="/admin" backLabel="Dashboard" />

      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">

        {meldung && <Alert text={meldung.text} ok={meldung.ok} />}

        {/* ────────── Create / Edit form ────────── */}
        <section id="produkt-form" className="mb-20">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {isEditing ? "Produkt bearbeiten" : "Neues Produkt anlegen"}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {isEditing
                  ? "Ändere die Daten und speichere."
                  : "Füge ein neues Produkt in Deutsch und Italienisch hinzu."}
              </p>
            </div>
            {(name.trim() || beschreibung.trim()) && (
              <button type="button" onClick={handleTranslateAll} disabled={translatingAll}
                className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-50">
                {translatingAll ? <Spinner /> : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                )}
                {translatingAll ? "Übersetze…" : "Alle übersetzen"}
              </button>
            )}
          </div>

          {!isEditing && activeDraftId && (
            <p className="mb-3 mt-1 text-xs text-slate-400">
              {savingDraft
                ? "Entwurf wird gespeichert…"
                : lastDraftSavedAt
                  ? `Entwurf gespeichert um ${new Date(lastDraftSavedAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`
                  : "Auto-Save aktiv"}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">

              {/* Main card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">

                <LangTabInput
                  label="Produktname"
                  valueDe={name} valueIt={nameIt} valueEn={nameEn}
                  onChangeDe={setName} onChangeIt={setNameIt} onChangeEn={setNameEn}
                  required
                  onTranslate={() => handleTranslateField("name", name, setNameIt, setNameEn)}
                  translating={translatingField === "name"}
                  lang={formLang} onLangChange={setFormLang}
                  isDotVisibleDe={deIncomplete}
                  isDotVisibleIt={itIncomplete}
                  isDotVisibleEn={enIncomplete}
                />

                <LangTabInput
                  label="Beschreibung"
                  valueDe={beschreibung} valueIt={beschreibungIt} valueEn={beschreibungEn}
                  onChangeDe={setBeschreibung} onChangeIt={setBeschreibungIt} onChangeEn={setBeschreibungEn}
                  multiline required maxLength={300}
                  onTranslate={() => handleTranslateField("beschreibung", beschreibung, setBeschreibungIt, setBeschreibungEn)}
                  translating={translatingField === "beschreibung"}
                  lang={formLang} onLangChange={setFormLang}
                  showLangSwitcher={false}
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
                      onChange={(e) => void handleDraftImageChange(e.target.files?.[0] || null)}
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
                  {(editingId || activeDraftId) && (
                    <button
                      type="button"
                      onClick={() => {
                        const query = editingId
                          ? `id=${editingId}`
                          : `draftId=${activeDraftId}`;
                        window.open(`/admin/produkte/vorschau?${query}`, "_blank");
                      }}
                      className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      Vorschau öffnen
                    </button>
                  )}
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
                  {missingFields.length > 0 ? (
                    <div className="rounded-lg bg-red-50 p-3 mt-2 border border-red-100">
                      <p className="text-xs font-semibold text-red-800 mb-1 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-500 shrink-0 animate-pulse" />
                        Es fehlen noch:
                      </p>
                      <ul className="text-xs text-red-700 pl-4 list-disc space-y-0.5">
                        {missingFields.map((field) => (
                          <li key={field}>{field}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-green-50 p-3 mt-2 border border-green-100">
                      <p className="text-xs font-semibold text-green-700 flex items-center justify-center gap-1.5">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Formular vollständig
                      </p>
                    </div>
                  )}
                </div>

                {/* Tips card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-foreground">Bildtipps</p>
                  <ul className="space-y-2.5 text-xs text-slate-500">
                    {[
                      "Format 1:1",
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

        {/* ────────── Product list ────────── */}
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Alle Produkte</h1>
              <p className="mt-0.5 text-sm text-slate-500">
                {produkte
                  ? `${filteredProdukte?.length ?? 0} von ${produkte.length} Produkte`
                  : "Laden…"}
              </p>
            </div>
            <Link href="/admin/produkte/papierkorb"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Papierkorb
            </Link>
          </div>
          <Tabs value={draftTab} onValueChange={setDraftTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="produkte">Alle Produkte</TabsTrigger>
              <TabsTrigger value="drafts">Entwürfe</TabsTrigger>
            </TabsList>

            <TabsContent value="produkte">
              <div className="relative mb-5 max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Produkte suchen..."
                  className="h-11 rounded-full border-border/60 bg-white pl-10"
                />
              </div>

              {!produkte ? (
                <div className="flex items-center justify-center py-16 text-slate-400 text-sm gap-2">
                  <Spinner /> Laden…
                </div>
              ) : filteredProdukte?.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
                  Keine passenden Produkte gefunden.
                </div>
              ) : (
                <div className="overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)]">
                  <div className="overflow-x-auto">
                  <table className="w-full min-w-[940px] table-fixed text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/85">
                        <th className="px-5 py-3 text-left text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Bild</th>
                        <th className="px-5 py-3 text-left text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Name (DE)</th>
                        <th className="px-5 py-3 text-left text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500 hidden md:table-cell">Name (IT)</th>
                        <th className="px-5 py-3 text-left text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500 hidden lg:table-cell">Name (EN)</th>
                        <th className="px-5 py-3 text-left text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500 hidden lg:table-cell">Kategorie</th>
                        <th className="w-[220px] px-6 py-3 text-right text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProdukte?.map((p) => (
                        <tr key={p._id}
                          className={`border-b border-slate-100/80 transition-colors hover:bg-slate-50/70 ${editingId === p._id ? "bg-primary/5" : ""}`}>
                          {/* Thumbnail */}
                          <td className="px-5 py-3.5">
                            {p.imageUrl ? (
                              <Image src={p.imageUrl} alt={p.name} width={44} height={44}
                                className="h-11 w-11 rounded-xl border border-slate-200 object-cover shadow-sm" />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-300">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                              </div>
                            )}
                          </td>
                          {/* Name DE */}
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-foreground leading-tight">{p.name}</p>
                            <p className="mt-1 text-xs text-slate-500 truncate max-w-[220px]">{p.beschreibung}</p>
                          </td>
                          {/* Name IT */}
                          <td className="px-5 py-3.5 hidden md:table-cell">
                            <p className="font-semibold text-foreground leading-tight">{p.nameIt}</p>
                            <p className="mt-1 text-xs text-slate-500 truncate max-w-[220px]">{p.beschreibungIt}</p>
                          </td>
                          {/* Name EN */}
                          <td className="px-5 py-3.5 hidden lg:table-cell">
                            <p className="font-semibold text-foreground leading-tight">{p.nameEn || p.name}</p>
                            <p className="mt-1 text-xs text-slate-500 truncate max-w-[220px]">{p.beschreibungEn || p.beschreibung}</p>
                          </td>
                          {/* Kategorie */}
                          <td className="px-5 py-3.5 hidden lg:table-cell">
                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">{p.kategorieName}</span>
                          </td>
                          {/* Actions */}
                          <td className="px-6 py-3.5 text-right whitespace-nowrap">
                            {deletingId === p._id ? (
                              <div className="inline-flex items-center gap-2">
                                <span className="text-xs text-red-600 font-semibold">Löschen?</span>
                                <button type="button" disabled={deleting}
                                  onClick={() => handleDelete(p._id)}
                                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50 shadow-sm">
                                  {deleting ? <Spinner /> : "Ja"}
                                </button>
                                <button type="button" onClick={() => setDeletingId(null)}
                                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                                  Nein
                                </button>
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-end gap-2">
                                <button type="button" onClick={() => startEdit(p)}
                                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary">
                                  Bearbeiten
                                </button>
                                <button type="button" onClick={() => setDeletingId(p._id)}
                                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
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
                </div>
              )}
            </TabsContent>
            <TabsContent value="drafts">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">Entwürfe</p>
                  <button
                    type="button"
                    onClick={handleCreateDraft}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Neuer Entwurf
                  </button>
                </div>
                <div className="space-y-2">
                  {drafts?.map((draft, index) => (
                    <div
                      key={draft._id}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-xs ${activeDraftId === draft._id ? "border-primary/40 bg-primary/10 text-primary" : "border-slate-200 bg-white text-slate-600"}`}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{draft.name.trim() || `Entwurf ${index + 1}`}</p>
                        <p className="text-[11px] text-slate-400">
                          Zuletzt bearbeitet: {new Date(draft.updatedAt).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <p className="text-[11px] text-slate-400">Erstellt von: {draft.ownerName ?? "Unbekannt"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleLoadDraft(draft)} className="rounded-md border border-slate-200 px-2 py-1 hover:bg-slate-50">
                          Öffnen
                        </button>
                        <button type="button" onClick={() => handleDeleteDraft(draft._id)} className="text-slate-400 hover:text-red-600">
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  {!drafts?.length && <p className="text-xs text-slate-400">Noch keine Entwürfe vorhanden.</p>}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
