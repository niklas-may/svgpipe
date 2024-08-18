import type { Config } from "./../types";

import { describe, it } from "vitest";
import { run } from "./app";
import { MyStrategy } from "../../test/fixtures/straegies/custom";
import { join } from "path";

describe("[App]", () => {
  const baseDir = join("./.svgpipe", "app");

  describe("Build in strategy", () => {
    it("No options", async () => {
      const config: Config = {
        baseDir,
        modules: [
          {
            input: "test/fixtures/svgs",
            output: "./svgs/logos",
            strategy: "vue-inline",
          },
        ],
      };

      await run(config);
    });

    it("Options", async () => {
      const config: Config = {
        baseDir,
        modules: [
          {
            input: "./test/fixtures/svgs",
            output: "./svgs",
            svgo: {
              multipass: true,
            },
            strategy: [
              "vue-inline",
              {
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
        baseDir: join(baseDir, "custom"),
        modules: [
          {
            input: "./test/fixtures/svgs",
            output: "./svgs",
            strategy: [MyStrategy],
          },
        ],
      };
      await run(config);
    });

    it("Options", async () => {
      const config: Config = {
        baseDir,
        modules: [
          {
            input: "./test/fixtures/svgs",
            output: "./svgs",
            strategy: [
              MyStrategy,
              {
                componentName: "MyComponent",
              },
            ],
          },
        ],
      };
      await run(config);
    });
  });
});
