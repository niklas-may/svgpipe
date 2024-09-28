import type { Config as SvgoConfig } from "svgo";
import type { CreateHandler, DefaultHandlerName } from "./handler";

import { join } from "path";
import { defaultHandler } from "./handler";

export type UserConfig = {
  baseOut?: string;
  baseIn?: string;
  modules: Record<string, UserModuleConfig | DefaultHandlerName>;
};

export type UserModuleConfig = {
  in?: string;
  out?: string;
  typePath?: string;
  tokenPath?: string;
  ignoreBase?: boolean;
  svgo?: {
    config?: SvgoConfig;
    replace?: boolean;
    stdout?: boolean;
  };
  prepareName?: (name: string) => string;
  handler: CreateHandler | DefaultHandlerName;
};

export type ModuleConfig = {
  name: string;
  in: string;
  out: string;
  typePath: string;
  tokenPath: string;
  ignoreBase: boolean;
  svgo: {
    config: SvgoConfig;
    replace: boolean;
    stdout?: boolean;
  };
  prepareName?: (name: string) => string;
  handler: CreateHandler;
};

export function createConfig(config: UserConfig): Record<string, ModuleConfig> {
  const res: Record<string, ModuleConfig> = {};

  for (const [name, maybeModule] of Object.entries(config.modules)) {
    const module = getModule(maybeModule);

    const basePath = module.ignoreBase ? "" : (config.baseOut ?? "svgpipe");
    const inPath = join(basePath, module.in || `in/${name}`);

    const outFolder = module.ignoreBase ? "" : ".out";
    const outPath = join(basePath, outFolder);

    res[name] = {
      name: name,
      in: inPath,
      out: outPath,
      typePath: join(outPath, module.typePath || "/types"),
      tokenPath: join(outPath, module.tokenPath || "/tokens"),
      ignoreBase: !!module.ignoreBase,
      svgo: {
        config: module.svgo?.config ?? {},
        replace: module.svgo?.replace ?? false,
      },
      handler: module.handler,
      prepareName: module.prepareName,
    };
  }
  return res;
}

export function defineConfig(config: UserConfig): UserConfig {
  return config;
}

function getModule(maybeModule: UserModuleConfig | string): ModuleConfig {
  const userModule = typeof maybeModule === "string" ? { handler: maybeModule } : maybeModule;
  const config = { ...userModule } as ModuleConfig;

  if (typeof userModule.handler === "string" && userModule.handler in defaultHandler) {
    config.handler = defaultHandler[userModule.handler as keyof typeof defaultHandler];
    return config;
  }

  config.handler = userModule.handler as CreateHandler;
  return config;
}
