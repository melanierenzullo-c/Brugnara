"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type UserRow = {
  _id: Id<"users">;
  email: string;
  name: string | null;
  role: "admin" | "employee";
  disabled: boolean;
};

export default function AdminMitarbeiterPage() {
  const t = useTranslations("Admin");

  const users = useQuery(api.users.listUsers);
  const createInvite = useMutation(api.users.createEmployeeInvite);
  const setUserDisabled = useMutation(api.users.setUserDisabled);

  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
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
    if (!email) {
      setErrorMessage(t("inviteEmailRequired"));
      return;
    }

    setIsInviting(true);
    try {
      const result = await createInvite({ email });
      setInviteLink(
        `${origin}/accept-invite?token=${encodeURIComponent(result.token)}`
      );
      setInviteEmail("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      setErrorMessage(message);
    } finally {
      setIsInviting(false);
    }
  };

  const onCopyInvite = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
  };

  const onToggleDisabled = async (userId: Id<"users">, disabled: boolean) => {
    setErrorMessage(null);
    try {
      await setUserDisabled({ userId, disabled });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      setErrorMessage(message);
    }
  };

  return (
    <div className="bg-slate-950">
      <div className="mx-auto min-h-screen max-w-6xl px-4 py-6 lg:px-8 lg:py-10">
        <header className="mb-6">
          <h1 className="text-xl font-semibold text-sky-100">
            {t("mitarbeiterVerwalten")}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Mitarbeiter einladen, Rollen vergeben und Zugänge verwalten.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
          <section className="space-y-4 rounded-xl border border-sky-900/60 bg-slate-900/70 p-5 text-sm text-slate-100">
            <form onSubmit={onCreateInvite} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-sky-100">
                  {t("inviteEmail")}
                </label>
                <input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  type="email"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="name@firma.tld"
                />
                <p className="text-[10px] text-slate-500">
                  Die Einladung ist 7 Tage gültig und kann nur einmal verwendet
                  werden.
                </p>
              </div>
              <button
                type="submit"
                disabled={isInviting}
                className="inline-flex min-w-[180px] items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isInviting ? "…" : t("inviteErstellen")}
              </button>
            </form>

            {inviteLink ? (
              <div className="mt-4 rounded-md border border-sky-900/60 bg-slate-950/60 p-3 text-xs text-slate-100">
                <div className="flex items-start gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-sky-300">
                      {t("inviteLink")}
                    </div>
                    <div className="mt-1 break-all text-[11px] text-slate-200">
                      {inviteLink}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onCopyInvite}
                    className="shrink-0 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-white"
                  >
                    {t("kopieren")}
                  </button>
                </div>
              </div>
            ) : null}

            {errorMessage ? (
              <p className="mt-3 rounded-md border border-red-500/50 bg-red-950/40 p-3 text-xs text-red-100">
                {errorMessage}
              </p>
            ) : null}
          </section>

          <section className="rounded-xl border border-sky-900/60 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-sky-100">
                Aktive Benutzer
              </h2>
              <span className="text-[11px] text-slate-400">
                {(users as UserRow[] | undefined)?.length ?? 0} Einträge
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs text-slate-100">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900">
                    <th className="py-2 pr-4 font-medium text-slate-300">
                      {t("inviteEmail")}
                    </th>
                    <th className="py-2 pr-4 font-medium text-slate-300">
                      {t("rolle")}
                    </th>
                    <th className="py-2 pr-4 font-medium text-slate-300">
                      Status
                    </th>
                    <th className="py-2 text-right font-medium text-slate-300">
                      Aktion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(users as UserRow[] | undefined)?.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-slate-800/60 last:border-b-0"
                    >
                      <td className="py-2 pr-4 align-top">
                        <div className="font-medium text-slate-50">
                          {u.email}
                        </div>
                        {u.name ? (
                          <div className="text-[11px] text-slate-400">
                            {u.name}
                          </div>
                        ) : null}
                      </td>
                      <td className="py-2 pr-4 align-top capitalize text-slate-200">
                        {u.role === "admin" ? "Admin" : "Mitarbeiter"}
                      </td>
                      <td className="py-2 pr-4 align-top">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            u.disabled
                              ? "bg-red-900/40 text-red-200"
                              : "bg-emerald-900/40 text-emerald-200"
                          }`}
                        >
                          {u.disabled
                            ? t("statusDeaktiviert")
                            : t("statusAktiv")}
                        </span>
                      </td>
                      <td className="py-2 text-right align-top">
                        {u.disabled ? (
                          <button
                            type="button"
                            onClick={() => onToggleDisabled(u._id, false)}
                            className="rounded-md bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-900 hover:bg-white"
                          >
                            {t("aktivieren")}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onToggleDisabled(u._id, true)}
                            className="rounded-md bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-50 hover:bg-slate-700"
                          >
                            {t("deaktivieren")}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}

                  {!users ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-6 text-center text-slate-400"
                      >
                        Laden…
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

