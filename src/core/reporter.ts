import type { AppInfo } from "./app";
import type { WriterReport } from "./writer";

import { createConsola} from "consola";

export function report({ fileReports, config }: AppInfo) {
  let logger = createConsola({ fancy: true }).withTag("SvgPipe");
  let success = 0;
  const errors: WriterReport[] = [];

  for (const file of fileReports) {
    
    if (file.status === "success") {
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
