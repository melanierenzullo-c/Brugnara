import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const { text, target } = await req.json();

  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Kein Text angegeben" }, { status: 400 });
  }

  if (!target || (target !== "it" && target !== "en")) {
    return NextResponse.json({ error: "Ungueltige Zielsprache" }, { status: 400 });
  }

  const apiKey = process.env.LANGBLY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API-Key fehlt" }, { status: 500 });
  }

  let res: Response;
  try {
    res = await fetch("https://api.langbly.com/language/translate/v2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: text.trim(), source: "de", target }),
    });
  } catch {
    return NextResponse.json(
      { error: "Übersetzungsdienst nicht erreichbar" },
      { status: 503 }
    );
  }

  if (!res.ok) {
    const isBlocked = res.status === 401 || res.status === 403;
    return NextResponse.json(
      {
        error: isBlocked
          ? "Übersetzungsdienst blockiert oder nicht autorisiert"
          : "Übersetzung fehlgeschlagen",
      },
      { status: 502 }
    );
  }

  const data = await res.json();
  const translation = data?.data?.translations?.[0]?.translatedText;

  if (!translation) {
    return NextResponse.json({ error: "Keine Übersetzung erhalten" }, { status: 500 });
  }

  return NextResponse.json({ translation });
}
