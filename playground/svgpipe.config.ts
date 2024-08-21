import { defineConfig } from "../src/core/config";

export default defineConfig({
  baseOutputDir: "playground/.svgpipe/output",
  baseInputDir: "playground/.svgpipe/input",
  modules: [
    {
      input: "/icons",
      output: "/svg/icons",
      strategy: ["vue-inline", {tokenPath: "tokens",}],
      
    },
  ],
});
