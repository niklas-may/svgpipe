import { camelCase, kebabCase } from "change-case-all";
import { File } from "../main";
import { IFile, IFileArgs } from "../types";

interface ITokenFileArgs extends Omit<IFileArgs, "content" | "extension"> {}

export class TokenFile extends File {
  private options: string[] = [];
  tokenName: string;

  constructor(args: ITokenFileArgs) {
    super({ content: "", extension: "ts", name: camelCase(`${args.name}Tokens`), path: args.path });

    this.tokenName = camelCase(`${args.name}Tokens`);
  }

  process(file: IFile) {
    this.addOption(file);
    return this;
  }

  build() {
    this.content = `export const ${this.tokenName} = [${this.options.join(", ")}]`;
    return this;
  }

  private addOption(file: IFile) {
    this.options.push(`"${kebabCase(file.name)}"`);
  }
}
