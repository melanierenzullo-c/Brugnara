"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { AdminHeader } from "@/components/admin-header";

type UserRow = {
  _id: Id<"users">;
  email: string;
  name: string | null;
  role: "admin" | "employee";
  disabled: boolean;
};

export default function AdminMitarbeiterPage() {
  const t = useTranslations("Admin");
  const currentUser = useQuery(api.users.me);
  const users = useQuery(api.users.listUsers);
  const createInvite = useMutation(api.users.createEmployeeInvite);
  const setUserDisabled = useMutation(api.users.setUserDisabled);
  const setUserRole = useMutation(api.users.setUserRole);

  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const origin = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }, []);

  const onCreateInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setInviteLink(null);
    const email = inviteEmail.trim();
    if (!email) { setErrorMessage(t("inviteEmailRequired")); return; }
    setIsInviting(true);
    try {
      const result = await createInvite({ email });
      setInviteLink(`${origin}/accept-invite?token=${encodeURIComponent(result.token)}`);
      setInviteEmail("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unbekannter Fehler");
    } finally {
      setIsInviting(false);
    }
  };

  const onCopyInvite = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onToggleDisabled = async (userId: Id<"users">, disabled: boolean) => {
    setErrorMessage(null);
    try {
      await setUserDisabled({ userId, disabled });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unbekannter Fehler");
    }
  };

  const onToggleRole = async (userId: Id<"users">, currentRole: "admin" | "employee") => {
    setErrorMessage(null);
    const newRole = currentRole === "admin" ? "employee" : "admin";
    try {
      await setUserRole({ userId, role: newRole });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unbekannter Fehler");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbff]">
      <AdminHeader title={t("mitarbeiterVerwalten")} backHref="/admin" backLabel="Dashboard" />

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Team</span>
          </div>
          <h1 className="text-2xl font-black text-foreground">{t("mitarbeiterVerwalten")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Mitarbeiter einladen, Rollen vergeben und Zugänge verwalten.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">

          {/* Invite Card */}
          <div className="rounded-[2rem] bg-white border border-border/50 p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] h-fit space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">Einladen</span>
              <h2 className="mt-2 text-lg font-black text-foreground">Neuer Mitarbeiter</h2>
              <p className="mt-1 text-sm text-muted-foreground">Link ist 7 Tage gültig und einmalig verwendbar.</p>
            </div>

            <form onSubmit={onCreateInvite} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{t("inviteEmail")}</label>
                <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} type="email"
                  placeholder="name@firma.tld"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition" />
              </div>
              <button type="submit" disabled={isInviting}
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed">
                {isInviting ? "Erstelle…" : t("inviteErstellen")}
              </button>
            </form>

            {inviteLink && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">{t("inviteLink")}</p>
                <p className="break-all text-xs text-foreground/70 leading-relaxed">{inviteLink}</p>
                <button type="button" onClick={onCopyInvite}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary/90">
                  {copied ? (
                    <><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Kopiert!</>
                  ) : (
                    <><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>{t("kopieren")}</>
                  )}
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMessage}</div>
            )}
          </div>

          {/* Users List */}
          <div className="rounded-[2rem] bg-white border border-border/50 p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">Übersicht</span>
                <h2 className="mt-1 text-lg font-black text-foreground">Aktive Benutzer</h2>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {(users as UserRow[] | undefined)?.length ?? 0}
              </span>
            </div>

            {!users ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                Laden…
              </div>
            ) : (users as UserRow[]).length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">Keine Benutzer gefunden.</p>
            ) : (
              <div className="space-y-3">
                {(users as UserRow[]).map((u) => (
                  <div key={u._id} className="flex items-center justify-between rounded-2xl border border-border/50 bg-[#fafbff] px-5 py-4 transition hover:border-primary/20">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary shrink-0">
                        {(u.name ?? u.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{u.name ?? u.email}</p>
                        {u.name && <p className="text-xs text-muted-foreground">{u.email}</p>}
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            {u.role === "admin" ? "Administrator" : "Mitarbeiter"}
                          </span>
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${u.disabled ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                            {u.disabled ? t("statusDeaktiviert") : t("statusAktiv")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Role toggle – hidden for own row */}
                      {currentUser && currentUser._id !== u._id && (
                        <button type="button" onClick={() => onToggleRole(u._id, u.role)}
                          className="rounded-xl border border-border/60 bg-white px-3 py-2 text-xs font-bold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                          title={u.role === "admin" ? "Zu Mitarbeiter ändern" : "Zu Administrator ändern"}
                        >
                          {u.role === "admin" ? "→ Mitarbeiter" : "→ Admin"}
                        </button>
                      )}
                      {/* Disable / Enable toggle */}
                      {u.disabled ? (
                        <button type="button" onClick={() => onToggleDisabled(u._id, false)}
                          className="rounded-xl border border-border bg-white px-4 py-2 text-xs font-bold text-foreground transition hover:border-primary/30 hover:text-primary">
                          {t("aktivieren")}
                        </button>
                      ) : (
                        <button type="button" onClick={() => onToggleDisabled(u._id, true)}
                          className="rounded-xl border border-border/60 bg-white px-4 py-2 text-xs font-bold text-muted-foreground transition hover:border-red-200 hover:text-red-600">
                          {t("deaktivieren")}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
