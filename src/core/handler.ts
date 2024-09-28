import type { Config as SvgoConfig } from "svgo";
import type { IFile } from "./file";
import type { ModuleConfig } from "./config";

import { TokenHandler } from "../handler/token-handler";
import { TypeHandler } from "../handler/type-handler";
import { VueInlineHandler } from "../handler/vue-inline-handler";
import { File } from "./file";
import { CssMaskHandler } from "src/handler/css-mask-handler";
import { VueCssMaskHandler } from "src/handler/vue-css-mask-handler";

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

export type DefaultHandlerName = "css-mask" | "vue-css-mask" | "vue-inline" ;
export const defaultHandler: Record<DefaultHandlerName, CreateHandler> = {
  "css-mask": (c) => new CssMaskHandler(c),
  "vue-css-mask": (c) => new VueCssMaskHandler(c),
  "vue-inline": (c) => new VueInlineHandler(c),
};
