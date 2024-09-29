import type { AppInfo } from "./app";
import type { IFileWriteReport } from "./file";

import { createConsola} from "consola";
import { FileWriteStatus } from "./file";

export function report({ fileReports, config }: AppInfo) {
  let logger = createConsola({ fancy: true }).withTag("SvgPipe");
  let success = 0;
  const errors: IFileWriteReport[] = [];

  for (const file of fileReports) {
    
    if (file.status === FileWriteStatus.success) {
      success++;
    } else {
      errors.push(file);
    }
  }
  logger.success(`Successfully created ${success} files`);
  if (errors.length > 0) {
    for (const error of errors) {
      logger.error(error.message);
      logger.error(error.detail);
    }
  }

  for (const [moduleName, module] of Object.entries(config)) {
    if (module.svgo.stdout) {
      logger.info(`Svgo config for "${moduleName}"`);
      logger.info(JSON.stringify(module.svgo.config, null, 2));
    }
  }
}
