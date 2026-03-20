export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[#fafbff]">
      {/* ═══ Header ═══ */}
      <section className="relative overflow-hidden bg-background pt-32 pb-20">
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Rechtliches</span>
          </div>
          <h1 className="mb-6 text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient">
            Datenschutzerklärung
          </h1>
        </div>
      </section>

      {/* ═══ Content ═══ */}
      <div className="mx-auto max-w-4xl px-6 pb-32">
        <div className="rounded-[2.5rem] bg-white border border-border/50 p-8 sm:p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
          <h2 className="mb-10 flex items-center gap-3 text-2xl font-black text-foreground">
            <span className="p-2 rounded-xl bg-primary/10">🛡️</span>
            Datenschutzerklärung
          </h2>

          <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed">
            <p className="mb-8 font-medium">Gemäß EU-Verordnung 2016/679 – DSGVO</p>

            <div className="space-y-10">
              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">1. Verantwortlicher</h3>
                <p>M. Brugnara GmbH, Romstraße 31/A, Meran. E-Mail: <a href="mailto:info@brugnara.bz.it" className="text-primary hover:underline">info@brugnara.bz.it</a></p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">2. Art der Daten</h3>
                <p>Identifikationsdaten (Name, E-Mail, Telefon), Technische Daten (IP-Adresse, Cookies) und freiwillig übermittelte Daten über das Kontaktformular.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">3. Zweck</h3>
                <p>Beantwortung von Anfragen, Verbesserung der Website, Erfüllung gesetzlicher Pflichten.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">4. Speicherdauer</h3>
                <p>Daten werden nur so lange gespeichert, wie es für den Zweck erforderlich oder gesetzlich vorgeschrieben ist.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">5. Ihre Rechte</h3>
                <p>Gemäß DSGVO haben Sie folgende Rechte:</p>
                <ul className="mt-3 space-y-2 list-disc pl-6">
                  <li>Recht auf Auskunft über gespeicherte Daten</li>
                  <li>Recht auf Berichtigung unrichtiger Daten</li>
                  <li>Recht auf Löschung («Recht auf Vergessenwerden»)</li>
                  <li>Recht auf Einschränkung der Verarbeitung</li>
                  <li>Recht auf Widerspruch gegen die Verarbeitung</li>
                  <li>Recht auf Datenübertragbarkeit</li>
                </ul>
                <p className="mt-4">Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: <a href="mailto:info@brugnara.bz.it" className="text-primary hover:underline">info@brugnara.bz.it</a></p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">6. Cookies</h3>
                <p>Diese Website verwendet technische Cookies, die für den Betrieb der Website notwendig sind. Weitere Cookies werden nur nach Ihrer ausdrücklichen Einwilligung gesetzt.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">7. Weitergabe an Dritte</h3>
                <p>Ihre Daten werden nicht an Dritte weitergegeben, außer dies ist gesetzlich vorgeschrieben oder für die Erbringung unserer Dienstleistungen notwendig.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">8. Beschwerderecht</h3>
                <p>Sie haben das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde (Garante Privacy, <a href="https://www.garanteprivacy.it" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a>) zu beschweren.</p>
              </section>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 text-sm italic opacity-60">
            Letzte Aktualisierung: 10.10.2025
          </div>
        </div>
      </div>
    </div>
  );
}
