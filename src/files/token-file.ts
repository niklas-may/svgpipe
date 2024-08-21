import { camelCase, kebabCase } from "change-case-all";
import { File } from "../main";
import { IFile, IFileArgs } from "../types";
import { TypeFile } from "./type-file";

interface ITokenFileArgs extends Omit<IFileArgs, "content" | "extension"> {}

export class TokenFile extends File {
  private options: string[] = [];
  private imports: string[] = [];

  tokenName: string;
  tokenType: string = ""

  constructor(args: ITokenFileArgs) {
    super({ content: "", extension: "ts", name: camelCase(`${args.name}Tokens`), path: args.path });

    this.tokenName = camelCase(`${args.name}Tokens`);
  }

  process(file: IFile) {
    if(file instanceof TypeFile){
      this.imports.push(file.getImport(this.path));
      this.tokenType = file.typeName;
      return this
    }
    this.addOption(file);
    return this;
  }

  build() {
    const tokenType = this.tokenType ? `: ${this.tokenType}[]` : "";
    const imports = this.imports.join("\n");
    this.content = `${imports}\n export const ${this.tokenName}${tokenType} = [${this.options.join(", ")}]`;
    return this;
  }

  private addOption(file: IFile) {
    this.options.push(`"${kebabCase(file.name)}"`);
  }
}
