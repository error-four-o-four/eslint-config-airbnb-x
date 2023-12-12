import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';

import { pluginNames } from '../src/setup/plugins.js';

import { prefix } from './utils.js';

import {
	createLegacyRule,
	findRawRule,
	findReplacedIn,
	legacyRulesSorter,
} from './utils.deprecated.js';

const filename = fileURLToPath(import.meta.url);
const root = dirname(resolve(filename, '..'));

const compat = new FlatCompat({
	baseDirectory: root,
});

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

// @todo single responsibility!

/**
 *
 * @param {[string, Linter.BaseConfig<Linter.RulesRecord, Linter.RulesRecord>][]} entries
 * @returns {[import('./utils.js').CustomConfigDict, import('./utils.deprecated.js').LegacyRule[]]}
 */
export default (entries) => {
	/**
	 * @type {import('./utils.js').CustomConfigDict}
	 */
	const configs = {};

	/**
	 * @type {import('./utils.deprecated.js').LegacyRule[]}
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
				const strippedRuleName = ruleName.includes('/')
					? ruleName.split('/')[1]
					: ruleName;

				const pluginName = findReplacedIn(strippedRuleName);

				// create meta
				const legacyRule = createLegacyRule(
					strippedRuleName,
					ruleValue,
					configName,
					pluginName,
					rawRule
				);

				legacy.push(legacyRule);

				// remove deprecated rule
				delete flatConfig.rules[ruleName];

				// copy value and set plugin scope 'import' | 'node' in flatConfig
				if (pluginName && pluginName !== pluginNames.stylistic) {
					flatConfig.rules[`${pluginName}/${strippedRuleName}`] = ruleValue;
				}
			}
		});

		// create entry
		configs[configName] = flatConfig;
	});

	legacy = legacy.sort(legacyRulesSorter);

	const legacyConfigName = 'disable-legacy';
	const legacyConfigRules = legacy
		.filter((rule) => rule.plugin !== pluginNames.stylistic)
		.reduce((all, item) => {
			const name =
				item.plugin === pluginNames.import
					? `${item.plugin}/${item.name}`
					: item.name;
			return Object.assign(all, {
				[name]: 0,
			});
		}, {});

	configs[legacyConfigName] = {
		name: `${prefix}:${legacyConfigName}`,
		rules: legacyConfigRules,
	};

	const stylisticConfigRules = legacy
		.filter((rule) => rule.plugin === pluginNames.stylistic)
		.reduce(
			(all, item) =>
				Object.assign(all, {
					[`${pluginNames.stylistic}/${item.name}`]: item.value,
				}),
			{}
		);

	configs[pluginNames.stylistic] = {
		name: `${prefix}:${pluginNames.stylistic}`,
		rules: stylisticConfigRules,
	};

	return [configs, legacy];
};
