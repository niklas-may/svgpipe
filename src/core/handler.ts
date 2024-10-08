import type { Config as SvgoConfig } from "svgo";
import type { IWriter } from "./writer";
import type { ModuleConfig } from "./config";

import { TokenHandler } from "../handler/token-handler";
import { TypeHandler } from "../handler/type-handler";
import { VueInlineHandler } from "../handler/vue-inline-handler";
import { File } from "./file";
import { CssMaskHandler } from "../handler/css-mask-handler";
import { VueCssMaskHandler } from "../handler/vue-css-mask-handler";

export interface ISvgHandler {
  config?: SvgoConfig;
  onFile?: (svgFile: File) => IWriter | void;
  onEnd?: (context: Context) => IWriter[] | void;
}

export type Context = {
  type: TypeHandler;
  token: TokenHandler;
};

export type CreateHandler = (config: ModuleConfig) => ISvgHandler;

export type HandlerName = "css-mask" | "vue-css-mask" | "vue-inline" ;
export const defaultHandler: Record<HandlerName, CreateHandler> = {
  "css-mask": (c) => new CssMaskHandler(c),
  "vue-css-mask": (c) => new VueCssMaskHandler(c),
  "vue-inline": (c) => new VueInlineHandler(c),
};
