import { describe, expect, it } from "vitest";
import { createConfig, defineConfig } from "./config";
import { join } from "path";

describe("[Config]", () => {
  const snapshotDir = "./__test__/snapshot/config";

  it("Paths from UserConfig to Config should match snapshot", () => {
    const userConfig = defineConfig({
      baseOut: "./svgpipe",
      modules: {
        dolor: "vue-inline",
        ipsum: {
          in: "/my-in",
          out: "/my-out",
          tokenPath: "/my-tokenPath",
          typePath: "/my-typePath",
          handler: "vue-inline",
        },
        lorem: {
          ignoreBase: true,
          in: "/my-in",
          out: "/my-out",
          tokenPath: "/my-tokenPath",
          typePath: "/my-typePath",
          handler: "vue-inline",
        },
        salip: {
          ignoreBase: true,
          in: "/my-in",
          out: "/my-out",
          tokenPath: "",
          typePath: "",
          handler: "vue-inline",
        },
      },
    });

    const config = createConfig(userConfig);
    expect(JSON.parse(JSON.stringify(config))).toMatchFileSnapshot(join(snapshotDir, "config.text"));
  });
});
