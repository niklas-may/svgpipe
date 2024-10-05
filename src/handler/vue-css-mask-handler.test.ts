
import { describe, expect, it } from "vitest";
import { join } from "path";
import { runApp } from "../core/app";
import { defineConfig } from "../main";

describe("[vue-inline-handler]", () => {
  const baseOut = "__test__/svgpipe";
  const baseIn = "__test__/svgpipe/in";
  const snapshotDir = "./__test__/snapshots";

  it("Should match snapshots", async () => {
    const userConfig = defineConfig({
      baseOut,
      baseIn,
      modules: {
        logo: "vue-css-mask",
      },
    })
    const report = await runApp(userConfig); 

    const componentReport = report.fileReports.find((f) => f.writer.ext === "vue");
    expect(componentReport?.writer.content).toMatchFileSnapshot(join(snapshotDir, "vue-css-mask.vue.txt"));
  });

});
