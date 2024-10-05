import { describe, expect, it } from "vitest";
import { join } from "path";
import { runApp } from "../core/app";
import { defineConfig } from "../main";

describe("[css-mask handler]", () => {
  const baseOut = "__test__/svgpipe";
  const baseIn = "__test__/svgpipe/in";
  const snapshotDir = "./__test__/snapshots";

  it("Should match snapshots", async () => {
    const userConfig = defineConfig({
      baseOut,
      baseIn,
      modules: {
        logo: "css-mask",
      },
    });
    const info = await runApp(userConfig);

    const componentReport = info.fileReports.find((f) => f.writer.ext === "css");
    expect(componentReport?.writer.content).toMatchFileSnapshot(join(snapshotDir, "css-mask.css.txt"));
  });
});
