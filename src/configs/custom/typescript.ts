/** @file GENERATED WITH SCRIPT */
import type {
	FlatConfig,
	ESLintPlugin,
	ESLintParser,
} from '../../globalTypes.ts';

import typescriptEslint from 'typescript-eslint';

export default {
	plugins: {
		type: typescriptEslint.plugin as ESLintPlugin,
	},
	name: 'airbnb:typescript',
	rules: {},
} satisfies FlatConfig;
