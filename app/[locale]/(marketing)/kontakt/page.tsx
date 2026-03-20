"use client";

import { useState } from "react";

type FormState = "idle" | "sending" | "success" | "error";

export default function KontaktPage() {
  const [form, setForm] = useState({ name: "", email: "", telefon: "", betreff: "", nachricht: "" });
  const [state, setState] = useState<FormState>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("sending");
    // Demo: simulate send delay
    await new Promise((r) => setTimeout(r, 1200));
    setState("success");
    setForm({ name: "", email: "", telefon: "", betreff: "", nachricht: "" });
  };

  return (
    <div className="min-h-screen bg-[#fafbff]">
      {/* ═══ Header ═══ */}
      <section className="relative overflow-hidden bg-background pt-32 pb-20">
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Kontakt</span>
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient">
            Schreiben Sie uns
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Haben Sie Fragen zu unseren Produkten oder Dienstleistungen? Wir freuen uns auf Ihre Nachricht.
          </p>
        </div>
      </section>

      {/* ═══ Content ═══ */}
      <div className="mx-auto max-w-5xl px-6 pb-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">

          {/* Kontaktinfos */}
          <div className="space-y-8">
            <div className="rounded-[2rem] bg-white border border-border/50 p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
              <h2 className="text-xl font-black text-foreground mb-8">Kontaktdaten</h2>
              <ul className="space-y-6 text-[15px]">
                <li className="flex gap-4 items-start">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Adresse</p>
                    <p className="text-muted-foreground">Romstraße 31/A<br />39012 Meran (BZ)</p>
                  </div>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Telefon</p>
                    <a href="tel:0473232755" className="text-primary hover:underline">0473 232755</a>
                  </div>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">E-Mail</p>
                    <a href="mailto:info@brugnara.bz.it" className="text-primary hover:underline">info@brugnara.bz.it</a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-[2rem] bg-white border border-border/50 p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
              <h2 className="text-xl font-black text-foreground mb-6">Öffnungszeiten</h2>
              <div className="space-y-3 text-[15px]">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Mo–Fr</span>
                  <span className="text-muted-foreground">08:00–12:00 · 14:30–18:30</span>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-3">
                  <span className="font-semibold text-foreground">Sa</span>
                  <span className="text-muted-foreground">08:00–12:00</span>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-3">
                  <span className="font-semibold text-foreground">So</span>
                  <span className="text-rose-500 font-bold text-[13px] uppercase tracking-wider">Geschlossen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formular */}
          <div className="rounded-[2rem] bg-white border border-border/50 p-8 sm:p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
            <h2 className="text-xl font-black text-foreground mb-8">Nachricht senden</h2>

            {state === "success" ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-foreground">Nachricht erhalten!</h3>
                <p className="text-muted-foreground max-w-xs">
                  Vielen Dank für Ihre Anfrage. Wir melden uns so schnell wie möglich bei Ihnen.
                </p>
                <button
                  onClick={() => setState("idle")}
                  className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
                >
                  Neue Nachricht
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-sm font-semibold text-foreground">
                      Name <span className="text-primary">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Max Mustermann"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="telefon" className="text-sm font-semibold text-foreground">
                      Telefon
                    </label>
                    <input
                      id="telefon"
                      name="telefon"
                      type="tel"
                      value={form.telefon}
                      onChange={handleChange}
                      placeholder="+39 0473 …"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-foreground">
                    E-Mail <span className="text-primary">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="ihre@email.com"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="betreff" className="text-sm font-semibold text-foreground">
                    Betreff <span className="text-primary">*</span>
                  </label>
                  <input
                    id="betreff"
                    name="betreff"
                    type="text"
                    value={form.betreff}
                    onChange={handleChange}
                    required
                    placeholder="Worum geht es?"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="nachricht" className="text-sm font-semibold text-foreground">
                    Nachricht <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="nachricht"
                    name="nachricht"
                    value={form.nachricht}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Ihre Nachricht an uns…"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition resize-none"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Mit dem Absenden stimmen Sie unserer{" "}
                  <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a> zu.
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
                      Wird gesendet…
                    </span>
                  ) : (
                    "Nachricht absenden"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
