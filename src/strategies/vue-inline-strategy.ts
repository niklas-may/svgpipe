import type { CombinedModuleConfig, IStrategy, IFile } from "src/types";
import { kebabCase, pascalCase } from "change-case";
import defu from "defu";
import { File } from "src/core/file";
import { relative } from "path";

type Name = "vue-inline";
type Options = {
  componentName: string;
  componentPath: string;
};
export type VueInlineConfig = Name | [Name, Options];

export class VueInlineStrategy implements IStrategy {
  public files: IFile[] = [];

  private options: CombinedModuleConfig<Options>;
  private imports: string[] = [];
  private types: string[] = [];
  private components: string[] = [];

  constructor(options: CombinedModuleConfig<Options>) {
    const defaultOptions: Options = {
      componentName: "BaseIcon",
      componentPath: "./components/base",
    };
    this.options = defu(options, { strategy: defaultOptions });
  }

  public process(files: IFile[]): void {
    files.forEach((file) => {
      this.addImport(file);
      this.addType(file);
      this.addComponent(file);
      this.files.push(file);
    });
    const vueFile = new File({
      name: this.options.strategy.componentName,
      content: this.getVueComponent(),
      extension: "vue",
      path: this.options.strategy.componentPath,
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
    </script>


    `;
  }

  private addComponent(file: IFile) {
    this.components.push(`<${this.getComponentNameString(file)} v-if="name === '${kebabCase(file.name)}'" />`);
  }

  private addType(file: IFile) {
    this.types.push(`"${kebabCase(file.name)}"`);
  }

  private addImport(file: IFile) {
    this.imports.push(
      `import ${this.getComponentNameString(file)} from "${relative(this.options.strategy.componentPath, file.fullFilePath)}?component"`
    );
  }

  private getComponentNameString(file: IFile) {
    return pascalCase(`Svg${pascalCase(file.name)}`)
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
