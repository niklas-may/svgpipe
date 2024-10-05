import type { Config as SvgoConfig } from "svgo";
import type { ModuleConfig } from "../core/config";
import type { ISvgHandler } from "../core/handler";
import type { Context } from "../core/handler";

import { join } from "path";
import { pascalCase, kebabCase } from "change-case-all";
import { File } from "../core/file";
import { uniqueId } from "lodash";

export class VueInlineHandler implements ISvgHandler {
  private components: string[] = [];
  private imports: string[] = [];
  private file;

  config: SvgoConfig = {
    multipass: true,
    plugins: [
      "removeDimensions",
      "sortAttrs",
      "removeTitle",
      "cleanupIds",
      { name: "prefixIds", params: { prefix: () => uniqueId() } },
      {
        name: "convertColors",
        params: {
          currentColor: true,
        },
      },
    ],
  };

  constructor(private readonly mConfig: ModuleConfig) {
    this.file = new File({
      name: pascalCase("Svg " + this.mConfig.name),
      ext: "vue",
      dir: join(this.mConfig.out, "components"),
    });
  }

  onFile(svg: File) {
    const name = pascalCase("Svg " + svg.name);
    const type = kebabCase(svg.name);

    this.imports.push(`import ${name} from "${this.file.relPathTo(svg)}?component"\n`);
    this.components.push(`<${name} v-if="name === '${type}'" v-bind="$attrs" />\n`);

    return svg;
  }

  onEnd(ctx: Context) {
    this.file.content = this.getFileContent(ctx);

    return [this.file];
  }

  private getFileContent({ type }: Context) {
    return `
    <template>
      ${this.components.join("")} 
    </template>
    <script setup lang="ts">
      import type {${type.name} } from "${this.file.relPathTo(type.file, false)}"

      ${this.imports.join("")}

      defineProps<{ name: ${type.name} }>()
    </script>
    `;
  }
}
