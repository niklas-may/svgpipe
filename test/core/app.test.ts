import type { Config } from "src/types";

import { afterAll, describe, it } from "vitest";
import { run } from "../../src/core/app";
import { MyStrategy } from "../fixtures/straegies/custom";
import { rmSync } from "fs";

describe("[App]", () => {
  const baseDir = "./test/.svgpipe";

  afterAll(() => {
    rmSync(baseDir, { force: true, recursive: true });
  });

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
        baseDir: ".svgpipe/custom",
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
                componentName: "BaseIcon",
              },
            ],
          },
        ],
      };
      await run(config);
    });
  });
});
