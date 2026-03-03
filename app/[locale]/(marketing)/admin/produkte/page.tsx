"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const STATIC_KATEGORIEN = [
  { id: "1", name: "Eisenwaren" },
  { id: "2", name: "Haushaltsartikel" },
  { id: "3", name: "Werkzeug" },
  { id: "4", name: "Elektrogeräte" },
  { id: "5", name: "Gartengeräte" },
  { id: "6", name: "Öfen & Herde" },
];

export default function AdminProduktePage() {
  const t = useTranslations("Admin");
  const [name, setName] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [nameIt, setNameIt] = useState("");
  const [beschreibungIt, setBeschreibungIt] = useState("");
  const [kategorieId, setKategorieId] = useState("");
  const [foto, setFoto] = useState("");
  const [meldung, setMeldung] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMeldung("");

    if (!kategorieId) {
      setMeldung(t("bitteKategorie"));
      return;
    }

    if (!foto) {
      setMeldung(t("bitteFoto"));
      return;
    }

    setMeldung(t("dbNichtVerbunden"));
  };

  return (
    <div className="bg-[#5A759E]">
      <div className="mx-auto min-h-screen px-5 py-5 lg:w-[80%]">
        <br />

        {meldung && (
          <p className="text-center font-bold text-white">{meldung}</p>
        )}

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="mt-5 flex w-full max-w-[600px] flex-col gap-4 rounded-lg bg-[#f8f8f8] p-5 shadow-md"
          >
            <label>{t("produktName")}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded p-2.5 text-[16px]" />

            <label>{t("produktBeschreibung")}</label>
            <textarea value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} maxLength={300} required className="w-full rounded p-2.5 text-[16px]" />

            <label>{t("produktNameIt")}</label>
            <input type="text" value={nameIt} onChange={(e) => setNameIt(e.target.value)} required className="w-full rounded p-2.5 text-[16px]" />

            <label>{t("produktBeschreibungIt")}</label>
            <textarea value={beschreibungIt} onChange={(e) => setBeschreibungIt(e.target.value)} maxLength={300} required className="w-full rounded p-2.5 text-[16px]" />

            <label>{t("kategorieWaehlen")}</label>
            <select value={kategorieId} onChange={(e) => setKategorieId(e.target.value)} required className="w-full rounded p-2.5 text-[16px]">
              <option value="">{t("bitteWaehlen")}</option>
              {STATIC_KATEGORIEN.map((kat) => (
                <option key={kat.id} value={kat.id}>{kat.name}</option>
              ))}
            </select>

            <label>{t("fotDateiname")}</label>
            <input type="text" value={foto} onChange={(e) => setFoto(e.target.value)} required placeholder="z.B. produkt.jpg" className="w-full rounded p-2.5 text-[16px]" />

            <button type="submit" className="w-full cursor-pointer rounded bg-[#A5BDD8] p-2.5 text-[16px] transition-all hover:scale-105 hover:bg-[#B3D0EB]">
              {t("produktSpeichern")}
            </button>
          </form>
        </div>
        <br /><br />
      </div>
    </div>
  );
}
