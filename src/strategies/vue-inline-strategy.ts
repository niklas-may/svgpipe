import type { CombinedModuleConfig, ModuleConfigParse, IStrategy, IFile, StrategyConfigEntry } from "../types";

import { kebabCase, pascalCase } from "change-case-all";
import defu from "defu";
import { join, relative } from "node:path";
import { File } from "../core/file";

type Options = {
  componentName: string;
  componentPath: string;
};

export type VueInlineConfig = StrategyConfigEntry<"vue-inline", { componentName: string; componentPath: string }>;

const defaultOptions: ModuleConfigParse<Options> = {
  svgo: {
    multipass: true,
    plugins: [
      "removeDimensions",
      "sortAttrs",
      "removeTitle",
      "cleanupIds",
      {
        name: "convertColors",
        params: {
          currentColor: true,
        },
      },
    ],
  },
  strategyConfig: {
    componentName: "BaseIcon",
    componentPath: "./components",
  },
};

export class VueInlineStrategy implements IStrategy {
  public name = "Vue Inline Strategy";
  public options: CombinedModuleConfig<Options>;
  public files: IFile[] = [];

  private imports: string[] = [];
  private types: string[] = [];
  private components: string[] = [];

  constructor(options: CombinedModuleConfig<Options>) {
    this.options = defu(options, { module: defaultOptions });
  }

  public process(svgs: IFile[]): void {
    svgs.forEach((svg) => {
      this.addImport(svg);
      this.addType(svg);
      this.addComponent(svg);
      this.files.push(svg);
    });
    const vueFile = new File({
      name: this.options.module.strategyConfig.componentName,
      content: this.getVueComponent(),
      extension: "vue",
      path: join(this.options.baseDir ?? "", this.options.module.strategyConfig.componentPath),
    });
    this.files.push(vueFile);
  }

  private getVueComponent() {
    return `
    <template>
      ${this.getComponentString()}
    </template>
    <script setup lang="ts">
    ${this.getImportString()}

    defineProps<{
      name: ${this.getTypeString()}
    }>()
    </script>`;
  }

  private addComponent(file: IFile) {
    this.components.push(`<${this.getComponentNameString(file)} v-if="name === '${kebabCase(file.name)}'" v-bind="$attrs" />`);
  }

  private addType(file: IFile) {
    this.types.push(`"${kebabCase(file.name)}"`);
  }

  private addImport(file: IFile) {
    const componentPath = join(this.options.baseDir ?? "", this.options.module.strategyConfig.componentPath)
    const filePath =  file.fullFilePath
    this.imports.push(
      `import ${this.getComponentNameString(file)} from "${relative(componentPath, filePath)}?component"`
    );
  }

  private getComponentNameString(file: IFile) {
    return pascalCase(`Svg${pascalCase(file.name)}`);
  }

  private getComponentString() {
    return this.components.join(" \n ");
  }

  private getTypeString() {
    return this.types.join(" | ");
  }

  private getImportString() {
    return this.imports.join("\n");
  }
}
