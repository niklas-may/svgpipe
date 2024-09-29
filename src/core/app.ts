import type { Context } from "./../core/handler";
import type { IFileWriteReport } from "./file";
import type { ModuleConfig, UserConfig } from "./config";

import { kebabCase } from "change-case-all";
import { extname, join, parse, resolve } from "path";
import { optimize } from "svgo";
import { promises, readdirSync, readFileSync, statSync } from "fs";
import { defu } from "defu";
import { TypeHandler } from "../handler/type-handler";
import { TokenHandler } from "../handler/token-handler";
import { createConfig } from "./config";
import { File } from "./file";

export type AppInfo = {
  userConfig: UserConfig;
  config: Record<string, ModuleConfig>;
  fileReports: IFileWriteReport[];
};

export async function runApp(userConfig: UserConfig): Promise<AppInfo> {
  const config = createConfig(userConfig);
  const files: Promise<IFileWriteReport>[] = [];

  for (const [moduleName, module] of Object.entries(config)) {
    const moduleConfig = config[moduleName];
    const handler = module.handler(moduleConfig);

    const handlerContext: Context = {
      type: new TypeHandler(moduleConfig),
      token: new TokenHandler(moduleConfig),
    };

    const paths = getSvgPaths(moduleConfig.in);

    const svgoConfig = moduleConfig.svgo.replace
      ? moduleConfig.svgo.config
      : defu(handler.config, moduleConfig.svgo.config);

    for (const path of paths) {
      const rawSvg = readFileSync(path, "utf-8");
      const { data } = optimize(rawSvg, svgoConfig);
      const name = parse(path).name;

      const svgFile = new File({
        name: kebabCase(moduleConfig.prepareName ? moduleConfig.prepareName(name) : name),
        path: join(moduleConfig.out, "svgs", module.name),
        content: data,
        extension: "svg",
      });

      handlerContext.type.onFile(svgFile);
      handlerContext.token.onFile(svgFile);

      const outFile = handler.onFile ? handler.onFile(svgFile) : undefined;
      if (outFile) files.push(outFile.write());
    }

    files.push(...(handlerContext.type.onEnd(handlerContext)?.map((f) => f.write()) ?? []));
    files.push(...(handlerContext.token.onEnd(handlerContext)?.map((f) => f.write()) ?? []));
    if (handler.onEnd) files.push(...(handler.onEnd(handlerContext)?.map((f) => f.write()) ?? []));
  }

  const fileReports = await Promise.all(files);
  if (userConfig.cleanup !== false) await cleanup(config, fileReports);

  return {
    fileReports,
    config,
    userConfig,
  };
}

function getSvgPaths(dir: string) {
  const res: string[] = [];
  readdirSync(resolve(dir)).map((file) => {
    if (extname(file).toLowerCase() === ".svg") {
      res.push(join(dir, file));
    }
  });
  return res;
}

async function cleanup(config: Record<string, ModuleConfig>, report: IFileWriteReport[]) {
  const delets: Promise<any>[] = [];
  const outPaths = Object.values(config).map((c) => c.out);
  const filePaths = report.map((r) => r.path);

  for (const oP of outPaths) {
    const filePath = await promises.readdir(oP, { recursive: true }).then((fileOrDir) => {
      return fileOrDir.filter((item) => {
        const fullPath = join(oP, item);
        if (statSync(fullPath).isDirectory()) return false;
        return true;
      });
    });

    for (const file of filePath) {
      if (!filePaths.some((f) => f.endsWith(file))) {
        delets.push(promises.unlink(join(oP, file)));
      }
    }
  }

  return Promise.all(delets);
}
