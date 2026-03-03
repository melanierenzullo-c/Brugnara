"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function AdminNewsPage() {
  const t = useTranslations("Admin");
  const [name, setName] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [nameIt, setNameIt] = useState("");
  const [beschreibungIt, setBeschreibungIt] = useState("");
  const [foto, setFoto] = useState("");
  const [meldung, setMeldung] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMeldung("");

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
            <label>{t("newsTitel")}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded p-2.5 text-[16px]" />

            <label>{t("newsBeschreibung")}</label>
            <textarea value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} maxLength={500} required className="w-full rounded p-2.5 text-[16px]" />

            <label>{t("newsTitelIt")}</label>
            <input type="text" value={nameIt} onChange={(e) => setNameIt(e.target.value)} required className="w-full rounded p-2.5 text-[16px]" />

            <label>{t("newsBeschreibungIt")}</label>
            <textarea value={beschreibungIt} onChange={(e) => setBeschreibungIt(e.target.value)} maxLength={500} required className="w-full rounded p-2.5 text-[16px]" />

            <label>{t("fotDateiname")}</label>
            <input type="text" value={foto} onChange={(e) => setFoto(e.target.value)} required placeholder="z.B. news-foto.jpg" className="w-full rounded p-2.5 text-[16px]" />

            <button type="submit" className="w-full cursor-pointer rounded bg-[#A5BDD8] p-2.5 text-[16px] transition-all hover:scale-105 hover:bg-[#B3D0EB]">
              {t("newsSpeichern")}
            </button>
          </form>
        </div>
        <br /><br />
      </div>
    </div>
  );
}
