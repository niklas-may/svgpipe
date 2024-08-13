import { describe, it } from "vitest";
import { run } from "src/core/app";
import { Config } from "src/types";

describe("[App]", () => {
  it("Should handle build in strategy: No options", async () => {
    const config: Config = {
      baseDir: ".svgpipe",
      modules: [
        {
          input: "./test/fixtures/svgs",
          output: "./svg/logos",
          svgo: {
            multipass: true,
          },
          strategy: "vue-inline",
        },
      ],
    };
    await run(config);
  });

  it("Should handle build in strategy: With options", async () => {
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
