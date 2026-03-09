"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslations } from "next-intl";

export function OpeningHoursForm() {
  const [tag, setTag] = useState("Mo-Fr");
  const [von1, setVon1] = useState("");
  const [bis1, setBis1] = useState("");
  const [von2, setVon2] = useState("");
  const [bis2, setBis2] = useState("");
  const [geschlossen, setGeschlossen] = useState(false);
  const [meldung, setMeldung] = useState("");
  const t = useTranslations("OpeningHoursForm");

  const updateHours = useMutation(api.oeffnungszeiten.update);

  const handleGeschlossenChange = (checked: boolean) => {
    setGeschlossen(checked);
    if (checked) {
      setVon1("");
      setBis1("");
      setVon2("");
      setBis2("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMeldung("");

    if (!geschlossen) {
      if (!von1 && !bis1 && !von2 && !bis2) {
        setMeldung(t("errorMissing"));
        return;
      }
      if ((von1 && !bis1) || (!von1 && bis1)) {
        setMeldung(t("errorMorning"));
        return;
      }
      if ((von2 && !bis2) || (!von2 && bis2)) {
        setMeldung(t("errorAfternoon"));
        return;
      }
      if ((von2 || bis2) && (!von1 || !bis1)) {
        setMeldung(t("errorAfternoonSequence"));
        return;
      }
    }

    await updateHours({
      tag,
      von1: von1 || undefined,
      bis1: bis1 || undefined,
      von2: von2 || undefined,
      bis2: bis2 || undefined,
      geschlossen,
    });

    setMeldung(t("successUpdate"));
  };

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="mt-5 flex w-full max-w-[600px] flex-col gap-4 rounded-lg bg-[#f8f8f8] p-5 shadow-md"
      >
        {meldung && (
          <p className="text-center font-bold">{meldung}</p>
        )}

        <label>{t("tagLabel")}</label>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          required
          className="w-full rounded p-2.5 text-[16px]"
        >
          <option value="Mo-Fr">{t("monToFri")}</option>
          <option value="Sa">{t("sat")}</option>
          <option value="So">{t("sun")}</option>
        </select>

        <label>{t("morningFrom")}</label>
        <input
          type="time"
          value={von1}
          onChange={(e) => setVon1(e.target.value)}
          disabled={geschlossen}
          className="w-full rounded p-2.5 text-[16px]"
        />

        <label>{t("morningTo")}</label>
        <input
          type="time"
          value={bis1}
          onChange={(e) => setBis1(e.target.value)}
          disabled={geschlossen}
          className="w-full rounded p-2.5 text-[16px]"
        />

        <label>{t("afternoonFrom")}</label>
        <input
          type="time"
          value={von2}
          onChange={(e) => setVon2(e.target.value)}
          disabled={geschlossen}
          className="w-full rounded p-2.5 text-[16px]"
        />

        <label>{t("afternoonTo")}</label>
        <input
          type="time"
          value={bis2}
          onChange={(e) => setBis2(e.target.value)}
          disabled={geschlossen}
          className="w-full rounded p-2.5 text-[16px]"
        />

        <div className="flex items-center gap-2.5">
          <label htmlFor="geschlossen">{t("closed")}</label>
          <input
            type="checkbox"
            id="geschlossen"
            checked={geschlossen}
            onChange={(e) => handleGeschlossenChange(e.target.checked)}
          />
        </div>

        <p className="text-center">
          {t("resetHint")}
        </p>

        <button
          type="submit"
          className="w-full cursor-pointer rounded bg-[#A5BDD8] p-2.5 text-[16px] transition-all hover:scale-105 hover:bg-[#B3D0EB]"
        >
          {t("save")}
        </button>
      </form>
    </div>
  );
}
