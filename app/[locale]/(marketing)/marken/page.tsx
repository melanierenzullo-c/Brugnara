import { useTranslations } from "next-intl";

export default function MarkenPage() {
  const t = useTranslations("Marken");

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Page header */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-3xl font-bold text-[#3A537E]">{t("title")}</h1>
          <p className="mt-2 text-[#6B7280]">{t("content")}</p>
        </div>
      </div>

      {/* Placeholder for brands grid */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {/* Brand cards will go here when real data is available */}
          <div className="flex aspect-square items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-center text-[#6B7280]">Brand logos werden geladen, sobald die Datenbank verbunden ist.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
