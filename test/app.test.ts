import type { Config } from "src/types";

import { describe, it } from "vitest";
import { run } from "../src/core/app";
import { MyStrategy } from "./fixtures/straegies/custom";

describe("[App]", () => {
  describe("Build in strategy", () => {
    it.only("No options", async () => {
      const config: Config = {
        baseDir: ".svgpipe",
        modules: [
          {
            input: "./test/fixtures/svgs",
            output: "./svg/logos",
            strategy: "vue-inline",
          },
        ],
      };
      await run(config);
    });

    it("Options", async () => {
      const config: Config = {
        baseDir: ".svgpipe",
        modules: [
          {
            input: "./test/fixtures/svgs",
            output: "./svg/logos",
            svgo: {
              multipass: true,
            },
            strategy: [
              "vue-inline",
              {
                componentName: "BaseIcon",
                componentPath: "./components",
              },
            ],
          },
        ],
      };
      await run(config);
    });
  });

  describe("Custom strategy", () => {
    it("No Options", async () => {
      const config: Config = {
        baseDir: ".svgpipe",
        modules: [
          {
            input: "./test/fixtures/svgs",
            output: "./svg/logos",
            strategy: [MyStrategy],
          },
        ],
      };
      await run(config);
    });

    it("Options", async () => {
      const config: Config = {
        baseDir: ".svgpipe",
        modules: [
          {
            input: "./test/fixtures/svgs",
            output: "./svg/logos",
            strategy: [
              MyStrategy,
              {
                componentName: "BaseIcon",
                componentPath: "./components",
              },
            ],
          },
        ],
      };
      await run(config);
    });
  });
});
