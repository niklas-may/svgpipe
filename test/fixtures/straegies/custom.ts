import { IFile, IStrategy, CombinedModuleConfig } from "src/types";
import { File } from "src/main";

export interface MyOptions {
  foo: string;
}
export class MyStrategy implements IStrategy {
  name = "my-strategy";
  options: CombinedModuleConfig<MyOptions>;
  files: IFile[] = [];

  constructor(options: CombinedModuleConfig<MyOptions>) {
    // Optional: apply default to options
    this.options = options;
  }

  process(files: IFile[]) {
    // Optional: Do something with the files
    this.files = files;

    // Optional: Add a new file
    const myFile = new File({
      content: "My component content",
      extension: "tsx",
      name: "MyComponent",
      path: this.options.module.output!,
    });

    this.files.push(myFile);
  }
}
