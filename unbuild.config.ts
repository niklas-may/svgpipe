import path from "path";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    {
      input: "./src/main",
      declaration: true,
    },
    { input: "./src/cli", declaration: false },
  ],
  rollup: {
    emitCJS: true,
  },
});
