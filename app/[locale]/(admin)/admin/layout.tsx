import type { ReactNode } from "react";

import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import {
  fetchAuthMutation,
  fetchAuthQuery,
  isAuthenticated,
} from "@/lib/auth-server";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/login");
  }

  // Idempotent: provisions the first admin if env + email match.
  try {
    await fetchAuthMutation(api.bootstrap.bootstrapInitialAdmin, {});
  } catch {
    // If bootstrap fails we still let regular users continue.
  }

  // Provision invited users (employees) on first access.
  try {
    await fetchAuthMutation(api.users.ensureCurrentUser, {});
  } catch {
    // If this fails we fall back to the regular user check below.
  }

  try {
    await fetchAuthQuery(api.users.me, {});
  } catch {
    redirect("/login");
  }

  return <>{children}</>;
}

