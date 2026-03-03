"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function OpeningHoursForm() {
  const [tag, setTag] = useState("Mo-Fr");
  const [von1, setVon1] = useState("");
  const [bis1, setBis1] = useState("");
  const [von2, setVon2] = useState("");
  const [bis2, setBis2] = useState("");
  const [geschlossen, setGeschlossen] = useState(false);
  const [meldung, setMeldung] = useState("");

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
        setMeldung(
          "Bitte mindestens eine Öffnungszeit eingeben oder geschlossen auswählen!"
        );
        return;
      }
      if ((von1 && !bis1) || (!von1 && bis1)) {
        setMeldung("Bitte sowohl 'Vormittag von' als auch 'Vormittag bis' ausfüllen!");
        return;
      }
      if ((von2 && !bis2) || (!von2 && bis2)) {
        setMeldung("Bitte sowohl 'Nachmittag von' als auch 'Nachmittag bis' ausfüllen!");
        return;
      }
      if ((von2 || bis2) && (!von1 || !bis1)) {
        setMeldung(
          "Nachmittagszeiten dürfen nur eingegeben werden, wenn Vormittagszeiten vorhanden sind!"
        );
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

    setMeldung("Öffnungszeiten wurden erfolgreich verändert!");
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

        <label>Tag:</label>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          required
          className="w-full rounded p-2.5 text-[16px]"
        >
          <option value="Mo-Fr">Montag bis Freitag</option>
          <option value="Sa">Samstag</option>
          <option value="So">Sonntag</option>
        </select>

        <label>Vormittag von:</label>
        <input
          type="time"
          value={von1}
          onChange={(e) => setVon1(e.target.value)}
          disabled={geschlossen}
          className="w-full rounded p-2.5 text-[16px]"
        />

        <label>Vormittag bis:</label>
        <input
          type="time"
          value={bis1}
          onChange={(e) => setBis1(e.target.value)}
          disabled={geschlossen}
          className="w-full rounded p-2.5 text-[16px]"
        />

        <label>Nachmittag von:</label>
        <input
          type="time"
          value={von2}
          onChange={(e) => setVon2(e.target.value)}
          disabled={geschlossen}
          className="w-full rounded p-2.5 text-[16px]"
        />

        <label>Nachmittag bis:</label>
        <input
          type="time"
          value={bis2}
          onChange={(e) => setBis2(e.target.value)}
          disabled={geschlossen}
          className="w-full rounded p-2.5 text-[16px]"
        />

        <div className="flex items-center gap-2.5">
          <label htmlFor="geschlossen">Geschlossen</label>
          <input
            type="checkbox"
            id="geschlossen"
            checked={geschlossen}
            onChange={(e) => handleGeschlossenChange(e.target.checked)}
          />
        </div>

        <p className="text-center">
          Zum Zurücksetzen der Zeiten einfach auf &quot;Geschlossen&quot;
          doppelklicken.
        </p>

        <button
          type="submit"
          className="w-full cursor-pointer rounded bg-[#A5BDD8] p-2.5 text-[16px] transition-all hover:scale-105 hover:bg-[#B3D0EB]"
        >
          Speichern
        </button>
      </form>
    </div>
  );
}
