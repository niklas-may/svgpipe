export type { Config as SvgoConfig } from "svgo";
export type { IFile } from "./core/file";
export type { CreateHandler } from "./core/handler";
export type { ModuleConfig } from "./core/config";

export { File } from "./core/file";
export { defineConfig } from "./core/config";

export { TokenHandler } from "./handler/token-handler";
export { TypeHandler } from "./handler/type-handler";
export { CssMaskHandler } from "./handler/css-mask-handler";
export { VueCssMaskHandler } from "./handler/vue-css-mask-handler";
export { VueInlineHandler } from "./handler/vue-inline-handler";
