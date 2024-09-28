import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import ts from "typescript";

export default defineConfig({
  test: {
    coverage: {
      include: ["@src/**/*.ts"],
    },
  },
  plugins: [tsconfigPaths()],
});
