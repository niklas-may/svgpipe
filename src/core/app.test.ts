import type { UserConfig } from "./config";

import { describe, expect, it } from "vitest";
import { join } from "path";
import { runApp } from "./app";
import { defineConfig } from "./config";

describe("[App]", () => {
  const baseOut = join("./__test__/svgpipe");

  it("Should process every model config style", async () => {
    const cases: UserConfig[] = [
      defineConfig({
        baseOut,
        modules: {
          logo: "vue-inline",
        },
      }),
      defineConfig({
        baseOut,
        modules: {
          logo: {
            handler: "vue-inline",
            svgo: {
              stdout: true,
            },
          },
        },
      }),
      defineConfig({
        baseOut,
        modules: {
          logo: {
            handler: () => ({}),
          },
        },
      }),
    ];

    for (const userConfig of cases) {
      const info = await runApp(userConfig);
      expect(info).toBeDefined();
    }
  });
});
