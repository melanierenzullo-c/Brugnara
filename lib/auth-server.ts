import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

function mustGetEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthNextJs({
  convexUrl: mustGetEnv("NEXT_PUBLIC_CONVEX_URL"),
  convexSiteUrl: mustGetEnv("NEXT_PUBLIC_CONVEX_SITE_URL"),
});

