"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Link } from "@/i18n/navigation";

export default function AdminPage() {
  const t = useTranslations("Admin");
  const tNav = useTranslations("Navigation");
  const me = useQuery(api.users.me);

  const isAdmin = me?.role === "admin";

  return (
    <div className="bg-[#0f172a]">
      <div className="mx-auto min-h-screen max-w-6xl px-4 py-6 lg:px-8 lg:py-10">
        <header className="mb-8 flex items-center gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-300/80">
              Admin
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              {t("greeting")}
            </h1>
          </div>
          <Link
            href="/"
            className="ml-auto rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-400"
          >
            {tNav("backToHome")}
          </Link>
        </header>

        <main className="space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-medium text-sky-100/80">
              Inhalte verwalten
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/admin/produkte"
                className="group flex flex-col justify-between rounded-xl border border-sky-900/60 bg-slate-900/60 p-4 shadow-sm ring-sky-500/20 transition hover:-translate-y-0.5 hover:border-sky-500/70 hover:shadow-lg"
              >
                <div>
                  <h3 className="text-base font-semibold text-sky-100">
                    {t("produkte")}
                  </h3>
                  <p className="mt-1 text-xs text-slate-300/80">
                    Neue Produkte anlegen und bestehende aktualisieren.
                  </p>
                </div>
                <span className="mt-4 inline-flex w-fit items-center gap-1 text-xs font-medium text-sky-300 group-hover:text-sky-200">
                  {t("hinzufuegen")}
                  <span aria-hidden>↗</span>
                </span>
              </Link>

              <Link
                href="/admin/news"
                className="group flex flex-col justify-between rounded-xl border border-sky-900/60 bg-slate-900/60 p-4 shadow-sm ring-sky-500/20 transition hover:-translate-y-0.5 hover:border-sky-500/70 hover:shadow-lg"
              >
                <div>
                  <h3 className="text-base font-semibold text-sky-100">
                    {t("news")}
                  </h3>
                  <p className="mt-1 text-xs text-slate-300/80">
                    Neuigkeiten für die Website vorbereiten (noch ohne DB‑Bindung).
                  </p>
                </div>
                <span className="mt-4 inline-flex w-fit items-center gap-1 text-xs font-medium text-sky-300 group-hover:text-sky-200">
                  {t("hinzufuegen")}
                  <span aria-hidden>↗</span>
                </span>
              </Link>
            </div>
          </section>

          {isAdmin && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-sky-100/80">
                Einstellungen
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Link
                  href="/admin/mitarbeiter"
                  className="group flex flex-col justify-between rounded-xl border border-sky-900/60 bg-slate-900/60 p-4 shadow-sm ring-sky-500/20 transition hover:-translate-y-0.5 hover:border-sky-500/70 hover:shadow-lg"
                >
                  <div>
                    <h3 className="text-base font-semibold text-sky-100">
                      {t("mitarbeiter")}
                    </h3>
                    <p className="mt-1 text-xs text-slate-300/80">
                      Mitarbeiter einladen, aktivieren und deaktivieren.
                    </p>
                  </div>
                  <span className="mt-4 inline-flex w-fit items-center gap-1 text-xs font-medium text-sky-300 group-hover:text-sky-200">
                    {t("mitarbeiterVerwalten")}
                    <span aria-hidden>↗</span>
                  </span>
                </Link>

                <div className="flex flex-col justify-between rounded-xl border border-dashed border-sky-900/60 bg-slate-900/40 p-4 text-slate-300/80">
                  <div>
                    <h3 className="text-base font-semibold text-sky-100">
                      {t("oeffnungszeiten")}
                    </h3>
                    <p className="mt-1 text-xs">
                      {t("oeffnungszeitenHinweis")}
                    </p>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">
                    {t("dbPlaceholder")}
                  </p>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

