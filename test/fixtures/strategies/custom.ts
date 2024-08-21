import { IFile, IStrategy, CombinedModuleConfig } from "src/types";
import { File } from "src/main";
import { join } from "path";

export interface MyOptions {
  foo: string;
}
export class MyStrategy implements IStrategy {
  name = "my-strategy";
  options: CombinedModuleConfig<MyOptions>;
  files: IFile[] = [];

  constructor(options: CombinedModuleConfig<MyOptions>) {
    this.options = options;
  }

  process(files: IFile[]) {
    this.files = files;

    const myFile = new File({
      content: "My component content",
      extension: "tsx",
      name: "MyComponent",
      path: join(this.options.baseOutputDir ?? "",  this.options.module.output!)
    });

    this.files.push(myFile);
  }
}