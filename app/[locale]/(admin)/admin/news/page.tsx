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

interface NewsRow {
  _id: Id<"news">;
  titel: string;
  inhalt: string;
  titelIt: string;
  inhaltIt: string;
  titelEn?: string;
  inhaltEn?: string;
  foto: Id<"_storage">;
  imageUrl: string | null;
  createdAt: number;
}

interface NewsDraftRow {
  _id: Id<"newsEntwuerfe">;
  titel: string;
  inhalt: string;
  titelIt: string;
  inhaltIt: string;
  titelEn?: string;
  inhaltEn?: string;
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

export default function AdminNewsPage() {
  const t = useTranslations("Admin");
  const { isAuthenticated } = useConvexAuth();
  const newsItems = useQuery(api.news.list, isAuthenticated ? {} : "skip") as NewsRow[] | undefined;
  const drafts = useQuery(api.news.listDrafts, isAuthenticated ? {} : "skip") as NewsDraftRow[] | undefined;

  const createNews = useMutation(api.news.create);
  const updateNews = useMutation(api.news.update);
  const removeNews = useMutation(api.news.remove);
  const createDraft = useMutation(api.news.createDraft);
  const saveDraft = useMutation(api.news.saveDraft);
  const deleteDraft = useMutation(api.news.deleteDraft);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const deleteFile = useMutation(api.files.deleteFile);

  /* ── form state (shared for create & edit) ── */
  const [editingId, setEditingId] = useState<Id<"news"> | null>(null);
  const [titel, setTitel] = useState("");
  const [inhalt, setInhalt] = useState("");
  const [titelIt, setTitelIt] = useState("");
  const [inhaltIt, setInhaltIt] = useState("");
  const [titelEn, setTitelEn] = useState("");
  const [inhaltEn, setInhaltEn] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [meldung, setMeldung] = useState<{ text: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState<Id<"newsEntwuerfe"> | null>(null);
  const [activeDraftFotoId, setActiveDraftFotoId] = useState<Id<"_storage"> | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [lastDraftSavedAt, setLastDraftSavedAt] = useState<number | null>(null);
  const creatingDraftRef = useRef(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [draftTab, setDraftTab] = useState("news");
  const [formLang, setFormLang] = useState<Lang>("de");

  /* ── delete state ── */
  const [deletingId, setDeletingId] = useState<Id<"news"> | null>(null);
  const [deleting, setDeleting] = useState(false);

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
        translatedTitelIt,
        translatedTitelEn,
        translatedInhaltIt,
        translatedInhaltEn,
      ] = await Promise.all([
        titel.trim() ? translate(titel, "it") : Promise.resolve(titelIt),
        titel.trim() ? translate(titel, "en") : Promise.resolve(titelEn),
        inhalt.trim() ? translate(inhalt, "it") : Promise.resolve(inhaltIt),
        inhalt.trim() ? translate(inhalt, "en") : Promise.resolve(inhaltEn),
      ]);
      if (titel.trim()) {
        setTitelIt(translatedTitelIt);
        setTitelEn(translatedTitelEn);
      }
      if (inhalt.trim()) {
        setInhaltIt(translatedInhaltIt);
        setInhaltEn(translatedInhaltEn);
      }
      setMeldung({ text: "Alle Felder wurden auf IT und EN übersetzt.", ok: true });
    } catch {
      setMeldung({ text: "Übersetzung fehlgeschlagen. Bitte versuche es erneut.", ok: false });
    } finally {
      setTranslatingAll(false);
    }
  };

  const isEditing = editingId !== null;

