# svgpipe

A flexible wrapper arround svgo for furher SVG processing or to add addtional files. Svgpipe comes with predefined handlers, but it is easy to create your own. For example, build an icon component based on your SVG files.

## Installation

```bash
 npm i --save-dev svgpipe
 pnpm i -D svgpipe
 yarn add -D svgpipe
```

## Usage

```bash
npx svgpipe init
npx svgpipe run
```

### Help

```bash
npx svgpipe --help
```

## Config

```JavaScript
// svgpipe.config.ts
import { defineConfig } from "svgpipe";

export default defineConfig({
  baseOutputDir: "svgpipe", // that's the default
  // You can process multiple folders with svgs (modules) each with its own config
  modules: {
    // Create a module with a predefined handler
    inputFolderName: "css-mask",
    // Or pass options to the predefined handler
    anotherInput: {
      handler: "css-mask"
      svgo: {
        // custom config
        config: {},
        // opt out of the default merge behaviour
        replace: true,
        // print the config to the terminal
        stdout: true
      }
    },
    // Create your own handler
    oneMoreInput: {
      handler: (conf) => ({})
    }
  },
});

```

## Handlers

### Built in

| name           | output                                                                                                       |  note                        |
| :------------- | :----------------------------------------------------------------------------------------------------------- | :--------------------------- |
| `css-mask`     | [view](https://github.com/niklas-may/svgpipe/tree/main/src/handler/__test__/snapshots/css-mask.css.txt)      |                              |
| `vue-css-mask` | [view](https://github.com/niklas-may/svgpipe/tree/main/src/handler/__test__/snapshots/vue-css-mask.vue.txt)  |                              |
| `vue-inline`   | [view](https://github.com/niklas-may/svgpipe/tree/main/src/handler/__test__/snapshots/vue-inline.vue.txt)    | depends on `vite-svg-loader` |

### Create custom handler

Implement a `CreateHandler`. This is a function that recieves ervery processed module config and returns a `ISvgHandler`. This has three properties. `onFile`: Will be called for every processed input svg file. Retrun the file if you want to keep it. `onEnd`: Will be called with the `Context` after all svgs are processed. The `Context` provides a type handler that creates a TypeScript type for the module and a corresponding token handler. The last property is the `SvgoConfig`. This can be modified from the user config.

```TypeScript
import type { CreateHandler } from "svgpipe"

const myHanlder: CreateHandler = (conf) => ({
  config: {
    multipass: true
  },
  onFile: (svgFile) => svgFile,
  onEnd: ctx => []
})
```
