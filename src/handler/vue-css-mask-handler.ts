import type { Config as SvgoConfig } from "svgo";
import type { ModuleConfig } from "../core/config";
import type { ISvgHandler } from "../core/handler";
import type { Context } from "../core/handler";

import { join } from "path";
import { pascalCase } from "change-case-all";
import { File } from "../core/file";
import { CssMaskHandler } from "./css-mask-handler";

export class VueCssMaskHandler implements ISvgHandler {
  private file;
  private cssMaskHandler: CssMaskHandler;
  config: SvgoConfig;

  constructor(private readonly mConfig: ModuleConfig) {
    this.cssMaskHandler = new CssMaskHandler(mConfig);
    this.config = this.cssMaskHandler.config;

    this.file = new File({
      name: pascalCase("Svg " + this.mConfig.name),
      ext: "vue",
      dir: join(this.mConfig.out, "components"),
    });
  }

  onFile(svg: File) {
    this.cssMaskHandler.onFile(svg);
  }

  onEnd(ctx: Context) {
    const cssReturn = this.cssMaskHandler.onEnd(ctx);
    const cssFile = cssReturn.find((f) => f.ext === "css")!;

    this.file.content = this.getFileContent(ctx, cssFile?.content);

    return [this.file];
  }

  private getFileContent({ type }: Context, css: string) {
    return `
    <template>
      <i class="svg-${this.mConfig.name}" :class="\`-svg-${this.mConfig.name}-\${name}\`"></i>
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
