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
  if (min < 1) return "Gerade eben";
  if (min < 60) return `vor ${min} Min.`;
  if (h < 24) return `vor ${h} Std.`;
  if (d === 1) return "Gestern";
  return `vor ${d} Tagen`;
}

const ENTITY_COLORS: Record<string, string> = {
  Produkt: "bg-blue-100 text-blue-700",
  Mitarbeiter: "bg-violet-100 text-violet-700",
  Einladung: "bg-amber-100 text-amber-700",
};

export default function AdminAktivitaetenPage() {
  const eintraege = useQuery(api.aktivitaeten.listAktivitaeten);
  const [filterUserId, setFilterUserId] = useState<string>("all");

  const users = eintraege
    ? [...new Map(eintraege.map((e) => [e.userId, { id: e.userId, email: e.userEmail, name: e.userName }])).values()]
    : [];

  const filtered = eintraege?.filter((e) => filterUserId === "all" || e.userId === filterUserId) ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader title="Aktivitätsprotokoll" backHref="/admin" backLabel="Dashboard" />

      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-foreground">Aktivitätsprotokoll</h1>
            <p className="mt-1 text-sm text-slate-500">Alle Aktionen der Mitarbeiter im Überblick.</p>
          </div>

          {users.length > 1 && (
            <select
              value={filterUserId}
              onChange={(e) => setFilterUserId(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition"
            >
              <option value="all">Alle Mitarbeiter</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name ?? u.email}</option>
              ))}
            </select>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {!eintraege ? (
            <div className="flex items-center justify-center gap-2 py-20 text-sm text-slate-400">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Lädt…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-400">
              Noch keine Aktivitäten vorhanden.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((e) => {
                const initials = (e.userName ?? e.userEmail).charAt(0).toUpperCase();
                const colorClass = ENTITY_COLORS[e.entity] ?? "bg-slate-100 text-slate-600";
                return (
                  <li key={e._id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition">
                    {/* Avatar */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary mt-0.5">
                      {initials}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">
                          {e.userName ?? e.userEmail}
                        </span>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${colorClass}`}>
                          {e.entity}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-700">
                        <span className="font-semibold">{e.aktion}:</span>{" "}
                        {e.entityName}
                      </p>
                      {e.details && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {e.details.split(" · ").map((item) => {
                            const [key, ...rest] = item.split(": ");
                            const val = rest.join(": ");
                            return (
                              <span key={item} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                                <span className="font-semibold text-slate-600">{key}:</span>
                                {val}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <time className="shrink-0 text-xs text-slate-400 mt-1" title={new Date(e.timestamp).toLocaleString("de-DE")}>
                      {timeAgo(e.timestamp)}
                    </time>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
