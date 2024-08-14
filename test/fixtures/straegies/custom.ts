import { IFile, IStrategy } from "src/types";

export class MyStrategy implements IStrategy {
  files: IFile[] = [];

  constructor(public options: any) {}

  process(files: IFile[]) {
    this.files = files;
  }
}
