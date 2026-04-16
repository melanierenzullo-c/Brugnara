"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import Image from "next/image";
import Link from "next/link";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { AdminHeader } from "@/components/admin-header";

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

export default function ProduktePapierkorbPage() {
  const produkte = useQuery(api.produkte.listArchiviert);

  const restoreProdukt = useMutation(api.produkte.restore);
  const deleteProduktPermanent = useMutation(api.produkte.deletePermanent);

  const [meldung, setMeldung] = useState<{ text: string; ok: boolean } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<Id<"produkte"> | null>(null);
  const [busy, setBusy] = useState(false);

  const handleRestore = async (id: Id<"produkte">) => {
    setBusy(true);
    try {
      await restoreProdukt({ id });
      setMeldung({ text: "Produkt erfolgreich wiederhergestellt.", ok: true });
    } catch (error) {
      setMeldung({ text: error instanceof Error ? error.message : "Fehler beim Wiederherstellen", ok: false });
    } finally {
      setBusy(false);
    }
  };

  const handleDeletePermanent = async (id: Id<"produkte">) => {
    setBusy(true);
    try {
      await deleteProduktPermanent({ id });
      setMeldung({ text: "Produkt endgültig gelöscht.", ok: true });
    } catch (error) {
      setMeldung({ text: error instanceof Error ? error.message : "Fehler beim Löschen", ok: false });
    } finally {
      setBusy(false);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader title="Papierkorb – Produkte" backHref="/admin/produkte" backLabel="Produkte" />

      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">

        {meldung && <Alert text={meldung.text} ok={meldung.ok} />}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Papierkorb</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {produkte ? `${produkte.length} archivierte Produkte` : "Laden…"}
            </p>
          </div>
          <Link href="/admin/produkte"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50">
            ← Zurück zu Produkte
          </Link>
        </div>

        {/* Info Banner */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Archivierte Produkte sind auf der öffentlichen Website nicht mehr sichtbar. Du kannst sie wiederherstellen oder endgültig löschen.</span>
        </div>

        {!produkte ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm gap-2">
            <Spinner /> Laden…
          </div>
        ) : produkte.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center text-sm text-slate-400">
            <svg className="mx-auto mb-3 h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Der Papierkorb ist leer.
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
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">Archiviert am</th>
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {produkte.map((p) => (
                  <tr key={p._id} className="border-b border-slate-50 transition hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      {p.imageUrl ? (
                        <Image src={p.imageUrl} alt={p.name} width={44} height={44}
                          className="h-11 w-11 rounded-lg object-cover opacity-60" />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-500">{p.name}</p>
                      <p className="mt-0.5 text-xs text-slate-400 truncate max-w-[220px]">{p.beschreibung}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-500">{p.nameIt}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">{p.kategorieName}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-400">
                      {p.archiviertAm
                        ? new Date(p.archiviertAm).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
                        : "–"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {confirmDeleteId === p._id ? (
                        <div className="inline-flex items-center gap-2">
                          <span className="text-xs text-red-600 font-semibold">Endgültig löschen?</span>
                          <button type="button" disabled={busy}
                            onClick={() => handleDeletePermanent(p._id)}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50">
                            {busy ? <Spinner /> : "Ja"}
                          </button>
                          <button type="button" onClick={() => setConfirmDeleteId(null)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                            Nein
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5">
                          <button type="button" disabled={busy}
                            onClick={() => handleRestore(p._id)}
                            className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-100 disabled:opacity-50">
                            Wiederherstellen
                          </button>
                          <button type="button" onClick={() => setConfirmDeleteId(p._id)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600">
                            Endgültig löschen
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
      </div>
    </div>
  );
}
