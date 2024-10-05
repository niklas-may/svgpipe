import type { IWriter, WriterReport } from "./writer";

import path from "node:path";
import { existsSync, promises, mkdirSync } from "node:fs";
import * as prettier from "prettier";

export class File implements IWriter {
  ext: string;
  name: string;
  dir: string;
  content: string = "";
  path: string;

  constructor(args: { name: string; ext: string; dir: string; content?: string }) {
    this.ext = args.ext;
    this.name = args.name;
    this.dir = args.dir;
    this.content = args.content ?? "";
    this.path = path.join(this.dir, `${this.name}.${this.ext}`);
  }

  get resolvedDir() {
    return path.resolve(this.dir);
  }

  get resoledPath() {
    return path.join(this.path);
  }

  get basename() {
    return path.basename(this.resoledPath);
  }

  relPathTo(file: File, extension = true) {
    const res = path.relative(this.resolvedDir, file.resoledPath);

    return extension ? res : res.substring(0, res.lastIndexOf("."));
  }

  async write(): Promise<WriterReport<File>> {
    if (!existsSync(this.resolvedDir)) {
      mkdirSync(this.resolvedDir, { recursive: true });
    }

    try {
      await this.prettify();
      await promises.writeFile(this.resoledPath, this.content);

      return {
        status: "success" as const,
        writer: this as File,
      };
    } catch (error) {
      return {
        status: "error" as const,
        message: "Error while writing file",
        detail: error,
        writer: this as File,
      };
    }
  }

  private async prettify() {
    try {
      if (this.ext !== "svg") {
        this.content = await prettier.format(this.content, { filepath: this.resoledPath });
      }
    } catch (error) {}
  }
}
