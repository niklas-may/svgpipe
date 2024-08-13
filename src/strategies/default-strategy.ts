import type { CombinedModuleConfig, IStrategy, IFile } from "src/types";

export class DefaultStrategy implements IStrategy {
  files: IFile[] = [];
  constructor(options: CombinedModuleConfig<any>) {}

  public process(files: IFile[]): void {
    this.files = files;
  }
}
