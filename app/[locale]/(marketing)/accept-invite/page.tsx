"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "@/i18n/navigation";

export default function AcceptInvitePage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const inviteInfo = useQuery(
    api.users.getInviteInfoByToken,
    token ? { token } : "skip"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrorMessage(t("inviteAcceptFailed"));
      return;
    }
  }, [token, t]);

  useEffect(() => {
    if (!inviteInfo) {
      return;
    }
    if (inviteInfo.expired || inviteInfo.used) {
      setErrorMessage(t("inviteAcceptFailed"));
      return;
    }
    setEmail(inviteInfo.email);
  }, [inviteInfo, t]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!token || !inviteInfo || inviteInfo.expired || inviteInfo.used) {
      setErrorMessage(t("inviteAcceptFailed"));
      return;
    }

    if (!name.trim()) {
      setErrorMessage(t("nameRequired"));
      return;
    }
    if (!email.trim()) {
      setErrorMessage(t("emailRequired"));
      return;
    }
    if (!password) {
      setErrorMessage(t("passwordRequired"));
      return;
    }
    if (!passwordConfirm) {
      setErrorMessage(t("passwordConfirmRequired"));
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMessage(t("passwordsDontMatch"));
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message ?? t("inviteAcceptFailed"));
        return;
      }

      router.push("/admin");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("inviteAcceptFailed");
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInviteInvalid =
    !token || !inviteInfo || inviteInfo.expired || inviteInfo.used;

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-[520px] flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">{t("inviteTitle")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("inviteHint")}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            {t("nameLabel")}
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            disabled={isInviteInvalid || isSubmitting}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            {t("emailLabel")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            readOnly
            className="w-full cursor-not-allowed rounded-md border bg-muted px-3 py-2 text-sm opacity-80"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            {t("passwordLabel")}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            disabled={isInviteInvalid || isSubmitting}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="passwordConfirm" className="text-sm font-medium">
            {t("passwordConfirmLabel")}
          </label>
          <input
            id="passwordConfirm"
            type="password"
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            disabled={isInviteInvalid || isSubmitting}
          />
        </div>

        {errorMessage ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || isInviteInvalid}
          className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? t("signingUp") : t("signupButton")}
        </button>
      </form>
    </div>
  );
}

