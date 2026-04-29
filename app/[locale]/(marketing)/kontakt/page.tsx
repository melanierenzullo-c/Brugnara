"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type FormState = "idle" | "sending" | "success" | "error";

export default function KontaktPage() {
  const t = useTranslations("Contact");
  const [form, setForm] = useState({ name: "", email: "", telefon: "", betreff: "", nachricht: "" });
  const [state, setState] = useState<FormState>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("sending");
    await new Promise((r) => setTimeout(r, 1200));
    setState("success");
    setForm({ name: "", email: "", telefon: "", betreff: "", nachricht: "" });
  };

  return (
    <div className="bg-white py-16">
      {/* ═══ Header ═══ */}
      <section className="relative overflow-hidden bg-[#F6F7FB] pt-32 pb-20">
        
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
         
          <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* ═══ Content ═══ */}
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">

          {/* Kontaktinfos */}
          <div className="space-y-8">
            <div className="rounded-[2rem] bg-white border border-border/50 p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
              <h2 className="text-xl font-black text-foreground mb-8">{t("infoTitle")}</h2>
              <address className="not-italic space-y-6 text-[15px]">
                <div className="flex gap-4 items-start">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{t("addressLabel")}</p>
                    <p className="text-muted-foreground">{t("addressStreet")}<br />{t("addressCity")}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{t("phoneLabel")}</p>
                    <a href="tel:+390473232755" className="text-primary hover:underline">0473 232755</a>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{t("emailLabel")}</p>
                    <a href="mailto:info@brugnara.bz.it" className="text-primary hover:underline">info@brugnara.bz.it</a>
                  </div>
                </div>
              </address>
            </div>

            <div className="rounded-[2rem] bg-white border border-border/50 p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
              <h2 className="text-xl font-black text-foreground mb-6">{t("hoursTitle")}</h2>
              <div className="space-y-3 text-[15px]">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">{t("monFri")}</span>
                  <span className="text-muted-foreground">{t("morningHours")} · {t("afternoonHours")}</span>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-3">
                  <span className="font-semibold text-foreground">{t("sat")}</span>
                  <span className="text-muted-foreground">{t("morningHours")}</span>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-3">
                  <span className="font-semibold text-foreground">{t("sun")}</span>
                  <span className="text-rose-500 font-bold text-[13px] uppercase tracking-wider">{t("closed")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formular */}
          <div className="rounded-[2rem] bg-white border border-border/50 p-8 sm:p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
            <h2 className="text-xl font-black text-foreground mb-8">{t("formTitle")}</h2>

            {state === "success" ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-foreground">{t("successTitle")}</h3>
                <p className="text-muted-foreground max-w-xs">
                  {t("successMessage")}
                </p>
                <button
                  onClick={() => setState("idle")}
                  className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
                >
                  {t("newMessage")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-sm font-semibold text-foreground">
                      {t("nameLabel")} <span className="text-primary">{t("required")}</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder={t("namePlaceholder")}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-telefon" className="text-sm font-semibold text-foreground">
                      {t("phoneLabel")}
                    </label>
                    <input
                      id="contact-telefon"
                      name="telefon"
                      type="tel"
                      value={form.telefon}
                      onChange={handleChange}
                      placeholder={t("phonePlaceholder")}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-sm font-semibold text-foreground">
                    {t("emailLabel")} <span className="text-primary">{t("required")}</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder={t("emailPlaceholder")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-betreff" className="text-sm font-semibold text-foreground">
                    {t("subjectLabel")} <span className="text-primary">{t("required")}</span>
                  </label>
                  <input
                    id="contact-betreff"
                    name="betreff"
                    type="text"
                    value={form.betreff}
                    onChange={handleChange}
                    required
                    placeholder={t("subjectPlaceholder")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-nachricht" className="text-sm font-semibold text-foreground">
                    {t("messageLabel")} <span className="text-primary">{t("required")}</span>
                  </label>
                  <textarea
                    id="contact-nachricht"
                    name="nachricht"
                    value={form.nachricht}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder={t("messagePlaceholder")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition resize-none"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {t("privacyConsent")}{" "}
                  <Link href="/datenschutz" className="text-primary hover:underline">{t("privacyLink")}</Link>{" "}
                  {t("privacyConsentEnd")}
                </p>

                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state === "sending" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      {t("sending")}
                    </span>
                  ) : (
                    t("submitButton")
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Google Maps ═══ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-8 text-center text-sm font-bold uppercase tracking-[0.25em] text-primary/70">
            {t("mapTitle")}
          </h2>
          <div className="overflow-hidden rounded-[2rem] border border-border/50 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
            <iframe
              title="M. Brugnara GmbH – Meran"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2735.5!2d11.1598!3d46.6713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47829d3c7c3b9b1b%3A0x0!2sRomstra%C3%9Fe+31%2FA%2C+39012+Meran%2C+BZ!5e0!3m2!1sde!2sit!4v1"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
