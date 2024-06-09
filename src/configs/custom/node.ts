/** @file GENERATED WITH SCRIPT */
import type { FlatConfig, ESLintPlugin } from '../../globalTypes.ts';
import eslintPluginN from 'eslint-plugin-n';

export default {
	plugins: {
		node: eslintPluginN as unknown as ESLintPlugin,
	},
	name: 'airbnb:node',
	rules: {
		'node/callback-return': 'off',
		'node/global-require': 'error',
		'node/handle-callback-err': 'off',
		'node/no-mixed-requires': ['off', false],
		'node/no-new-require': 'error',
		'node/no-path-concat': 'error',
		'node/no-process-env': 'off',
		'node/no-process-exit': 'off',
		'node/no-sync': 'off',
	},
} satisfies FlatConfig;
