
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
        logo: "vue-inline",
      },
    })
    const report = await runApp(userConfig); 

    const componentReport = report.fileReports.find((f) => f.writer.ext === "vue");
    expect(componentReport?.writer.content).toMatchFileSnapshot(join(snapshotDir, "vue-inline.vue.txt"));

    const typeFile = report.fileReports.find((f) =>  f.writer.name.endsWith("-types"));
    expect(typeFile?.writer.content).toMatchFileSnapshot(join(snapshotDir, "types.ts.txt"));

    const tokenFile = report.fileReports.find((f) => f.writer.name.endsWith("-tokens"));
    expect(tokenFile?.writer.content).toMatchFileSnapshot(join(snapshotDir, "tokens.ts.txt"));
  });

});
