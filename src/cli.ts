import type { UserConfig } from "./core/config";

import path from "node:path";
import { defineCommand, runMain } from "citty";
import { loadConfig } from "c12";
import pkg from "./../package.json" assert { type: "json" };
import { runApp } from "./core/app";
import { report } from "./core/reporter";
import { File } from "./main";
import { mkdir } from "node:fs/promises";

const runCommand = defineCommand({
  meta: {
    name: "run",
    description: "Process config file",
  },
  args: {
    config: {
      type: "string",
      description: "Path to config file",
      required: false,
    },
  },
  run: async ({ args }) => {
    const configPath = path.resolve((args?.c as string) ?? process.cwd());
    const { config } = await loadConfig<UserConfig>({
      name: "svgpipe",
      cwd: configPath,
    });

    const info = await runApp(config);
    report(info);
  },
});

const initCommand = defineCommand({
  meta: {
    name: "init",
    description: "Generate a config file and svgpipe directory",
  },
  args: {
    out: {
      type: "string",
      description: "Base output directory",
      required: false,
    },
  },
  run: async ({ args }) => {
    const basePath = path.resolve((args?.out as string) ?? process.cwd());
    const configFile = new File({
      name: "svgpipe.config",
      ext: "ts",
      dir: basePath,
      content: `
        import { defineConfig } from "svgpipe";

        export default defineConfig({
          modules: {},
        }) 
      `,
    });

    await Promise.all([
      configFile.write(),
      mkdir(path.join(basePath, "svgpipe", "in"), { recursive: true })
    ]);
  },
});

export const main = defineCommand({
  meta: {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
  },
  subCommands: {
    run: runCommand,
    init: initCommand,
  },
});

runMain(main);
