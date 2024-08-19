import type { CombinedModuleConfig, ModuleConfigParse, IStrategy, IFile, StrategyConfigEntry } from "../types";

import { kebabCase, pascalCase } from "change-case-all";
import defu from "defu";
import { join, relative } from "node:path";
import { File } from "../core/file";
import { TypeFile } from "src/files/type-file";
import { TokenFile } from "src/files/token-file";

type Options = {
  componentName?: string;
  componentPath?: string;
  typePath?: string;
  tokenPath?: string;
};

export type VueInlineConfig = StrategyConfigEntry<"vue-inline", Options>;

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
    typePath: "./types",
    tokenPath: "",
  },
};

export class VueInlineStrategy implements IStrategy {
  public options: CombinedModuleConfig<Required<Options>>;
  public files: IFile[] = [];

  private imports: string[] = [];
  private components: string[] = [];

  private vueFile: File;
  private typeFile: TypeFile;
  private tokenFile: TokenFile;

  constructor(options: CombinedModuleConfig<Options>) {
    this.options = defu(options, { module: defaultOptions }) as CombinedModuleConfig<Required<Options>>;

    this.vueFile = new File({
      name: this.options.module.strategyConfig.componentName,
      content: "",
      extension: "vue",
      path: join(this.options.baseDir ?? "", this.options.module.strategyConfig.componentPath),
    });

    this.typeFile = new TypeFile({
      name: this.vueFile.name,
      path: join(this.options.baseDir ?? "", this.options.module.strategyConfig.typePath),
    });

    this.tokenFile = new TokenFile({
      name: this.vueFile.name,
      path: join(this.options.baseDir ?? "", this.options.module.strategyConfig.tokenPath ?? ""),
    });
  }

  public process(svgs: IFile[]): void {
    const {typePath, tokenPath } = this.options.module.strategyConfig

    if (typePath) {
      const typeImport = this.typeFile.getImport(this.vueFile.path);
      this.imports.push(typeImport);
    }

    svgs.forEach((svg) => {
      this.typeFile.process(svg);
      this.tokenFile.process(svg);

      this.addImport(svg);
      this.addComponent(svg);

      this.files.push(svg);
    });

    if (typePath) {
      this.typeFile.build();
      this.files.push(this.typeFile);
    }

    if (tokenPath) {
      this.tokenFile.build();
      this.files.push(this.tokenFile);
    }

    this.vueFile.content = this.getVueComponent();
    this.files.push(this.vueFile);
  }

  private getVueComponent() {
    return `
    <template>
      ${this.getComponentString()}
    </template>
    <script setup lang="ts">
    ${this.getImportString()}

   ${this.getDefinePropsStirng()}
    </script>`;
  }

  private addComponent(file: IFile) {
    this.components.push(
      `<${this.getSvgComponentNameString(file)} v-if="name === '${kebabCase(file.name)}'" v-bind="$attrs" />`
    );
  }

  private addImport(file: IFile) {
    const filePath = file.fullFilePath;

    this.imports.push(
      `import ${this.getSvgComponentNameString(file)} from "./${relative(this.vueFile.path, filePath)}?component"`
    );
  }

  private getSvgComponentNameString(file: IFile) {
    return pascalCase(`Svg${pascalCase(file.name)}`);
  }

  private getComponentString() {
    return this.components.join(" \n ");
  }

  private getDefinePropsStirng(): string {
    if (this.options.module.strategyConfig.typePath) {
      return `
      defineProps<{
        name: ${this.typeFile.typeName}
      }>()`;
    }

    return `
    defineProps<{
      name: ${this.typeFile.typeValue}
    }>()`;
  }

  private getImportString() {
    return this.imports.join("\n");
  }
}
