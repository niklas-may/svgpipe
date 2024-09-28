import type { Config as SvgoConfig } from "svgo";
import type { ModuleConfig } from "../core/config";
import type { ISvgHandler } from "../core/handler";
import type { Context } from "../core/handler";

import { join } from "path";
import { pascalCase, kebabCase } from "change-case-all";
import { File } from "../core/file";
import { CssMaskHandler } from "./css-mask-handler";

export class VueCssMaskHandler implements ISvgHandler {
  private file;
  private cssFileHandler: CssMaskHandler;
  config: SvgoConfig;

  constructor(private readonly mConfig: ModuleConfig) {
    this.cssFileHandler = new CssMaskHandler(mConfig);
    this.config = this.cssFileHandler.config;

    this.file = new File({
      name: pascalCase("Svg " + this.mConfig.name),
      extension: "vue",
      path: join(this.mConfig.out, "components"),
    });
  }

  onFile(svg: File) {
    this.cssFileHandler.onFile(svg);
    return svg;
  }

  onEnd(ctx: Context) {
    const cssReturn = this.cssFileHandler.onEnd(ctx);
    const cssFile = cssReturn.find((f) => f.extension === "css")!;

    this.file.content = this.getFileContent(ctx, cssFile?.content);

    return [this.file];
  }

  private getFileContent({ type }: Context, css: string) {
    return `
    <template>
      <i class="svg-icon" :class="name"></i>
    </template>
    <script setup lang="ts">
      import type {${type.name} } from "${this.file.relPathTo(type.file, false)}"

      defineProps<{ name: ${type.name} }>()
    </script>
    <style>
      ${css}
    </style>
    `;
  }
}
