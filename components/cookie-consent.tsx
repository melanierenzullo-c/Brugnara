"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const COOKIE_NAME = "cookieConsent";
const COOKIE_MAX_AGE_DAYS = 30;

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("Cookies");

  useEffect(() => {
    const hasConsent = document.cookie.includes(COOKIE_NAME);
    if (!hasConsent) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    const maxAge = 60 * 60 * 24 * COOKIE_MAX_AGE_DAYS;
    document.cookie = `${COOKIE_NAME}=accepted; max-age=${maxAge}; path=/`;
    setVisible(false);
  };

  const handleDecline = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-[50px] right-5 z-[9999] w-full max-w-[345px] rounded-lg bg-white p-4 px-6 pb-5 shadow-lg transition-all">
      <h2 className="text-lg font-medium text-[#4070f4]">{t("title")}</h2>
      <div className="mt-4">
        <p className="text-[#333]">
          {t("text")}{" "}
          <a href="/impressum" className="text-[#4070f4] no-underline hover:underline">
            {t("readMore")}
          </a>
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <button
          onClick={handleAccept}
          className="w-[calc(50%-10px)] cursor-pointer rounded bg-[#4070f4] px-0 py-2 text-white transition-colors hover:bg-[#034bf1]"
        >
          {t("accept")}
        </button>
        <button
          onClick={handleDecline}
          className="w-[calc(50%-10px)] cursor-pointer rounded border-2 border-[#4070f4] bg-white px-0 py-2 text-[#4070f4] transition-colors hover:bg-[#4070f4] hover:text-white"
        >
          {t("decline")}
        </button>
      </div>
    </div>
  );
}
