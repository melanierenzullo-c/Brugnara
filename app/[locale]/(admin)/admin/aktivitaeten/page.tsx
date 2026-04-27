"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AdminHeader } from "@/components/admin-header";

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  const m = Math.floor(d / 30);
  if (min < 1) return "Gerade eben";
  if (min < 60) return `vor ${min} Minute${min === 1 ? "" : "n"}`;
  if (h < 24) return `vor ${h} Stunde${h === 1 ? "" : "n"}`;
  if (d < 30) return `vor ${d} Tag${d === 1 ? "" : "en"}`;
  return `vor ${m} Monat${m === 1 ? "" : "en"}`;
}

function formatAction(aktion: string, entity: string, entityName: string): string {
  if (aktion === "Mitarbeiter deaktiviert") {
    return `Mitarbeiter ${entityName} wurde deaktiviert`;
  }
  if (aktion === "Mitarbeiter aktiviert") {
    return `Mitarbeiter ${entityName} wurde aktiviert`;
  }
  if (aktion === "Einladung erstellt") {
    return `Einladung für ${entityName} wurde versendet`;
  }
  if (aktion === "Rolle geändert") {
    return `Rolle von ${entityName} wurde geändert`;
  }
  if (aktion === "Produkt erstellt") {
    return `Produkt ${entityName} wurde erstellt`;
  }
  if (aktion === "Produkt bearbeitet") {
    return `Produkt ${entityName} wurde bearbeitet`;
  }
  if (aktion === "Produkt in Papierkorb verschoben") {
    return `Produkt ${entityName} wurde in den Papierkorb verschoben`;
  }
  if (aktion === "Produkt wiederhergestellt") {
    return `Produkt ${entityName} wurde wiederhergestellt`;
  }
  if (aktion === "Produkt endgültig gelöscht") {
    return `Produkt ${entityName} wurde endgültig gelöscht`;
  }
  if (aktion === "News erstellt") {
    return `News ${entityName} wurde erstellt`;
  }
  if (aktion === "News bearbeitet") {
    return `News ${entityName} wurde bearbeitet`;
  }
  if (aktion === "News in Papierkorb verschoben") {
    return `News ${entityName} wurde in den Papierkorb verschoben`;
  }
  if (aktion === "News wiederhergestellt") {
    return `News ${entityName} wurde wiederhergestellt`;
  }
  if (aktion === "News endgültig gelöscht") {
    return `News ${entityName} wurde endgültig gelöscht`;
  }
  // Fallback für andere Aktionen
  return `${entity} ${entityName} ${aktion.toLowerCase()}`;
}

const ENTITY_CONFIG: Record<string, { badge: string; bg: string }> = {
  Produkt: { badge: "bg-blue-50 text-blue-800", bg: "bg-blue-50" },
  News: { badge: "bg-emerald-50 text-emerald-800", bg: "bg-emerald-50" },
  Mitarbeiter: { badge: "bg-violet-50 text-violet-800", bg: "bg-violet-50" },
  Einladung: { badge: "bg-amber-50 text-amber-800", bg: "bg-amber-50" },
};

const DEFAULT_CONFIG = { badge: "bg-slate-100 text-slate-600", bg: "bg-slate-50" };

export default function AdminAktivitaetenPage() {
  const eintraege = useQuery(api.aktivitaeten.listAktivitaeten);
  const [filterUserId, setFilterUserId] = useState<string>("all");
  const [filterEntity, setFilterEntity] = useState<string>("all");

  const users = eintraege
    ? [
        ...new Map(
          eintraege.map((e) => [
            e.userId,
            { id: e.userId, email: e.userEmail, name: e.userName },
          ])
        ).values(),
      ]
    : [];

  const entities = eintraege
    ? [...new Set(eintraege.map((e) => e.entity))].sort()
    : [];

  const filtered =
    eintraege?.filter((e) => {
      const matchUser = filterUserId === "all" || e.userId === filterUserId;
      const matchEntity = filterEntity === "all" || e.entity === filterEntity;
      return matchUser && matchEntity;
    }) ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader
        title="Aktivitätsprotokoll"
        backHref="/admin"
        backLabel="Dashboard"
      />

      <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Aktivitätsprotokoll
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Alle Änderungen der Mitarbeiter im Überblick.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {entities.length > 1 && (
              <select
                value={filterEntity}
                onChange={(e) => setFilterEntity(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition"
              >
                <option value="all">Alle Aktivitäten</option>
                {entities.map((ent) => (
                  <option key={ent} value={ent}>
                    {ent}
                  </option>
                ))}
              </select>
            )}

            {users.length > 1 && (
              <select
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition"
              >
                <option value="all">Alle Mitarbeiter</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name ?? u.email}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Loading */}
        {!eintraege && (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-400">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Lädt…
          </div>
        )}

        {/* Empty state */}
        {eintraege && filtered.length === 0 && (
          <div className="py-24 text-center text-sm text-slate-400">
            Noch keine Aktivitäten vorhanden.
          </div>
        )}

        {/* List */}
        {eintraege && filtered.length > 0 && (
          <ul className="space-y-3">
            {filtered.map((e) => {
              const config = ENTITY_CONFIG[e.entity] ?? DEFAULT_CONFIG;
              const initials = (e.userName ?? e.userEmail).charAt(0).toUpperCase();
              const detailParts = e.details?.split(" · ") ?? [];

              return (
                <li key={e._id}>
                  <div className={`rounded-xl border border-slate-200 ${config.bg} px-5 py-4 shadow-sm transition hover:shadow-md relative`}>
                    
                    {/* Badge rechts oben */}
                    <span className={`absolute top-2 right-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${config.badge}`}>
                      {e.entity}
                    </span>
                    
                    {/* Main action sentence: "Mitarbeiter Test wurde deaktiviert" */}
                    <p className="text-[15px] font-semibold text-foreground leading-snug">
                      {formatAction(e.aktion, e.entity, e.entityName)}
                    </p>

                    {/* Details */}
                    {detailParts.length > 0 && (
                      <p className="mt-2 text-[12px] text-slate-400 border-t border-slate-100 pt-2">
                        {detailParts.join(" · ")}
                      </p>
                    )}

                    {/* Footer: avatar + name + relative time */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {initials}
                      </div>
                      <span className="text-xs text-slate-500">
                        {e.userName ?? e.userEmail}
                      </span>
                      <span className="ml-auto text-xs text-slate-400">
                        {timeAgo(e.timestamp)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}