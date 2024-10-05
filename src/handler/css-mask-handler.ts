import type { Config as SvgoConfig } from "svgo";
import type { ModuleConfig } from "../core/config";
import type { ISvgHandler } from "../core/handler";
import type { Context } from "../core/handler";

import { join } from "path";
import { pascalCase, kebabCase } from "change-case-all";
import { File } from "../core/file";
import { uniqueId } from "lodash";

export class CssMaskHandler implements ISvgHandler {
  private vars: { var:string, url: string; class: string }[] = [];
  private file: File;

  get className() {
    return kebabCase(`svg-${this.mConfig.name}`);
  }

  config: SvgoConfig = {
    multipass: true,
    plugins: [
      "removeDimensions",
      "sortAttrs",
      "removeTitle",
      "cleanupIds",
      { name: "prefixIds", params: { prefix: () => uniqueId() } },
      {
        name: "convertColors",
        params: {
          currentColor: true,
        },
      },
    ],
  };

  constructor(private readonly mConfig: ModuleConfig) {
    this.file = new File({
      name: pascalCase("svg " + this.mConfig.name),
      ext: "css",
      dir: join(this.mConfig.out, "css"),
    });
  }

  onFile(svg: File) {
    const name = kebabCase(`svg-${this.mConfig.name} ${svg.name}`);
    this.vars.push({
      var: `--${name}`,
      url: `url("data:image/svg+xml;utf8,${this.encodeSvg(svg.content)}")`,
      class: `-${name}`,
    });
  }

  onEnd(_: Context) {
    this.file.content = this.getFileContent();

    return [this.file];
  }

  private getFileContent() {
    return `
      .${this.className} {
        --size: 1em;

        display: inline-block;
        mask-size: 100% 100%;
        background-color: currentColor;
        height: var(--size);
        width: var(--size);
        min-height: var(--size);
        min-width: var(--size);
        vertical-align: middle;
      }

      ${this.vars.map((v) => this.getSvgDeclaration(v)).join("\n")}

      :root {
        ${this.vars.map((v) => this.getVarDeclaration(v)).join(";\n")}
      }
    `;
  }

  private getSvgDeclaration(item: (typeof this.vars)[number]) {
    return `
    .${this.className}.${item.class} {
      mask-image: var(${item.var});
    }
    `;
  }

  private getVarDeclaration(item: (typeof this.vars)[number]) {
    return `${item.var}: ${item.url}`;
  }

  private encodeSvg(svg: string) {
    return svg
      .replace("<svg", ~svg.indexOf("xmlns") ? "<svg" : '<svg xmlns="http://www.w3.org/2000/svg"')
      .replace(/"/g, "'")
      .replace(/%/g, "%25")
      .replace(/#/g, "%23")
      .replace(/{/g, "%7B")
      .replace(/}/g, "%7D")
      .replace(/</g, "%3C")
      .replace(/>/g, "%3E");
  }
}
