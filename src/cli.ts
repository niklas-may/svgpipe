#! /usr/bin/env node

import path from "node:path";
import { defineCommand, runMain } from "citty";
import { loadConfig } from "c12";
import pkg from "./../package.json" assert { type: "json" };
import { run } from "./core/app";
import { Config } from "./types";

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
    const { config } = await loadConfig<Config>({
      name: "svgpipe",
      cwd: configPath,
    });

    await run(config);
  },
});

const main = defineCommand({
  meta: {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
  },
  subCommands: {
    run: runCommand,
  },
});

runMain(main);
