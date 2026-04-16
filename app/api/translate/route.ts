import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const { text } = await req.json();

  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Kein Text angegeben" }, { status: 400 });
  }

  const apiKey = process.env.LANGLBY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API-Key fehlt" }, { status: 500 });
  }

  const res = await fetch("https://api.langbly.com/language/translate/v2", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: text.trim(), source: "de", target: "it" }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Übersetzung fehlgeschlagen" }, { status: 500 });
  }

  const data = await res.json();
  const translation = data?.data?.translations?.[0]?.translatedText;

  if (!translation) {
    return NextResponse.json({ error: "Keine Übersetzung erhalten" }, { status: 500 });
  }

  return NextResponse.json({ translation });
}
