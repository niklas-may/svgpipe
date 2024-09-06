import type { CombinedModuleConfig, ModuleConfigParse, IStrategy, IFile, StrategyConfigEntry } from "../types";

import { kebabCase, pascalCase } from "change-case-all";
import defu from "defu";
import { join, relative } from "node:path";
import { File } from "../core/file";
import { TypeFile } from "../files/type-file";
import { TokenFile } from "../files/token-file";

type Options = {
  componentName: string;
  componentPath: string;
  typePath: string;
  tokenPath: string;
};

export type VueMaskImageConfig = StrategyConfigEntry<"vue-inline", Options>;

export class VueFiles {
  tokenFile: TokenFile;
  typeFile: TypeFile;
  vueFile: File;

  get files() {
    return [this.vueFile, this.typeFile, this.tokenFile];
  }

  constructor(public options: Options) {
    this.vueFile = new File({
      name: this.options.componentName,
      content: "",
      extension: "vue",
      path: this.options.componentPath,
    });

    this.typeFile = new TypeFile({
      name: this.vueFile.name,
      path: this.options.typePath,
    });

    this.tokenFile = new TokenFile({
      name: this.vueFile.name,
      path: this.options.tokenPath,
    });
  }

  public process(svg: IFile) {
    this.typeFile.process(svg);
    this.tokenFile.process(svg);
  }
}
