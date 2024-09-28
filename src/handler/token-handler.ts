import type { ModuleConfig } from "../core/config";
import type { Context, ISvgHandler } from "../core/handler";
import type { IFile } from "../core/file";

import { kebabCase, camelCase } from "change-case-all";
import { File } from "../core/file";

export class TokenHandler implements ISvgHandler {
  private tokens: string[] = [];
  private file: File;

  constructor(private readonly mConfig: ModuleConfig) {
    this.file = new File({
      name: kebabCase(this.mConfig.name + "-tokens"),
      extension: "ts",
      path: this.mConfig.tokenPath,
    });
  }

  onFile(file: IFile) {
    this.tokens.push(`"${file.name}"`);
    return file;
  }

  onEnd(ctx: Context) {
    this.file.content = this.getContent(ctx);
    return [this.file];
  }

  getContent({ type }: Context) {
    return `
      import type { ${type.name} } from "${this.file.relPathTo(type.file, false)}";
      
      export const ${camelCase(this.mConfig.name + "Tokens")}: ${type.name}[] = [${this.tokens.join(", ")}];
    `;
  }
}
