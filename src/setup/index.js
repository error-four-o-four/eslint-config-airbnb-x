import parser from '@typescript-eslint/parser';

import { ECMA_VERSION, SOURCE_TYPE, tsExists } from './constants.js';

const name = 'airbnb:setup';

const base = {
	sourceType: SOURCE_TYPE,
	ecmaVersion: ECMA_VERSION,
	parser,
	parserOptions: {
		ecmaFeatures: {
			jsx: false,
		},
		project: tsExists ? true : null,
	},
};

/** @type {import('../../shared/types.js').NamedFlatConfig} */
export default {
	name,
	languageOptions: base,
};

// /** @type {import('../../shared/types.d.ts').NamedFlatConfig} */
// export const optionsJs = {
// 	name,
// 	languageOptions: base,
// };

// /** @type {import('../../shared/types.d.ts').NamedFlatConfig} */
// export const optionsTs = {
// 	name,
// 	languageOptions: {
// 		...base,
// 		parserOptions: {
// 			...base.parserOptions,
// 			project: true,
// 		},
// 	},
// };

// /** @type {import('../../shared/types.d.ts').NamedFlatConfig} */
// export const optionsMixed = {
// 	name,
// 	languageOptions: {
// 		...optionsTs.languageOptions,
// 	},
// };
