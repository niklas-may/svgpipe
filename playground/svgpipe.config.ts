import { defineConfig } from "../src/core/config";

export default defineConfig({
  baseDir: "playground/.svgpipe",
  modules: [
    {
      input: "./test/fixtures/svgs",
      output: "./playground/svg/logos",
      strategy: "vue-inline",
    },
  ],
});
