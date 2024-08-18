import type { CombinedModuleConfig, ModuleConfigParse, IStrategy, IFile, StrategyConfigEntry } from "../types";

import { kebabCase, pascalCase } from "change-case-all";
import defu from "defu";
import { join, relative } from "node:path";
import { File } from "../core/file";
import { camelCase } from "lodash";

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
  public name = "Vue Inline Strategy";
  public options: CombinedModuleConfig<Required<Options>>;
  public files: IFile[] = [];

  private imports: string[] = [];
  private types: string[] = [];
  private components: string[] = [];

  get componentPath() {
    return join(this.options.baseDir ?? "", this.options.module.strategyConfig.componentPath);
  }
  get componentName() {
    return this.options.module.strategyConfig.componentName;
  }
  get typeName() {
    return pascalCase(`${this.componentName}Props`);
  }

  constructor(options: CombinedModuleConfig<Options>) {
    this.options = defu(options, { module: defaultOptions }) as CombinedModuleConfig<Required<Options>>;
  }

  public process(svgs: IFile[]): void {
    const vueFile = new File({
      name: this.options.module.strategyConfig.componentName,
      content: "",
      extension: "vue",
      path: join(this.options.baseDir ?? "", this.options.module.strategyConfig.componentPath),
    });

    const typeFile = new File({
      name: this.typeName,
      content: "",
      extension: "ts",
      path: join(this.options.baseDir ?? "", this.options.module.strategyConfig.typePath),
    });

    if (this.options.module.strategyConfig.typePath) {
      this.addTypeImport(typeFile);
    }

    svgs.forEach((svg) => {
      this.addImport(svg);
      this.addType(svg);
      this.addComponent(svg);
      this.files.push(svg);
    });

    vueFile.content = this.getVueComponent();

    if (this.options.module.strategyConfig.typePath) {
      typeFile.content = this.getTypeFileContent();

      this.files.push(typeFile);
    }

    if (this.options.module.strategyConfig.tokenPath) {
      const tokenFile = new File({
        name: camelCase(`${this.componentName}Tokens`),
        path: join(this.options.baseDir ?? "", this.options.module.strategyConfig.tokenPath),
        extension: "ts",
        content: this.getTokenString(),
      });
      this.files.push(tokenFile);
    }
    this.files.push(vueFile);
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

  private getTypeFileContent() {
    return `export type ${this.typeName} = ${this.types.join(" | ")}`;
  }

  private addComponent(file: IFile) {
    this.components.push(
      `<${this.getSvgComponentNameString(file)} v-if="name === '${kebabCase(file.name)}'" v-bind="$attrs" />`
    );
  }

  private addType(file: IFile) {
    this.types.push(`"${kebabCase(file.name)}"`);
  }

  private addImport(file: IFile) {
    const filePath = file.fullFilePath;

    this.imports.push(
      `import ${this.getSvgComponentNameString(file)} from "${relative(this.componentPath, filePath)}?component"`
    );
  }

  private addTypeImport(file: IFile) {
    const filePath = file.fullFilePath;
    this.imports.push(`import { type ${this.typeName}} from "${relative(this.componentPath, filePath)}"\n`);
  }

  private getSvgComponentNameString(file: IFile) {
    return pascalCase(`Svg${pascalCase(file.name)}`);
  }

  private getComponentString() {
    return this.components.join(" \n ");
  }

  private getDefinePropsStirng(): string {
    const typeOptions = this.types.join(" | ");
    if (this.options.module.strategyConfig.typePath) {
      return `
      defineProps<{
        name: ${this.typeName}
      }>()`;
    }

    return `
    defineProps<{
      name: ${typeOptions}
    }>()`;
  }

  private getImportString() {
    return this.imports.join("\n");
  }

  private getTokenString() {
    return `export const ${pascalCase(`${this.componentName}Tokens`)} = [ ${this.types.join(", ")}]`;
  }
}
