import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { Linter } from 'eslint';
import { FlatCompat } from '@eslint/eslintrc';

import airbnb from 'eslint-config-airbnb-base';

const filename = fileURLToPath(import.meta.url);
const root = path.dirname(path.resolve(filename, '../../..'));

const promisedConfigs = airbnb.extends.map((item) => {
	const name = path.basename(item, '.js');
	const file = pathToFileURL(item);

	return new Promise((resolve) => {
		import(file).then((module) => {
			resolve([name, module.default]);
		});
	});
});

const resolvedConfigs = await Promise.all(promisedConfigs);

const rawRules = new Linter().getRules();

const compat = new FlatCompat({
	baseDirectory: root,
});

const convertToFlat = (config) =>
	compat.config(config).reduce((all, data) => Object.assign(all, data), {});

const deprecatedRules = [];
const notFoundRules = [];

const deleteDeprecatedRules = (config) => {
	if (!Object.hasOwn(config, 'rules')) {
		return config;
	}

	for (const rule of Object.keys(config.rules)) {
		const rawRule = rawRules.get(rule);

		if (!rawRule) {
			notFoundRules.push(rawRule);
			continue;
		}

		if (rawRule && rawRule.meta.deprecated) {
			deprecatedRules.push(rawRule);
			delete config.rules[rule];
		}
	}

	return config;
};

const configs = resolvedConfigs.map(([name, data]) => {
	let config = convertToFlat(data);

	// manually modified
	if (name !== 'node' && name !== 'imports') {
		config = deleteDeprecatedRules(config);
	}
	config = Object.assign({
		name: `airbnb:${name}`,
		...config,
	});

	return config;
});

export { configs, rawRules, deprecatedRules, notFoundRules };
