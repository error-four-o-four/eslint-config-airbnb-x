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
	// configs.es6, // temporary removed due to missing spread syntax
	// configs.imports,
	configs.node,
	configs.strict,
	configs.style,
	configs.variables,
	...overrides
]

export default defineBaseConfig