# Alluvial-Editor

这是一个基于 milkdown（unifed+Prosemirror）的 WYSIWYG 编辑器。感谢 Typora。

## give it a whirl（试一下）

```sh
pnpm install
pnpm run build

# http://localhost:3000
```

## use as a lib（作为一个库使用）

打包器需要支持 css-module

比如 `esbuild` 就需要安装 `esbuild-sass-plugin postcss postcss-modules` 然后在 esbuild.mjs 中添加插件：

```js
import { sassPlugin, postcssModules } from "esbuild-sass-plugin";

let ctx = await esbuild.context({
  ...
  plugins: [
    sassPlugin({
      filter: /\.module\.scss$/,
      transform: postcssModules({
        generateScopedName: "[local]"
        // plugins: [autoprefixer],
      }),
    }),
    sassPlugin({
      filter: /\.scss$/,
    }),
  ],
  ...
});
```
