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
  // You can process multiple folders (moduls) with svgs each with its own config
  modules: {
    // Create a module with a predefined handler
    inputFolderName: "vue-inline",
    // Or pass options to the predefined handler
    anotherInput: {
      handler: "vue-inline"
      svgo: {
        // custom config
        config: {},
        // opt out of the default merging behaviour
        replace: true,
        // print the config o the terminal
        stdout: true
      }
    },
    // Create your own handler
    oneMoreInput: {
      handler: (conf) => ({
        onFile(svgFile){
          // do your thing with with every svgo processed file
          // return it if you want to keep it
          return svgFile
        }
        onEnd(ctx) {
          // cleanup or create custom files like a css file
          // return [customFile]
        }
      })
    }
  },
});

```

## Handlers 

### Built in

#### `vue-inline`

Creates a vue component that imports all SVGs. This components depends on `vite-svg-loader`.

[Example output](https://github.com/niklas-may/svgpipe/tree/main/src/handler/__snapshots__/component.vue.txt)

### Create custom handler
Imlement a `CreateHandler`. This is a function that recieves ervery processed module config and returns a `ISvgHandler`. This has three properties. `onFile`: Will be called for every processed input svg file. Retrun the file if you want to keep it. `onEnd`: Will be called with the `Context` after all svgs are processed. The `Context` provides a type handler that creates a TypeScript type for the module and a corresponding token handler. 


```TypeScript
import type { CreateHandler } from "svgpipe"

const myHanlder: CreateHandler = (conf) => ({})
```
