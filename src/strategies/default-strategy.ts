import type { CombinedModuleConfig, IStrategy, IFile } from "../types";

export class DefaultStrategy implements IStrategy {
  name = "Default Strategy";

  files: IFile[] = [];
  constructor(public options: CombinedModuleConfig<any>) {}

  public process(files: IFile[]): void {
    this.files = files;
  }
}
