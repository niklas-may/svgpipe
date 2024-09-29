# Svgpipe

A flexible wrapper arround SVGO to postprocess optimized SVGs. Svgpipe comes with predefined handlers that can be used to create a typed icon-component or similar. But it is easy to create a custom handler.

## Installation

```bash
 npm i --save-dev svgpipe
 pnpm add -D svgpipe
 yarn add -D svgpipe
```

## Usage

Create a config file and a folder scaffold.

```bash
npx svgpipe init
```

Drop your SVGs in `./svgpipe/in/<yourFolder>` and update the config.

```JavaScript
// svgpipe.config.ts
import { defineConfig } from "svgpipe";

export Default defineConfig({
  modules: {
    // load SVGs from "./svgpipe/in/icon and process with 'css-mask' handler"
    icon: "css-mask",
    // load SVGs from "./svgpipe/in/logo" and apply custom handler
    logo: {
      handler: (conf) => ({})
    }
  },
});

```

Process SVGs and create files.

```bash
npx svgpipe run
```

## Built-in Handlers

| Name           | Output                                                                                                       |  Note                         |
| :------------- | :----------------------------------------------------------------------------------------------------------- | :---------------------------- |
| `css-mask`     | [View](https://github.com/niklas-may/svgpipe/tree/main/src/handler/__test__/snapshots/css-mask.css.txt)      |                               |
| `vue-css-mask` | [View](https://github.com/niklas-may/svgpipe/tree/main/src/handler/__test__/snapshots/vue-css-mask.vue.txt)  |                               |
| `vue-inline`   | [View](https://github.com/niklas-may/svgpipe/tree/main/src/handler/__test__/snapshots/vue-inline.vue.txt)    | Depends on `vite-svg-loader`. |

## Options

| Property   | Type                                | Default        | Description                                                                |
| :--------- | :---------------------------------- | :------------- | -------------------------------------------------------------------------- |
| `baseIn`?  | `string`                            | ./svgpipe/in   | Root folder to find the input SVGs.                                        |
| `baseOut`? | `string`                            | ./svgpipe/.out | Root folder for all output files.                                          |
| `cleanup`  | `boolean`                           | true           | Delete files in the output folders that where not part of the current run. |
| `modules`  | `UserModuleConfig` or `HandlerName` |                | Config for one set of SVGs. See Handlers.                                  |

### Module

| Property       | Type                       | Default                      |  Description                                                                                    |
| :------------- | :------------------------- | :--------------------------- | :---------------------------------------------------------------------------------------------- |
| `in`?          | `string`                   | {baseIn}/{objectKeyOfModule} | Folder where the SVGs for this module are. If undefined, the module key will be used.           |
| `out`?         | `string`                   | {baseOut}                    | Folder for ouput.                                                                               |
| `typePath`?    | `string`                   | {baseOut}/types              | Folder for the TypeScript type file. This has a type with all the SVG names as string literals. |
| `tokenPath`?   | `string`                   | {baseOut}/token              | Folder for the TypeScript token file. This has a variable with an array with all SVG names.     |
| `ignoreBase`?  | `boolean`                  | false                        | Don't prepend the base path.                                                                    |
| `prepareName`? | `(str: string) => string`  |                              | Modify the SVG file name. The name will be used for types, classes e.g.                         |
| `handler`      | `CreateHandler`            |                              | The actual SVG handle.                                                                          |
| `svgo`?        | `UserModuleConfig["svgo"]` | {}                           | SVGO Options.                                                                                   |

#### SVGO

| Property   | Type         | Default | Description                        |
| :--------- | :----------- | :------ | :--------------------------------- |
| `config`?  | `SvgoConfig` | {}      | SVGO Config.                       |
| `replace`? | `boolean`    | false   | Opt out of default config merging. |
| `stdout`?  | `boolean`    | false   | Print the config to the console.   |

## Custom Handler

```TypeScript
import { type CreateHandler, File } from "svgpipe"

const myHanlder: CreateHandler = (moduleConfig) => ({
  onFile: (svgFile) => {
    // Do what ever you want. Return the file to keep it.
    return svgFile
  },
  onEnd: (context) => {
    // Do cleanup work or create addtional files
    const myFile = new File()
    return [myFile]
  }
  config: {
    multipass: true
  },
})
```

Implement a `CreateHandler`. This is a function that recieves every processed module config and returns a `ISvgHandler`.

### `onFile`

Will be called for every processed input svg file. Retrun the file if you want to keep it.

### `onEnd`

Will be called with the `Context` after all SVGs are processed. Return nothing or `IFile[]` with additional files that you want to write to disk. `Context` provides a type handler that creates a TypeScript type file for the module and a corresponding token handler.

### `config`

The default SVGO config that should be used. This can be modified from the user config.

All built-in handlers are exported in case you want to extend one.
