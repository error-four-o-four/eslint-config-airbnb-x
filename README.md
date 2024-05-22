# eslint-config-airbnb-ts

Unofficial migration of the airbnb styleguide from eslintrc format to [flat config ](https://eslint.org/docs/latest/use/configure/configuration-files-new) file format.

## Setup

### Install

```
npm i -D eslint-config-airbnb-ts
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

- All [deprecated rules](./data/legacy.json) are disabled
- [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n) and [eslint-stylistic](https://github.com/eslint-stylistic/eslint-stylistic) were added
- [eslint-plugin-import-x](https://github.com/import-js/eslint-plugin-import) was replaced by [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x)
- [eslint-import-resolver-typescript](https://www.npmjs.com/package/eslint-import-resolver-typescript) is used by default to support ['imports' and 'exports' fields in package.json](https://github.com/import-js/eslint-plugin-import/issues/1868)
- [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) is used to support [typescript](https://www.typescriptlang.org/). It's auto-detected and works out-of-box (heavily inspired by [Anthony Fu](https://github.com/antfu)s [config](https://github.com/antfu/eslint-config/tree/main)).

### Customize

If you want to override one of the rules of the added plugins, make sure to use the corresponding prefix:

| Original Prefix        | New prefix  |
| ---------------------- | ----------- |
| `import-x              | `import/*`  |
| `n/*`                  | `node/*`    |
| `@stylistic/*`         | `style/*`   |
| `@typescript-eslint/*` | `type/*`    |

You can also use only specific configuration files:

```js
import { node } from 'eslint-config-airbnb-flat';

export default [node];
```

#### Plain Compat

These are just the plain, unomptimized converted configs (use them at your own risk).

```js
import airbnb from 'eslint-config-airbnb-flat/compat';

console.log(Object.keys(configs));
```

### Roadmap

- 🔳 node: differentiate esm and cjs globals (?)
- 🔳 support typescript in monorepo (parserOptions.project is set to 'true')
- 🔳 support React (jsx, tsx)
