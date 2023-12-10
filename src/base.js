import configs from './config/index.js';

// /**
//  *
//  * @param {import('eslint').Linter.FlatConfig[]} overrides
//  * @returns {import('eslint').Linter.FlatConfig[]}
//  */
// const defineBaseConfig = (overrides = []) => [...configs.all, ...overrides]

/**
 *
 * @param {import('eslint').Linter.FlatConfig[]} overrides
 * @returns {import('eslint').Linter.FlatConfig[]}
 */
const defineBaseConfig = (overrides = []) => [
	configs.bestPractice,
	configs.errors,
	configs.node,
	configs.style,
	configs.variables,
	{
		// omit languageOptions
		name: configs.es6.name,
		rules: configs.es6.rules
	},
	configs.imports,
	configs.strict,
	...overrides
]

export default defineBaseConfig