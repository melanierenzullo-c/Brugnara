import type { ReactNode } from "react";

import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";

export default async function AdminMitarbeiterLayout({
  children,
}: {
  children: ReactNode;
}) {
  const me = await fetchAuthQuery(api.users.me, {});
  if (me.role !== "admin") {
    redirect("/admin");
  }
  return <>{children}</>;
}

