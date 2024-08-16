import type { IFile, IFileArgs } from "../types";

import path from "node:path";
import { existsSync, promises, mkdirSync } from "node:fs";
import * as prettier from "prettier";
import { kebabCase } from "change-case-all";

export class File implements IFile {
  extension: string;
  name: string;
  path: string;
  content: string;

  constructor(args: IFileArgs) {
    this.extension = args.extension;
    this.name = args.name;
    this.path = args.path;
    this.content = args.content;
  }

  get fullPath() {
    return path.resolve(this.path);
  }

  get fullFilePath() {
    return path.join(this.fullPath, `${kebabCase(this.name)}.${this.extension}`);
  }
  get basename() {
    return path.basename(this.fullFilePath);
  }

  async prettify() {
    try {
      if (this.extension !== "svg") {
        this.content = await prettier.format(this.content, { filepath: this.fullFilePath });
      }
    } catch (error) {}
  }

  async write() {
    if (!existsSync(this.fullPath)) {
      mkdirSync(this.fullPath, { recursive: true });
    }

    await this.prettify();

    return promises.writeFile(this.fullFilePath, this.content);
  }
}
