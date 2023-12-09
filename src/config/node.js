import pluginNode from 'eslint-plugin-n';
import { flat } from 'eslint-plugin-n/lib/configs/recommended-module.js';

const name = 'n';

// https://github.com/eslint-community/eslint-plugin-n/tree/master#-rules
const rules = Object.entries({
	'callback-return': 'off',
	'global-require': 'error',
	'handle-callback-err': 'off',
	'no-buffer-constructor': 'error',
	'no-mixed-requires': ['off', false],
	'no-new-require': 'error',
	'no-path-concat': 'error',
	'no-process-env': 'off',
	'no-process-exit': 'off',
	'no-restricted-modules': 'off',
	'no-sync': 'off',
}).reduce((all, [rule, value]) =>
	Object.assign(
		all,
		{
			[`${name}/${rule}`]: value,
		},
		{}
	)
);

// Rules generated with script
/** @type {import('eslint').Linter.FlatConfig} */
export default {
	name: 'airbnb:node',
	plugins: {
		[name]: pluginNode,
	},
	languageOptions: flat.languageOptions,
	rules,
};
