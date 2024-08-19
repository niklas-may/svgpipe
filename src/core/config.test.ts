import type { Config } from "src/types";

import { describe, it, expectTypeOf } from "vitest";
import { defineConfig } from "./config";

describe("[Config]", () => {
  describe("defineConfig", () => {
    it("String config should not have TS error", async () => {
      const config = defineConfig({
        baseOutputDir: ".svgpipe",
        modules: [
          {
            input: "./test/fixtures/svgs",
            output: "./svg/logos",
            strategy: "vue-inline",
          },
        ],
      });

      expectTypeOf(config).toMatchTypeOf<Config>();
    });

    it("Array config should not have TS error", async () => {
      const config = defineConfig({
        baseOutputDir: ".svgpipe",
        modules: [
          {
            input: "./test/fixtures/svgs",
            output: "./svg/logos",
            strategy: ["vue-inline", { componentName: "BaseIcon", componentPath: "./components" }],
          },
        ],
      });
      expectTypeOf(config).toMatchTypeOf<Config>();
    });
  });
});
