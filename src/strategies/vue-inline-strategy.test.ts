import type { Config } from "src/types";

import { afterAll, describe, expect, it } from "vitest";
import { run } from "../../src/core/app";
import { rmSync } from "fs";
import { join } from "path";

describe("[vue-inline]", (test) => {
  const baseDir = join("./test/.svgpipe", "vue-inline");

  afterAll(() => {
    rmSync(baseDir, { recursive: true, force: true });
  });

  describe("Options: typePath is defined, tokenPath is defined", async () => {
    const config: Config = {
      baseDir,
      modules: [
        {
          input: "test/fixtures/svgs",
          output: "./svgs",
          strategy: [
            "vue-inline",
            {
              componentPath: "/",
              typePath: "/",
              tokenPath: "/",
            },
          ],
        },
      ],
    };

    const [vueInlineStrategy] = await run(config);

    it("Component should match snapshot", async () => {
      const componentFile = vueInlineStrategy.files.find((file) => file.extension === "vue");
      expect(componentFile?.content).toMatchFileSnapshot("./__snapshots__/component-external-types.vue");
    });

    it("Types should match snapshot", () => {
      const typeFile = vueInlineStrategy.files.find((file) => file.name === "BaseIconProps");
      expect(typeFile?.content).toMatchFileSnapshot("./__snapshots__/types.ts");
    });

    it("Tokens should match snapshot", () => {
      const file = vueInlineStrategy.files.find((file) => file.name === "baseIconTokens");
      expect(file?.content).toMatchFileSnapshot("./__snapshots__/tokens.ts");
    });
  });

  describe("Option: typePath is undefined, tokenPath is undefined", async () => {
    it("Component file should match snapshot", async () => {
      const config: Config = {
        baseDir,
        modules: [
          {
            input: "test/fixtures/svgs",
            output: "./svgs",
            strategy: [
              "vue-inline",
              {
                componentPath: "/",
                typePath: "",
              },
            ],
          },
        ],
      };
      const [vueInlineStrategy] = await run(config);

      const componentFile = vueInlineStrategy.files.find((file) => file.extension === "vue");
      expect(componentFile?.content).toMatchFileSnapshot("./__snapshots__/component-inline-types.vue");
    });
  });
});
