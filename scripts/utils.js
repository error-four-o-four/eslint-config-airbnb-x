import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import { Linter } from 'eslint';

import prettier from 'prettier';

import { pluginNames, plugins } from '../src/setup/plugins.js';

/**
 * @typedef {import('eslint').Linter.BaseConfig} BaseConfig
 */

/**
 * @typedef {import('eslint').Linter.FlatConfig} FlatConfig
 */

/**
 * @typedef {{name: string} & FlatConfig} CustomConfig
 */

/**
 * @typedef {{[x: string]: CustomConfig}} CustomConfigDict
 */

export const NOTICE = '// FILE GENERATED WITH SCRIPT';

export const prefix = 'airbnb';

/**
 *
 * @param {string} item
 * @returns {PromiseLike<[string, BaseConfig]>}
 */
export function promiseBaseConfig(item) {
	const name = path.basename(item, '.js');
	const file = pathToFileURL(item);

	return new Promise((resolve) => {
		import(file).then((module) => {
			resolve([name, module.default]);
		});
	});
}

// CONVERSION

const filename = fileURLToPath(import.meta.url);
const root = path.dirname(path.resolve(filename, '..'));

const compat = new FlatCompat({
	baseDirectory: root,
});

/**
 *
 * @param {string} name
 * @param {BaseConfig} config
 * @returns {FlatConfig}
 */
function convertBaseToFlat(name, config) {
	return compat.config(config).reduce((all, data) => Object.assign(all, data), {
		name: `${prefix}:${name}`,
	});
}

/**
 *
 * @param {string} name
 * @param {BaseConfig} base
 * @param {RuleEntry[]} rulesEntries
 * @returns
 */
export function convertConfig(name, base, rulesEntries) {
	const configTmp = removePlugins(base);

	const rules = Object.fromEntries(
		rulesEntries.sort((a, b) => {
			const nameA = a[0].toUpperCase();
			const nameB = b[0].toUpperCase();

			return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
		})
	);

	return convertBaseToFlat(name, {
		...configTmp,
		rules,
	});
}

/**
 *
 * @param {BaseConfig} config
 * @returns {BaseConfig}
 */
function removePlugins(config) {
	const tmp = { ...config };
	if (Object.hasOwn(tmp, 'plugins')) {
		delete tmp.plugins;
	}
	return tmp;
}

// PROCESS RULES

/**
 * @typedef {import('eslint').Rule.RuleModule} RawRule
 */

/**
 * @typedef {import('eslint').Linter.RuleEntry<any[]>} RuleValue
 */

/**
 * @typedef {[string, RuleValue]} RuleEntry
 */

/**
 * @typedef {Object} DeprecatedRule
 * @property {string} name
 * @property {import('eslint').Linter.RuleEntry<any[]>} value
 * @property {string} config
 * @property {string} plugin
 * @property {string[] | undefined} replacedBy
 * @property {string | undefined} url
 */

const rulesImport = plugins[pluginNames.import].rules;
// const rulesNode = plugins[pluginNames.node].rules;
// const rulesTs = plugins[pluginNames.typescript].rules;

const rulesEslint = new Linter().getRules();

/**
 *
 * @param {string} name
 * @returns {null | RawRule}
 */
export function findRawRule(name) {
	// Airbnb config uses eslint-plugin-import
	// therefore some rules are prefixed with 'import'
	const isImportRule = name.startsWith('import');

	const key = isImportRule ? name.split('/')[1] : name;
	const raw = isImportRule ? rulesImport[key] : rulesEslint.get(key);

	return raw || null;
}

/**
 *
 * @param {string} ruleName
 * @returns {string}
 */
function findReplacedIn(ruleName) {
	const map = {
		[pluginNames.import]: Object.keys(plugins[pluginNames.import].rules),
		[pluginNames.node]: Object.keys(plugins[pluginNames.node].rules),
		[pluginNames.stylistic]: Object.keys(plugins[pluginNames.stylistic].rules),
	};

	const pluginName = Object.entries(map).reduce(
		// (result, [name, rules]) => result !== null ? result : rules.includes(ruleName) ? name : result,
		(result, entry) => {
			const [name, rules] = entry;
			if (result !== null) return result;
			if (rules.includes(ruleName)) return name;
			return null;
		},
		null
	);

	return pluginName;
}

// export const getPluginsLegacy = () => {
// 	let legacy = [];

// 	// node => rule.meta.deprecated
// 	Object.entries(plugins[pluginNames.node].rules).forEach(([name, rule]) => {
// 		if (rule.meta.deprecated) {
// 			legacy.push(createLegacyRule(name, rule, '', pluginNames.node, rule))
// 		}
// 	})

// 	// ts => rule.meta.type === 'layout'
// 	Object.entries(plugins[pluginNames.typescript].rules).forEach(([name, rule]) => {
// 		if (rule.meta.type === 'layout') {
// 			legacy.push(createLegacyRule(name, rule, '', pluginNames.typescript, rule))
// 		}
// 	})

// 	return legacy.sort(legacyRulesSorter).reduce((all, rule) => {}, {})
// };

/**
 *
 * @param {string} config
 * @param {string} name
 * @param {RuleValue} value
 * @param {RawRule} rawRule
 * @returns {DeprecatedRule}
 */
export function getDeprecatedRule(config, name, value, rawRule) {
	const stripped = name.includes('/') ? name.split('/')[1] : name;
	const plugin = findReplacedIn(stripped);

	return {
		name: stripped,
		value,
		config,
		plugin,
		replacedBy: rawRule.meta.replacedBy,
		url: rawRule.meta.docs.url,
	};
}

/**
 *
 * @param {DeprecatedRule} a
 * @param {DeprecatedRule} b
 * @returns {number}
 */
export function rulesSorter(a, b) {
	const nameA = a.name.toUpperCase();
	const nameB = b.name.toUpperCase();

	return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
}

// FORMATTER

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
