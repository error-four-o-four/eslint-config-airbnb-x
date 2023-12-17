# eslint-config-airbnb-flat

Unofficial migration of the airbnb styleguide from eslintrc format to flat config file format.

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
		// add custom overrides
	},
});
```

The function `defineConfig` accepts multiple arguments.

This is an optimized version of the [eslint-config-airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) config. It uses the typescript [parser](https://www.npmjs.com/package/@typescript-eslint/parser) and [resolver](https://www.npmjs.com/package/eslint-import-resolver-typescript) by default and it disables all [deprecated rules](./legacy.json).

When [typescript](https://www.typescriptlang.org/) is installed as a dependency the corresponding [overrides](./src/configs/custom/typescript.js) are applied automagically (heavily inspired by the [config](https://github.com/antfu/eslint-config/tree/main) of [Anthony Fu](https://github.com/antfu)).

[eslint-plugin-import](https://github.com/import-js/eslint-plugin-import) was replaced by [eslint-plugin-i](https://github.com/un-es/eslint-plugin-i) and additionally [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n) was added.

### Customization

If you want to override one of the rules of these plugins, make sure to use the `import`, `node` or `typescript`.

To pick and use only specific configuration files, use the default export:

```js
import * as airbnb from 'eslint-config-airbnb-flat/base';

console.log(Object.keys(airbnb));

export default [airbnb.bestPractices, airbnb.errors];
```

#### Plain Compat

These are just the plain, unomptimized converted configs (use at your own risk).

```js
// An array of the configs
import airbnb from 'eslint-config-airbnb-flat/compat';

// Or an object with the configs
import * as airbnb from 'eslint-config-airbnb-flat/compat';
console.log(airbnb.bestPractices);
```

### Roadmap

- 🔳 bundle (with ~~rollup~~ esbuild (to esm))
- 🔳 convert (whole) codebase to typescript
- 🔳 export type declarations
- 🔳 add stylistic plugin and rules
- 🔳 add tests (esp. import/no-unresolved)
- 🔳 deprecated: node/no-hide-core-modules, node/no-unsupported-features
- 🔳 node: differentiate esm and cjs globals (?)
- 🔳 support React (jsx, tsx)
