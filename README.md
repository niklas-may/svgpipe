# svgpipe

A flexible wrapper arround svgo for furher SVG processing or to add addtional files. Svgpipe comes with predefined strategies, but it is easy to create your own. For example, build an icon component based on your SVG files.

## Installation

```bash
 npm i --save-dev svgpipe
 pnpm i -D svgpipe
 yarn add -D svgpipe
```

## Usage

```bash
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
  baseDir: ".svgpipe", // that's the default
  modules: [
    {
      input: "./assets/svgs/logos",
      output: "output/svgs/logos", // relative to the base dir
      strategy: "vue-inline", // use builtin strategy with no options
    },
    {
      input: "./assets/svgs/icons",
      output: "output/svg/icons",
      svgo: {
        multipass: true, // optionally change svgo options
      },
      strategy: [
        "vue-inline", // Array syntax to pass options to the strategy
        {
          componentName: "BaseIcon",
          componentPath: "./components",
        },
      ],
    },
    {
      input: "./assets/svgs/",
      output: "output/svg/graphics",
      strategy: [MyCustomStrategy, {}], // Add your own strategy as a class
    },
  ],
});

```

## Strategies

### Build in

#### `vue-inline`

Creates a vue component that imports all SVGs

**Example**

```Vue
<template>
  <SvgZoomIn v-if="name === 'zoom-in'" />
  <SvgZoomOut v-if="name === 'zoom-out'" />
</template>
<script setup lang="ts">
import SvgZoomIn from "../svg/logos/zoom-in.svg?component";
import SvgZoomOut from "../svg/logos/zoom-out.svg?component";

defineProps<{
  name:
    | "zoom-in"
    | "zoom-out";
}>();
</script>
```

This components depends on `vite-svg-loader`

**Options**

| prop          | default      |
| :------------ | :----------- |
| componentName | "BaseIcon"   |
| componentPath | "components" |

#### `default`
Just outputs the processed SVGs.

### Create custom

- A strategy provides options to svgo via the `options` property. The user options are passed into the constructor.
- A strategy receives all processed SVG files as an argument in the `process` method
- A strategy provides all files that will be written to disk via the `files` property

```TypeScript
import type { IFile, IStrategy, CombinedModuleConfig } from "svgpipe";
import { File } from "svgpipe";

export interface MyOptions {
  foo: string;
}

export class MyStrategy implements IStrategy {
  name = "my-strategy";
  options: CombinedModuleConfig<MyOptions>;
  files: IFile[] = [];

  constructor(options: CombinedModuleConfig<MyOptions>) {
    // Optional: apply default to options
    this.options = options;
  }

  process(files: IFile[]) {
    // Optional: Do something with the files or just add them to the files array
    this.files = files;

    // Optional: Add a new file
    const myFile = new File({
      content: "My component content",
      extension: "tsx",
      name: "MyComponent",
      path: this.options.module.output!,
    });

    this.files.push(myFile);
  }
}
```
