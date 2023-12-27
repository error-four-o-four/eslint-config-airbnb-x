# eslint-config-airbnb-flat

Unofficial migration of the airbnb styleguide from eslintrc format to [flat config ](https://eslint.org/docs/latest/use/configure/configuration-files-new) file format.

## Setup

### Install

```
npm i -D eslint-config-airbnb-flat
```

### Configure

#### Base Example:

With [`"type": "module"`](https://nodejs.org/api/packages.html#type) in `package.json` (recommended):

```js
import defineConfig from 'eslint-config-airbnb-flat/base';

export default defineConfig({
	files: ['path/**/*.js'],
	rules: {
		// add custom rules
	},
});
```

The default export is a function which accepts custom overrides and returns an optimized version of the [eslint-config-airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) config.
* All [deprecated rules](./legacy.json) are disabled.
* [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import) was replaced by [eslint-plugin-i](https://github.com/un-es/eslint-plugin-i)
* [eslint-import-resolver-typescript](https://www.npmjs.com/package/eslint-import-resolver-typescript) is used by default to support ['imports' and 'exports' fields in package.json](https://github.com/import-js/eslint-plugin-import/issues/1868)
 * [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n) and [eslint-stylistic](https://github.com/eslint-stylistic/eslint-stylistic) were added.
 * [typescript](https://www.typescriptlang.org/) is auto-detected and works out-of-box (heavily inspired by [Anthony Fu](https://github.com/antfu)s [config](https://github.com/antfu/eslint-config/tree/main)).


### Customize

If you want to override one of the rules of the added plugins, make sure to use the corresponding prefix:

 | Original Prefix        | New prefix 			|
 | ---------------------- | --------------- |
 | `i/*`                  | `import/*`			|
 | `n/*`                  | `node/*`				|
 | `@typescript-eslint/*` | `typescript/*`	|
 | `@stylistic/*`         | `stylistic/*`		|

You can also use only specific configuration files:

```js
import pluginNode from 'eslint-plugin-n';
import { node as configNode } from 'eslint-config-airbnb-flat/configs';

configNode.plugins = {
	node: pluginNode ,
}

export default [
	configNode
];
```

#### Plain Compat

These are just the plain, unomptimized converted configs (use them at your own risk).

```js
import airbnb from 'eslint-config-airbnb-flat/compat';

console.log(Object.keys(configs));
```

### Roadmap

- 🔳 bundle (with ~~rollup~~ esbuild (to esm))
- 🔳 convert (whole) codebase to typescript
- 🔳 ~~export~~ create type declarations (defineBaseConfig)
- ✅ add stylistic plugin and rules
- 🔳 add tests (esp. import/no-unresolved)
- ✅ deprecated: node/no-hide-core-modules, node/no-unsupported-features
- 🔳 node: differentiate esm and cjs globals (?)
- 🔳 support typescript in monorepo (parserOptions.project is set to 'true')
- 🔳 support React (jsx, tsx)
