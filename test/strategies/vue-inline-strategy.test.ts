import type { Config } from "src/types";

import { afterAll, describe, expect, it, vi } from "vitest";
import { run } from "../../src/core/app";
import { rmSync } from "fs";
import { basename } from "path";

describe("[vue-inline]", () => {
  const baseDir = "./test/.svgpipe";

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
          strategy: ["vue-inline", {tokenPath: "./tokens"}],
        },
      ],
    };

    const [vueInlineStrategy] = await run(config);

    it("Component should match snapshot", async () => {
      const componentFile = vueInlineStrategy.files.find((file) => file.extension === "vue");
      expect(componentFile?.content).toMatchFileSnapshot("./snapshots/component-external-types.vue");
    });

    it("Types should match snapshot", () => {
      const typeFile = vueInlineStrategy.files.find((file) => file.name === "BaseIconProps");
      expect(typeFile?.content).toMatchFileSnapshot("./snapshots/types.ts");
    });

    it("Tokens should match snapshot", () => {
      const  file = vueInlineStrategy.files.find((file) => file.name === "baseIconTokens");
      expect(file?.content).toMatchFileSnapshot("./snapshots/tokens.ts");
    });
  });

  describe("Option: typePath is undefined, tokenPath is undefined", async () => {
    const config: Config = {
      baseDir,
      modules: [
        {
          input: "test/fixtures/svgs",
          output: "./svgs",
          strategy: ["vue-inline", { typePath: "" }],
        },
      ],
    };
    const [vueInlineStrategy] = await run(config);

    it("Component file should match snapshot", async () => {
      const componentFile = vueInlineStrategy.files.find((file) => file.extension === "vue");
      expect(componentFile?.content).toMatchFileSnapshot("./snapshots/component-inline-types.vue");
    });
  });
});
