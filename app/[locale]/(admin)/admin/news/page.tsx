"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function AdminNewsPage() {
  const t = useTranslations("Admin");
  const [name, setName] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [nameIt, setNameIt] = useState("");
  const [beschreibungIt, setBeschreibungIt] = useState("");
  const [foto, setFoto] = useState("");
  const [meldung, setMeldung] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMeldung("");

    if (!foto) {
      setMeldung(t("bitteFoto"));
      return;
    }

    setMeldung(t("dbNichtVerbunden"));
  };

  return (
    <div className="bg-slate-950">
      <div className="mx-auto min-h-screen max-w-4xl px-4 py-6 lg:px-8 lg:py-10">
        <header className="mb-6">
          <h1 className="text-xl font-semibold text-sky-100">
            {t("news")}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Newsbeiträge für die Website vorbereiten (Datenbank‑Anbindung folgt).
          </p>
        </header>

        {meldung && (
          <p className="mb-4 rounded-md border border-sky-500/40 bg-sky-950/40 px-3 py-2 text-sm text-sky-100">
            {meldung}
          </p>
        )}

        <div className="space-y-4 rounded-xl border border-sky-900/60 bg-slate-900/70 p-5 text-sm text-slate-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-sky-100">
                  {t("newsTitel")}
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
                  {t("newsTitelIt")}
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
                  {t("newsBeschreibung")}
                </label>
                <textarea
                  value={beschreibung}
                  onChange={(e) => setBeschreibung(e.target.value)}
                  maxLength={500}
                  required
                  className="min-h-[120px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <p className="text-[10px] text-slate-500">
                  {beschreibung.length}/500
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-sky-100">
                  {t("newsBeschreibungIt")}
                </label>
                <textarea
                  value={beschreibungIt}
                  onChange={(e) => setBeschreibungIt(e.target.value)}
                  maxLength={500}
                  required
                  className="min-h-[120px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <p className="text-[10px] text-slate-500">
                  {beschreibungIt.length}/500
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-sky-100">
                {t("fotDateiname")}
              </label>
              <input
                type="text"
                value={foto}
                onChange={(e) => setFoto(e.target.value)}
                required
                placeholder="z.B. news-foto.jpg"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <p className="text-[10px] text-slate-500">
                Hier aktuell nur Referenz: Upload‑Flow folgt später.
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex min-w-[180px] items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-sky-400"
            >
              {t("newsSpeichern")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

