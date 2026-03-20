import type { ReactNode } from "react";

import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";

export default async function AdminMitarbeiterLayout({
  children,
}: {
  children: ReactNode;
}) {
  let me: { role: string } | null = null;
  try {
    me = await fetchAuthQuery(api.users.me, {});
  } catch {
    redirect("/admin");
  }
  if (!me || me.role !== "admin") {
    redirect("/admin");
  }
  return <>{children}</>;
}

