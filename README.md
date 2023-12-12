# eslint-config-airbnb-flat

Unofficial port of airbnb styleguide eslintrc files to flat config file format.

## Setup

### Install

```
npm i -D @custom-bits/eslint-config-airbnb-flat
```

### Configure

#### Base Example:

```js
import defineBaseConfig from '@custom-bits/eslint-config-airbnb-flat/base';

export default defineBaseConfig({
	files: ['path/**/*.js'],
	rules: {
		// add custom overrides
	},
});
```

The function `defineBaseConfig` accepts multiple arguments.

This is an optimized version of the [eslint-config-airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) config. It uses the typescript [parser](https://www.npmjs.com/package/@typescript-eslint/parser) and [resolver](https://www.npmjs.com/package/eslint-import-resolver-typescript) by default and it disables all deprecated rules which can be found [here](./legacy.json).

eslint-plugin-import was replaced by [eslint-plugin-i](https://github.com/un-es/eslint-plugin-i) and additionally [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n) was added.

If you want to override one of the rules of these plugins, make sure to use the prefix `import` or `node`.

#### Stylistic Example

```js
import defineStylisticConfig from '@custom-bits/eslint-config-airbnb-flat/stylistic';

export default defineStylisticConfig({
	files: ['path/**/*.js'],
	rules: {
		'stylistic/indent': 0,
	},
});
```

This is generally the same as above but adds the [@stylistic/eslint-plugin](https://eslint.style/packages/default) and applies the airbnb stylistic rules.

If you want to override one of these rules make sure to use the prefix `stylistic`.

#### Plain Compat

```js
import { all } from '@custom-bits/eslint-config-airbnb-flat/compat';

export default {
	all.bestPractice
}
```

These are just the plain converted configs (use at your own risk).

### Roadmap

- [ ] bundle (with rollup (?))
- [ ] convert codebase to typescript
- [ ] type declerations
- [ ] utilize rule tester
- [ ] test: import/no-unresolved
- [ ] deprecated: n/no-hide-core-modules, n/no-unsupported-features
- [ ] support React (jsx, tsx)
