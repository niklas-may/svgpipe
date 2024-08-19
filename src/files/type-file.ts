import { kebabCase, pascalCase } from "change-case-all";
import { relative } from "path";
import { File } from "../main";
import { IFile, IFileArgs } from "../types";

interface ITypeFileArgs extends Omit<IFileArgs, "content" | "extension"> {}

export class TypeFile extends File {
  private options: string[] = [];
  typeName: string;

  get typeValue() {
    return this.options.join(" | ");
  }

  constructor(args: ITypeFileArgs) {
    super({ content: "", extension: "ts", name: `${args.name}Props`, path: args.path });

    this.typeName = pascalCase(`${args.name}Props`);
  }

  process(file: IFile) {
    this.addOption(file);
    return this;
  }

  build() {
    this.content = `export type ${this.typeName} = ${this.typeValue}`;
    return this;
  }

  getImport(filePath: string) {
    return `import { type ${this.typeName}} from "./${relative(filePath, this.fullFilePath)}"\n`;
  }

  private addOption(file: IFile) {
    this.options.push(`"${kebabCase(file.name)}"`);
  }
}
