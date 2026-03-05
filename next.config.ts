import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cautious-guanaco-567.eu-west-1.convex.cloud",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
