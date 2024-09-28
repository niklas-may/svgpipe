import type { Config as SvgoConfig } from "svgo";
import type { IFile } from "./file";
import type { ModuleConfig } from "./config";

import { TokenHandler } from "../handler/token-handler";
import { TypeHandler } from "../handler/type-handler";
import { VueInlineHandler } from "../handler/vue-inline-handler";
import { File } from "./file";

export interface ISvgHandler {
  config?: SvgoConfig;
  onFile?: (svgFile: File) => IFile | void;
  onEnd?: (context: Context) => IFile[] | void;
}

export type Context = {
  type: TypeHandler;
  token: TokenHandler;
};

export type CreateHandler = (config: ModuleConfig) => ISvgHandler;

export type DefaultHandlerName = "vue-inline";
export const defaultHandler: Record<DefaultHandlerName, CreateHandler> = {
  "vue-inline": (c) => new VueInlineHandler(c),
};
