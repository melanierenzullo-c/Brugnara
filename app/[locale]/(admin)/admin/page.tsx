"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "convex/react";
import { Link } from "@/i18n/navigation";

import { api } from "@/convex/_generated/api";
import { AdminHeader } from "@/components/admin-header";

export default function AdminPage() {
  const t = useTranslations("Admin");
  const me = useQuery(api.users.me);
  const isAdmin = me?.role === "admin";

  const cards = [
    {
      href: "/admin/produkte" as const,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      label: t("produkte"),
      desc: "Neue Produkte anlegen und bestehende aktualisieren.",
      action: t("hinzufuegen"),
    },
    {
      href: "/admin/news" as const,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      label: t("news"),
      desc: "Neuigkeiten für die Website erstellen und verwalten.",
      action: t("hinzufuegen"),
    },
    ...(isAdmin ? [
    {
      href: "/admin/aktivitaeten" as const,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Aktivitätsprotokoll",
      desc: "Alle Aktionen der Mitarbeiter im Überblick.",
      action: "Anzeigen",
    },
    {
      href: "/admin/mitarbeiter" as const,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: t("mitarbeiter"),
      desc: "Mitarbeiter einladen, aktivieren und deaktivieren.",
      action: t("mitarbeiterVerwalten"),
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#fafbff]">
      <AdminHeader title="Dashboard" />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Admin</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {t("greeting")}
          </h1>
          {me && (
            <p className="mt-2 text-muted-foreground">
              Eingeloggt als <span className="font-semibold text-foreground">{me.email}</span>
              {" · "}
              <span>{me.role === "admin" ? "Administrator" : "Mitarbeiter"}</span>
            </p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {me === undefined && (
            <>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="rounded-[2rem] bg-white border border-border/50 p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] animate-pulse">
                  <div className="mb-6 h-14 w-14 rounded-2xl bg-slate-100" />
                  <div className="h-5 w-24 rounded-lg bg-slate-100 mb-3" />
                  <div className="h-3.5 w-full rounded bg-slate-100 mb-2" />
                  <div className="h-3.5 w-3/4 rounded bg-slate-100" />
                  <div className="mt-8 h-4 w-20 rounded bg-slate-100" />
                </div>
              ))}
            </>
          )}
          {me !== undefined && cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white border border-border/50 p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] no-underline"
            >
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[2rem] bg-gradient-to-r from-primary/40 via-primary to-primary/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  {card.icon}
                </div>
                <h2 className="text-xl font-black text-foreground">{card.label}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] text-primary">
                {card.action}
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
