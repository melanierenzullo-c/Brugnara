"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

export function AdminHeader({ title, subtitle, backHref = "/admin", backLabel = "Dashboard" }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:gap-6 sm:px-6 lg:px-10">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.png"
              alt="M. Brugnara"
              width={120}
              height={60}
              className="h-7 sm:h-8 w-auto"
            />
          </Link>

          <div className="h-6 w-px bg-border/60" />

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
          <Link href="/admin" className="font-medium text-muted-foreground hover:text-foreground transition-colors">
            Admin
          </Link>
          {backHref !== "/admin" && (
            <>
              <svg className="h-3.5 w-3.5 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-semibold text-foreground">{title}</span>
            </>
          )}
          {backHref === "/admin" && (
            <>
              <svg className="h-3.5 w-3.5 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-semibold text-foreground">{title}</span>
            </>
          )}
        </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {backHref !== "/admin" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-white px-3 py-1.5 text-sm font-medium text-foreground/80 transition hover:border-primary/30 hover:text-primary"
            >
              <svg className="h-3.5 w-3.5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 sm:px-4 py-1.5 text-sm font-bold text-white transition hover:bg-primary/90"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="hidden sm:inline">Website</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
