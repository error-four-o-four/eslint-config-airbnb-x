import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';

import { pluginNames } from '../src/setup/plugins.js';

import { findRawRule, findReplacedIn } from './utils.deprecated.js';

const filename = fileURLToPath(import.meta.url);
const root = dirname(resolve(filename, '..'));

const compat = new FlatCompat({
	baseDirectory: root,
});

const prefix = 'airbnb';

/**
 *
 * @param {string} name
 * @param {import('eslint').Linter.BaseConfig} config
 * @returns {import('eslint').Linter.FlatConfig}
 */
const convertBaseToFlat = (name, config) =>
	compat.config(config).reduce((all, data) => Object.assign(all, data), {
		name: `${prefix}:${name}`,
	});

/**
 * @typedef {{[x: string]: {name: string} & import('./utils').CustomConfig}} CustomConfigDict
 */

/**
 * @typedef {Object} DeprecatedRule
 * @property {string} name
 * @property {import('eslint').Linter.RuleEntry<any[]>} value
 * @property {string} config
 * @property {string} replacedIn
 * @property {string[] | undefined} replacedBy
 * @property {string | undefined} url
 */

/**
 *
 * @param {DeprecatedRule[]} deprecated
 * @returns {import('./utils.js').CustomConfig}
 */
const createDisableLegacyConfig = (deprecated) => {
	const rules = deprecated
		.filter((item) => item.replacedIn !== pluginNames.s)
		.reduce(
			(all, item) =>
				Object.assign(all, {
					[item.name]: 'off',
				}),
			{}
		);

	return {
		name: 'airbnb:disable-legacy',
		rules,
	};
};

/**
 *
 * @param {DeprecatedRule[]} deprecated
 * @returns {import('./utils.js').CustomConfig}
 */
const createDisableLegacyStylisticConfig = (deprecated) => {
	const rules = deprecated
		.filter((item) => item.replacedIn === pluginNames.s)
		.reduce(
			(all, item) =>
				Object.assign(all, {
					[item.name]: 'off',
				}),
			{}
		);

	return {
		name: 'airbnb:disable-legacy-stylistic',
		rules,
	};
};

/**
 *
 * @param {DeprecatedRule[]} deprecated
 * @returns {import('./utils.js').CustomConfig}
 */
const createStylisticConfig = (deprecated) => {
	const rules = deprecated
		.filter((item) => item.replacedIn === pluginNames.s)
		.reduce(
			(all, item) =>
				Object.assign(all, {
					[`${pluginNames.s}/${item.name}`]: item.value,
				}),
			{}
		);

	return {
		name: 'airbnb:stylistic',
		rules,
	};
};

/**
 *
 * @param {[string, Linter.BaseConfig<Linter.RulesRecord, Linter.RulesRecord>][]} entries
 * @returns {[CustomConfigDict, DeprecatedRule[]]}
 */
export default (entries) => {
	/**
	 * @type {CustomConfigDict}
	 */
	const configs = {};

	/**
	 * @type {DeprecatedRule[]}
	 */
	let legacy = [];

	// iterate over each config
	entries.forEach(([configName, baseConfig]) => {
		const flatConfig = convertBaseToFlat(configName, baseConfig);

		// remove plugins
		if (Object.hasOwn(flatConfig, 'plugins')) {
			delete flatConfig.plugins;
		}

		// search for deprecated rules
		Object.entries(flatConfig.rules).forEach(([ruleName, ruleValue]) => {
			const rawRule = findRawRule(ruleName);

			if (!rawRule) {
				// delete rule
				delete flatConfig.rules[ruleName];
				console.log(`Could not find rule '${ruleName}'`);
				return;
			}

			if (rawRule && rawRule.meta.deprecated) {
				const pluginName = findReplacedIn(ruleName);

				// @todo const createLegacyRule = () => {}
				// create meta
				legacy.push({
					name: ruleName,
					value: ruleValue,
					config: configName,
					replacedIn: pluginName,
					replacedBy: rawRule.meta.replacedBy,
					url: rawRule.meta.docs.url,
				});

				// turn off deprecated rule
				// flatConfig.rules[ruleName] = 'off';
				delete flatConfig.rules[ruleName];

				// set plugin scope 'import' | 'node'
				if (pluginName && pluginName !== pluginNames.s) {
					flatConfig.rules[`${pluginName}/${ruleName}`] = ruleValue;
				}
			}
		});

		// create entry
		configs[configName] = flatConfig;
	});

	// @todo refactor
	legacy = legacy.sort((a, b) => {
		const nameA = a.name.toUpperCase();
		const nameB = b.name.toUpperCase();

		/* eslint-disable no-nested-ternary */
		return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
	});

	configs['disable-legacy'] = createDisableLegacyConfig(legacy);
	configs['disable-legacy-stylistic'] =
		createDisableLegacyStylisticConfig(legacy);
	configs.stylistic = createStylisticConfig(legacy);

	legacy = legacy.reduce((all, rule) => {
		const { replacedIn } = rule;
		const tmp = { ...all };
		if (replacedIn) {
			if (!tmp[replacedIn]) tmp[replacedIn] = [];
			tmp[replacedIn].push(rule);
		} else {
			if (!tmp.missing) tmp.missing = [];
			tmp.missing.push(rule);
		}

		return tmp;
	}, {});

	return [configs, legacy];
};
