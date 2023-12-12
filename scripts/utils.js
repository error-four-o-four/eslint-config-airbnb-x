import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';

import prettier from 'prettier';

/**
 * @typedef {{name: string} & import('eslint').Linter.FlatConfig} CustomConfig
 */

/**
 * @typedef {{[x: string]: {name: string} & import('./utils').CustomConfig}} CustomConfigDict
 */

/**
 * @typedef {import('eslint').Rule.RuleModule} CustomRule
 */

/**
 *
 * @param {string} item
 * @returns {PromiseLike<[string, import('eslint').Linter.BaseConfig]>}
 */
export const promiseBaseConfig = (item) => {
	const name = path.basename(item, '.js');
	const file = pathToFileURL(item);

	return new Promise((resolve) => {
		import(file).then((module) => {
			resolve([name, module.default]);
		});
	});
};

const filename = fileURLToPath(import.meta.url);
const root = path.dirname(path.resolve(filename, '..'));

const compat = new FlatCompat({
	baseDirectory: root,
});

export const NOTICE = '// FILE GENERATED WITH SCRIPT';

export const prefix = 'airbnb';

/**
 *
 * @param {string} name
 * @param {import('eslint').Linter.BaseConfig} config
 * @returns {import('eslint').Linter.FlatConfig}
 */
export const convertBaseToFlat = (name, config) =>
	compat.config(config).reduce((all, data) => Object.assign(all, data), {
		name: `${prefix}:${name}`,
	});

const prettierBaseOptions = await prettier.resolveConfig(
	new URL('../.prettierrc.json', import.meta.url)
);

/**
 *
 * @param {string} input
 * @param {import('prettier').BuiltInParserName} parser
 */
export const prettify = async (input, parser = 'espree') => {
	const options = {
		...prettierBaseOptions,
		parser,
		useCache: false,
	};

	return await prettier.format(input, options);
};
