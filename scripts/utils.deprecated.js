import { Linter } from 'eslint';

import { pluginNames, plugins } from '../src/setup/plugins.js';

const rulesImport = plugins[pluginNames.i].rules;

const rulesEslint = new Linter().getRules();

/**
 *
 * @param {string} name
 * @returns {null | import('./utils.js').CustomRule}
 */
export const findRawRule = (name) => {
	// Airbnb config uses eslint-plugin-import
	// therefore some rules are prefixed with 'import'
	const isImportRule = name.startsWith('import');

	const key = isImportRule ? name.split('/')[1] : name;
	const raw = isImportRule ? rulesImport[key] : rulesEslint.get(key);

	return raw || null;
};

/**
 * @param {string} configName
 * @param {import('./utils.js').CustomConfig} configData
 * @returns {null | [ string[], import('./utils.js').CustomRule[] ]}
 */
export const createDeprecatedRules = (configName, configData) => {
	// store the names of all deprecated rules seperately
	// to access them faster
	const names = [];
	// create a dict of the deprecated rules
	const rules = {};

	Object.keys(configData.rules).forEach((name) => {
		const rule = findRawRule(name);

		if (rule && rule.meta.deprecated) {
			names.push(name);
			rules[name] = rule;
		}
	});

	if (names.length === 0 || rules.length === 0) {
		return null;
	}

	console.log(`deprecated in ${configName}`);
	console.log(names);

	return [names, rules];
};

/**
 *
 * @param {string} ruleName
 * @returns {string}
 */
export const findReplacedIn = (ruleName) => {
	const map = {
		[pluginNames.i]: Object.keys(plugins[pluginNames.i].rules),
		[pluginNames.n]: Object.keys(plugins[pluginNames.n].rules),
		[pluginNames.s]: Object.keys(plugins[pluginNames.s].rules),
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
};

// /**
//  *
//  * @param {import('./utils.js').CustomConfig} config
//  * @returns {import('./utils.js').CustomConfig}
//  */
// const replaceDeprecated = (config) => {
// 	// use an array to sort the rules alphabetically
// 	let entries = [];

// 	console.log(config.name);

// 	Object.entries(config.rules).forEach(([name, value]) => {
// 		if (deprecated.keys.includes(name)) {
// 			const plugin = findDeprecatedRule(name);

// 			if (!plugin) {
// 				console.log(`No replacement found for deprecated rule '${name}'`);
// 				return;
// 			}

// 			console.log(`'${name}' found in ${plugin}`);
// 			entries.push([`${plugin}/${name}`, value]);
// 			return;
// 		}

// 		entries.push([name, value]);
// 	});

// 	entries = entries.sort((a, b) => {
// 		const nameA = a[0].toUpperCase();
// 		const nameB = b[0].toUpperCase();

// 		return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
// 	});

// 	console.log('');

// 	return {
// 		name: config.name,
// 		rules: Object.fromEntries(entries),
// 	};
// };
