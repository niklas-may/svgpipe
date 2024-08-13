import { Config as SvgoConfig } from "svgo";
import { VueInlineConfig } from "./strategies/vue-inline-strategy";

export interface IStrategy {
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

export type StrategyConfig = VueInlineConfig | "default" | [new (...args: any) => IStrategy, CombinedModuleConfig<any>];

export type ModuleConfig = {
  input: string;
  svgo?: SvgoConfig;
  strategy?: StrategyConfig;
  output: string;
};

export type CombinedModuleConfig<T extends Record<string, any>> = Omit<ModuleConfig, "strategy" | "svgo"> & {
  strategy: T;
};

export type Config = {
  baseDir?: string;
  modules: ModuleConfig[];
};
