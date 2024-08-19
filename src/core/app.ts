import type { CombinedModuleConfig, IStrategy, ModuleConfig, Config } from "src/types";
import { readdirSync } from "fs";
import cloneDeep from "lodash/cloneDeep";
import { readFile } from "fs/promises";
import { basename, extname, join, parse, resolve } from "path";
import { optimize } from "svgo";
import { File } from "./file";
import { VueInlineStrategy } from "../strategies/vue-inline-strategy";
import { DefaultStrategy } from "../strategies/default-strategy";
import defu from "defu";
import { createConsola } from "consola";

const logger = createConsola({ formatOptions: { date: false } }).withTag("svgpipe");

export async function run(config: Config): Promise<IStrategy[]> {
  return Promise.all(config.modules.map((module) => processModule(module, config)));
}

async function processModule(module: ModuleConfig, config: Config): Promise<IStrategy> {
  const svgs: File[] = [];

  const strategy = creatStrategy(module, config);
  const svgoOptions = defu(module.svgo, strategy.options.module.svgo);

  await readInput(module, async ({ content, path }) => {
    const { data } = optimize(content, { path, ...svgoOptions });
    const svg = new File({
      name: parse(basename(path)).name,
      content: data,
      extension: "svg",
      path: join(config.baseDir ?? "", module.output),
    });

    svgs.push(svg);
  });

  strategy.process(svgs);

  await Promise.all(strategy.files.map((file) => file.write()));
  logger.success(`(${strategy.constructor.name}) Processed ${svgs.length} files`);
  return strategy;
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

function getModuleOptions(module: ModuleConfig, config: Config) {
  const configTypeString = typeof module.strategy === "string";
  const options = Object.assign({}, config, { module }) as CombinedModuleConfig<any>;
  if (configTypeString) {
    const res = cloneDeep(options);
    delete res.modules;
    return options;
  }

  options.module.strategyConfig = module.strategy![1];
  const res = cloneDeep(options);
  delete res.strategy;
  return res;
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

function creatStrategy(module: ModuleConfig, config: Config) {
  const options = getModuleOptions(module, config);
  const Strategy = getStrategy(module);
  return new Strategy(options);
}
