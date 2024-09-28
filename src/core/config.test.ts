import { describe, expect, it } from "vitest";
import { createConfig, defineConfig } from "./config";
import { join } from "path";

describe("[Config]", () => {
  const snapshotDir = "./__test__/snapshot/config";

  it("UserConfig to Config should match snapshot", () => {
    const userConfig = defineConfig({
      baseOut: "./svgpipe",
      modules: {
        lorem: {
          handler: "vue-inline",
          prepareName: (name) => name,
          tokenPath: "/my-tokenPath",
          typePath: "/my-typePath",
          in: "/my-in",
          out: "/my-out",
          svgo: {
            replace: false,
            config: {
              plugins: [
                {
                  name: "removeDoctype",
                },
              ],
            },
          },
        },
        ipsum: {
          handler: () => ({}),
          prepareName: (name) => name,
          ignoreBase: true,
          tokenPath: "/my-tokenPath",
          typePath: "/my-typePath",
          in: "/my-in",
          out: "/my-out",
          svgo: {
            replace: true,
            config: {
              plugins: [
                {
                  name: "removeDoctype",
                },
              ],
            },
          },
        },
        dolor: "vue-inline",
      },
    });

    const config = createConfig(userConfig);
    expect(config).toMatchFileSnapshot(join(snapshotDir, "config.text"));
  });
});
