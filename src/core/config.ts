import type { Config as SvgoConfig } from "svgo";
import type { CreateHandler, HandlerName } from "./handler";

import { join } from "path";
import { defaultHandler } from "./handler";

export type UserConfig = {
  baseOut?: string;
  baseIn?: string;
  cleanup?: boolean;
  modules: Record<string, UserModuleConfig | HandlerName>;
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
  handler: CreateHandler | HandlerName;
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

    const outFolder = module.ignoreBase ? (module.out ?? "") : (module.out ?? ".out");
    const outPath = join(basePath, outFolder);

    res[name] = {
      name: name,
      in: inPath,
      out: outPath,
      typePath: module.typePath === "" ? "" : join(module.ignoreBase ? "" : outPath, module.typePath || "/types"),
      tokenPath: module.tokenPath === "" ? "" : join(module.ignoreBase ? "" : outPath, module.tokenPath || "/tokens"),
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
