import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["convex/**/*.test.ts", "lib/**/*.test.ts"],
    environment: "edge-runtime",
    coverage: {
      provider: "v8",
      include: [
        "convex/authz.ts",
        "convex/users.ts",
        "convex/bootstrap.ts",
        "convex/files.ts",
        "convex/produkte.ts",

        "convex/clearProducts.ts",
      ],
      exclude: ["convex/_generated/**"],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
  },
});