  const ensureActiveDraftId = useCallback(async (): Promise<Id<"newsEntwuerfe"> | null> => {
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
      titel.trim() ||
      inhalt.trim() ||
      titelIt.trim() ||
      inhaltIt.trim() ||
      titelEn.trim() ||
      inhaltEn.trim()
    );
    if (!hasContent) return;
    void ensureActiveDraftId();
  }, [isEditing, activeDraftId, titel, inhalt, titelIt, inhaltIt, titelEn, inhaltEn, ensureActiveDraftId]);

  useEffect(() => {
    if (!activeDraftId || isEditing) return;
    const timer = setTimeout(async () => {
      const isEmpty =
        titel.trim() === "" &&
        inhalt.trim() === "" &&
        titelIt.trim() === "" &&
        inhaltIt.trim() === "" &&
        titelEn.trim() === "" &&
        inhaltEn.trim() === "" &&
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
            titel,
            inhalt,
            titelIt,
            inhaltIt,
            titelEn,
            inhaltEn,
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
  }, [activeDraftId, titel, inhalt, titelIt, inhaltIt, titelEn, inhaltEn, activeDraftFotoId, isEditing, saveDraft, deleteDraft]);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setTitel("");
    setInhalt("");
    setTitelIt("");
    setInhaltIt("");
    setTitelEn("");
    setInhaltEn("");
    setSelectedImage(null);
    const fi = document.getElementById("news-foto-upload") as HTMLInputElement | null;
    if (fi) fi.value = "";
  }, []);

  const handleCreateDraft = async () => {
    try {
      const id = await createDraft({});
      setActiveDraftId(id);
      setEditingId(null);
      setTitel("");
      setInhalt("");
      setTitelIt("");
      setInhaltIt("");
      setTitelEn("");
      setInhaltEn("");
      setSelectedImage(null);
      setActiveDraftFotoId(null);
      setMeldung({ text: "Neuer Entwurf erstellt.", ok: true });
    } catch {
      setMeldung({ text: "Entwurf konnte nicht erstellt werden.", ok: false });
    }
  };

  const handleLoadDraft = (draft: NewsDraftRow) => {
    setEditingId(null);
    setActiveDraftId(draft._id);
    setTitel(draft.titel);
    setInhalt(draft.inhalt);
    setTitelIt(draft.titelIt);
    setInhaltIt(draft.inhaltIt);
    setTitelEn(draft.titelEn ?? draft.titel);
    setInhaltEn(draft.inhaltEn ?? draft.inhalt);
    setActiveDraftFotoId(draft.foto ?? null);
    setSelectedImage(null);
    // keep bottom tab state as-is (Entwürfe stays open)
  };

  const handleDeleteDraft = async (id: Id<"newsEntwuerfe">) => {
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

  const startEdit = useCallback((n: NewsRow) => {
    setEditingId(n._id);
    setTitel(n.titel);
    setInhalt(n.inhalt);
    setTitelIt(n.titelIt);
    setInhaltIt(n.inhaltIt);
    setTitelEn(n.titelEn ?? n.titel);
    setInhaltEn(n.inhaltEn ?? n.inhalt);
    setSelectedImage(null);
    setMeldung(null);
    const fi = document.getElementById("news-foto-upload") as HTMLInputElement | null;
    if (fi) fi.value = "";
    setTimeout(() => document.getElementById("news-form")?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  const handleDelete = async (id: Id<"news">) => {
    setDeleting(true);
    try {
      await removeNews({ id });
      setMeldung({ text: "News-Beitrag erfolgreich gelöscht.", ok: true });
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
    if (!titel.trim() || !titelIt.trim() || !titelEn.trim()) {
      setMeldung({ text: "Bitte Titel in Deutsch, Italienisch und Englisch eingeben.", ok: false }); return;
    }
    if (!inhalt.trim() || !inhaltIt.trim() || !inhaltEn.trim()) {
      setMeldung({ text: "Bitte Inhalt in Deutsch, Italienisch und Englisch eingeben.", ok: false }); return;
    }
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

      if (isEditing) {
        await updateNews({
          id: editingId,
          titel,
          inhalt,
          titelIt,
          inhaltIt,
          titelEn,
          inhaltEn,
          ...(storageId ? { foto: storageId } : {}),
        });
        setMeldung({ text: "News-Beitrag erfolgreich aktualisiert.", ok: true });
        resetForm();
      } else {
        if (!storageId) throw new Error("Kein Bild ausgewählt");
        await createNews({ titel, inhalt, foto: storageId, titelIt, inhaltIt, titelEn, inhaltEn });
        setMeldung({ text: "News-Beitrag erfolgreich gespeichert.", ok: true });
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
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredNewsItems = newsItems?.filter((n) => {
    if (!normalizedQuery) return true;
    return (
      n.titel.toLowerCase().includes(normalizedQuery) ||
      n.titelIt.toLowerCase().includes(normalizedQuery) ||
      n.inhalt.toLowerCase().includes(normalizedQuery) ||
      n.inhaltIt.toLowerCase().includes(normalizedQuery)
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
        titel,
        inhalt,
        titelIt,
        inhaltIt,
        titelEn,
        inhaltEn,
        foto: storageId,
      });
      setActiveDraftFotoId(storageId);
      setLastDraftSavedAt(Date.now());
    } catch {
      setMeldung({ text: "Entwurfsbild konnte nicht gespeichert werden.", ok: false });
    }
  };

  const missingFields = [];
  if (!titel.trim() || !titelIt.trim() || !titelEn.trim()) missingFields.push("Titel (alle Sprachen)");
  if (!inhalt.trim() || !inhaltIt.trim() || !inhaltEn.trim()) missingFields.push("Inhalt (alle Sprachen)");
  if (!isEditing && !selectedImage && !activeDraftFotoId) missingFields.push("Beitragsbild");

  const deIncomplete = !titel.trim() || !inhalt.trim() || (!isEditing && !selectedImage && !activeDraftFotoId);
  const itIncomplete = !titelIt.trim() || !inhaltIt.trim() || (!isEditing && !selectedImage && !activeDraftFotoId);
  const enIncomplete = !titelEn.trim() || !inhaltEn.trim() || (!isEditing && !selectedImage && !activeDraftFotoId);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader title="News" backHref="/admin" backLabel="Dashboard" />

      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">

        {meldung && <Alert text={meldung.text} ok={meldung.ok} />}

        {/* ────────── Create / Edit form ────────── */}
        <section id="news-form" className="mb-15">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {isEditing ? "Beitrag bearbeiten" : "Neuen News-Beitrag anlegen"}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {isEditing
                  ? "Ändere die Daten und speichere."
                  : "Füge einen neuen Beitrag in Deutsch und Italienisch hinzu."}
              </p>
            </div>
            {(titel.trim() || inhalt.trim()) && (
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
                  label="Titel"
                  valueDe={titel} valueIt={titelIt} valueEn={titelEn}
                  onChangeDe={setTitel} onChangeIt={setTitelIt} onChangeEn={setTitelEn}
                  required
                  onTranslate={() => handleTranslateField("titel", titel, setTitelIt, setTitelEn)}
                  translating={translatingField === "titel"}
                  lang={formLang} onLangChange={setFormLang}
                  isDotVisibleDe={deIncomplete}
                  isDotVisibleIt={itIncomplete}
                  isDotVisibleEn={enIncomplete}
                />

                <LangTabInput
                  label="Inhalt"
                  valueDe={inhalt} valueIt={inhaltIt} valueEn={inhaltEn}
                  onChangeDe={setInhalt} onChangeIt={setInhaltIt} onChangeEn={setInhaltEn}
                  multiline required maxLength={1000}
                  onTranslate={() => handleTranslateField("inhalt", inhalt, setInhaltIt, setInhaltEn)}
                  translating={translatingField === "inhalt"}
                  lang={formLang} onLangChange={setFormLang}
                  showLangSwitcher={false}
                />

                <Field label={isEditing ? "Neues Beitragsbild (optional)" : "Beitragsbild"}>
                  <input id="news-foto-upload" type="file" accept="image/*"
                    onChange={(e) => void handleDraftImageChange(e.target.files?.[0] || null)}
                    required={!isEditing}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-foreground file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 transition cursor-pointer" />
                  <p className="text-xs text-slate-400 mt-1">
                    {isEditing ? "Nur wählen wenn du das Bild ändern möchtest." : "Querformat empfohlen, max. 2 MB"}
                  </p>
                </Field>
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
                        window.open(`/admin/news/vorschau?${query}`, "_blank");
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
                        : "Beitrag speichern"}
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

        {/* ────────── News list ────────── */}
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Alle News-Beiträge</h1>
              <p className="mt-0.5 text-sm text-slate-500">
                {newsItems
                  ? `${filteredNewsItems?.length ?? 0} von ${newsItems.length} Beiträge`
                  : "Laden…"}
              </p>
            </div>
            <Link href="/admin/news/papierkorb"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Papierkorb
            </Link>
          </div>
          <Tabs value={draftTab} onValueChange={setDraftTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="news">Alle News</TabsTrigger>
              <TabsTrigger value="drafts">Entwürfe</TabsTrigger>
            </TabsList>

            <TabsContent value="news">
              <div className="relative mb-5 max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="News durchsuchen..."
                  className="h-11 rounded-full border-border/60 bg-white pl-10"
                />
              </div>

              {!newsItems ? (
                <div className="flex items-center justify-center py-16 text-slate-400 text-sm gap-2">
                  <Spinner /> Laden…
                </div>
              ) : filteredNewsItems?.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
                  Keine passenden News-Beiträge gefunden.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNewsItems?.map((n) => (
                    <div key={n._id}
                      className={`flex items-center gap-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-primary/20 ${editingId === n._id ? "ring-2 ring-primary/20" : ""}`}>
                      {/* Thumbnail */}
                      {n.imageUrl ? (
                        <Image src={n.imageUrl} alt={n.titel} width={80} height={56}
                          className="h-14 w-20 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="flex h-14 w-20 items-center justify-center rounded-xl bg-slate-100 text-slate-300 shrink-0">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg>
                        </div>
                      )}
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{n.titel}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[400px]">{n.inhalt}</p>
                        <p className="mt-1 text-[11px] text-slate-300">
                          {new Date(n.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
                        </p>
                      </div>
                      {/* Actions */}
                      <div className="shrink-0">
                        {deletingId === n._id ? (
                          <div className="inline-flex items-center gap-2">
                            <span className="text-xs text-red-600 font-semibold">Löschen?</span>
                            <button type="button" disabled={deleting}
                              onClick={() => handleDelete(n._id)}
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
                            <button type="button" onClick={() => startEdit(n)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-primary/30 hover:text-primary">
                              Bearbeiten
                            </button>
                            <button type="button" onClick={() => setDeletingId(n._id)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600">
                              Löschen
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
                        <p className="truncate font-semibold">{draft.titel.trim() || `Entwurf ${index + 1}`}</p>
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
