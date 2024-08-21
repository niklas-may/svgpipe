import type { Config } from "src/types";

import { describe, expect, it } from "vitest";
import { run } from "../../src/core/app";
import { join } from "path";

describe("[vue-inline-strategy]", () => {
  const baseOutputDir = "./.svgpipe/vue-inline-strategy";
  const baseInputDir = "./test/fixtures";
  const snapshotDir = "./__snapshots__/vue-inline-strategy";

  it("Should match snapshot when creating token and type file", async () => {
    const config: Config = {
      baseOutputDir,
      baseInputDir,
      modules: [
        {
          input: "svgs",
          output: "svgs",
          strategy: [
            "vue-inline",
            {
              componentPath: "/components",
              typePath: "/types",
              tokenPath: "/tokens",
            },
          ],
        },
      ],
    };

    const [vueInlineStrategy] = await run(config);

    const componentFile = vueInlineStrategy.files.find((file) => file.extension === "vue");
    expect(componentFile?.content).toMatchFileSnapshot(join(snapshotDir, "component-external-types.vue"));

    const typeFile = vueInlineStrategy.files.find((file) => file.name === "BaseIconProps");
    expect(typeFile?.content).toMatchFileSnapshot(join(snapshotDir, "types.ts"));

    const file = vueInlineStrategy.files.find((file) => file.name === "baseIconTokens");
    expect(file?.content).toMatchFileSnapshot(join(snapshotDir, "tokens.ts"));
  });

  it("Should match snapshot when no additional files", async () => {
    const config: Config = {
      baseOutputDir,
      baseInputDir,
      modules: [
        {
          input: "svgs",
          output: "svgs",
          strategy: [
            "vue-inline",
            {
              typePath: "",
              componentName: "BaseIconMin"
            },
          ],
        },
      ],
    };
    const [vueInlineStrategy] = await run(config);

    const componentFile = vueInlineStrategy.files.find((file) => file.extension === "vue");
    expect(componentFile?.content).toMatchFileSnapshot(join(snapshotDir, "component-inline-types.vue"));
  });
});
