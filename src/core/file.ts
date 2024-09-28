import path from "node:path";
import { existsSync, promises, mkdirSync } from "node:fs";
import * as prettier from "prettier";

export interface IFileArgs {
  extension: string;
  name: string;
  path: string;
  content?: string;
}

export interface IFile extends IFileArgs {
  fullPath: string;
  fullFilePath: string;
  write: () => Promise<IFileWriteReport>;
}

export interface IFileWriteReport {
  status: FileWriteStatus;
  path: string;
  message?: string;
  detail?: unknown;
  file: IFile;
}

export enum FileWriteStatus {
  "success",
  "error",
}

export class File implements IFile {
  extension: string;
  name: string;
  path: string;
  content: string = "";

  constructor(args: IFileArgs) {
    this.extension = args.extension;
    this.name = args.name;
    this.path = args.path;
    this.content = args.content ?? "";
  }

  get fullPath() {
    return path.resolve(this.path);
  }

  get fullFilePath() {
    return path.join(this.fullPath, `${this.name}.${this.extension}`);
  }

  get basename() {
    return path.basename(this.fullFilePath);
  }

  relPathTo(file: File, extension = true) {
    const res = path.relative(this.fullPath, file.fullFilePath);

    return extension ? res : res.substring(0, res.lastIndexOf("."));
  }

  async write() {
    if (!existsSync(this.fullPath)) {
      mkdirSync(this.fullPath, { recursive: true });
    }

    try {
      await this.prettify();
      await promises.writeFile(this.fullFilePath, this.content);

      return {
        status: FileWriteStatus.success,
        path: this.fullFilePath,
        file: this as File,
      };
    } catch (error) {
      return {
        status: FileWriteStatus.error,
        path: this.fullFilePath,
        message: "Error while writing file",
        detail: error,
        file: this as File,
      };
    }
  }

  private async prettify() {
    try {
      if (this.extension !== "svg") {
        this.content = await prettier.format(this.content, { filepath: this.fullFilePath });
      }
    } catch (error) {}
  }
}
