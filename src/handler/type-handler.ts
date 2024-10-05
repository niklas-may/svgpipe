import type { Context, ISvgHandler } from "../core/handler";
import type { IWriter } from "../core/writer";
import type { ModuleConfig } from "../core/config";

import { pascalCase, kebabCase } from "change-case-all";
import { File } from "../core/file";

export class TypeHandler implements ISvgHandler {
  private valuesArr: string[] = [];
  file: File;

  constructor(private readonly mConfig: ModuleConfig) {
    this.file = new File({
      name: kebabCase(this.mConfig.name + "-types"),
      ext: "ts",
      dir: this.mConfig.typePath,
    });
  }

  get name() {
    return pascalCase("Svg " + this.mConfig.name);
  }

  get values() {
    return this.valuesArr.join(" | ");
  }

  onFile(svg: IWriter) {
    this.valuesArr.push(`"${kebabCase(svg.name)}"`);
    return svg;
  }

  onEnd(_: Context) {
    this.file.content = `export type ${this.name} = ${this.values}`;
    return [this.file];
  }
}
