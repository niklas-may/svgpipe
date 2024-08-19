import { Config as SvgoConfig } from "svgo";
import { VueInlineConfig } from "./strategies/vue-inline-strategy";

export interface IStrategy {
  options: CombinedModuleConfig<any>;
  files: IFile[];
  process: (files: IFile[]) => void;
}

export interface IFileArgs {
  extension: string;
  name: string;
  path: string;
  content: string;
}

export interface IFile extends IFileArgs {
  fullPath: string;
  fullFilePath: string;
  write: () => Promise<void>;
}

export type StrategyConfigEntry<TName extends string, TOptions extends Record<string, any>> = TName | [TName, TOptions];

export type StrategyConfig = VueInlineConfig | "default" | [new (...args: any) => IStrategy, Record<string, any>?];

export type ModuleConfig = {
  input: string;
  svgo?: SvgoConfig;
  strategy?: StrategyConfig;
  output: string;
};

export type Config = {
  baseOutputDir?: string;
  modules: ModuleConfig[];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

export type ModuleConfigParse<T extends Record<string, any>> = Omit<Optional<ModuleConfig>, "strategy"> & { strategyConfig: T };

export type CombinedModuleConfig<T extends Record<string, any> = {}> = Omit<Config, "modules"> & {
  module: ModuleConfigParse<T>;
};
