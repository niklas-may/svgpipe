import type { CombinedModuleConfig, IStrategy, ModuleConfig, Config } from "src/types";
import { readdirSync } from "fs";
import { readFile } from "fs/promises";
import { basename, extname, join, parse, resolve } from "path";
import { optimize } from "svgo";
import { File } from "./file";
import { VueInlineStrategy } from "src/strategies/vue-inline-strategy";
import { DefaultStrategy } from "src/strategies/default-strategy";

export async function run(config: Config) {
  return Promise.all(config.modules.map((module) => processModule(module, config)));
}

async function processModule(module: ModuleConfig, config: Config) {
  const svgs: File[] = [];

  await readInput(module, async ({ content, path }) => {
    const { data } = optimize(content, { path, ...module.svgo });
    const svg = new File({
      name: parse(basename(path)).name,
      content: data,
      extension: "svg",
      path: module.output,
    });

    svgs.push(svg);
  });

  const strategy = creatStrategy(module);
  strategy.process(svgs);

  return Promise.all(
    strategy.files.map((file) => {
      file.path = join(config.baseDir ?? "", file.path);
      return file.write();
    })
  );
}

async function readInput(module: ModuleConfig, callback: (args: { content: string; path: string }) => Promise<any>) {
  const paths = getSvgPaths(module.input);
  for (const path of paths) {
    const rawContent = await readFile(path, "utf-8");
    await callback({ content: rawContent, path });
  }
}

function getSvgPaths(dir: string) {
  const res: string[] = [];
  readdirSync(resolve(dir)).map((file) => {
    if (extname(file).toLowerCase() === ".svg") {
      res.push(join(dir, file));
    }
  });
  return res;
}

function getOptions(module: ModuleConfig) {
  const configTypeString = typeof module.strategy === "string";
  const options = Object.assign({}, module, { strategy: {} }) as CombinedModuleConfig<any>;
  if (configTypeString) {
    return options;
  }

  return Object.assign({}, module, { strategy: module.strategy![1] }) as CombinedModuleConfig<any>;
}

function getStrategy(module: ModuleConfig) {
  const configTypeString = typeof module.strategy === "string" || typeof module.strategy![0] === "string";

  if (configTypeString) {
    const strategyName = Array.isArray(module.strategy) ? module.strategy![0] : (module.strategy as string);
    switch (strategyName) {
      case "vue-inline":
        return VueInlineStrategy as new (opts: any) => IStrategy;
      case "default":
        return DefaultStrategy as new (opts: any) => IStrategy;
      default:
        throw new Error(`Unknown strategy: ${module.strategy}`);
    }
  }

  return module.strategy![0] as new (opts: any) => IStrategy;
}

function creatStrategy(module: ModuleConfig) {
  const options = getOptions(module);
  const Strategy = getStrategy(module);
  return new Strategy(options);
}
