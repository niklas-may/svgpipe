import type { Config } from "src/types";

import { describe, expect, it } from "vitest";
import { run } from "../../src/core/app";
import { join } from "path";

describe("[vue-inline]", () => {
  const baseDir = join("./.svgpipe", "vue-inline");

  it("Should match snapshot when creating token and type file", async () => {
    const config: Config = {
      baseDir,
      modules: [
        {
          input: "test/fixtures/svgs",
          output: "./svgs",
          strategy: [
            "vue-inline",
            {
              componentPath: "/components",
              typePath: "/tokens",
              tokenPath: "/types",
            },
          ],
        },
      ],
    };

    const [vueInlineStrategy] = await run(config);

    const componentFile = vueInlineStrategy.files.find((file) => file.extension === "vue");
    expect(componentFile?.content).toMatchFileSnapshot("./__snapshots__/component-external-types.vue");

    const typeFile = vueInlineStrategy.files.find((file) => file.name === "BaseIconProps");
    expect(typeFile?.content).toMatchFileSnapshot("./__snapshots__/types.ts");

    const file = vueInlineStrategy.files.find((file) => file.name === "baseIconTokens");
    expect(file?.content).toMatchFileSnapshot("./__snapshots__/tokens.ts");
  });

  it("Should match snapshot when no additional files", async () => {
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
