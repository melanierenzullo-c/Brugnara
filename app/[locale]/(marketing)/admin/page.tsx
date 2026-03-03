import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function AdminPage() {
  const t = useTranslations("Admin");
  const tNav = useTranslations("Navigation");
  const locale = useLocale();

  return (
    <div className="bg-[#5A759E]">
      <div className="mx-auto min-h-screen px-5 py-5 lg:w-[80%]">
        <br />
        <div className="flex items-center p-8 text-white">
          <h1>{t("greeting")}</h1>
          <Link
            href="/"
            className="ml-auto cursor-pointer border-none bg-[#A5BDD8] p-4 text-[15px] transition-all hover:scale-105 hover:bg-[#B3D0EB]"
          >
            {tNav("backToHome")}
          </Link>
        </div>

        {/* Row 1: Produkte & News */}
        <div className="flex flex-col justify-center gap-5 p-5 lg:flex-row">
          <div className="w-full bg-[#A5BDD8] p-5 lg:w-[calc(50%-20px)]">
            <h6 className="text-center text-[1.5em] font-bold text-black">
              {t("produkte")}
            </h6>
            <Link href="/admin/produkte">
              <button className="mx-auto my-5 block cursor-pointer border-none bg-[#A5BDD8] px-8 py-3 text-[18px] transition-all hover:scale-105 hover:bg-[#B3D0EB]">
                {t("hinzufuegen")}
              </button>
            </Link>
          </div>

          <div className="w-full bg-[#A5BDD8] p-5 lg:w-[calc(50%-20px)]">
            <h6 className="text-center text-[1.5em] font-bold text-black">
              {t("news")}
            </h6>
            <Link href="/admin/news">
              <button className="mx-auto my-5 block cursor-pointer border-none bg-[#A5BDD8] px-8 py-3 text-[18px] transition-all hover:scale-105 hover:bg-[#B3D0EB]">
                {t("hinzufuegen")}
              </button>
            </Link>
          </div>
        </div>

        {/* Row 2: Öffnungszeiten & Marken */}
        <div className="flex flex-col justify-center gap-5 p-5 lg:flex-row">
          <div className="w-full bg-[#A5BDD8] p-5 lg:w-[calc(50%-20px)]">
            <h6 className="text-center text-[1.5em] font-bold text-black">
              {t("oeffnungszeiten")}
            </h6>
            <br />
            <p className="text-center font-bold text-black">
              {t("oeffnungszeitenHinweis")}
            </p>
            <p className="mt-4 text-center text-black/60">
              {t("dbPlaceholder")}
            </p>
          </div>

          <div className="w-full bg-[#A5BDD8] p-5 lg:w-[calc(50%-20px)]">
            <h6 className="text-center text-[1.5em] font-bold text-black">
              {t("marken")}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
}
