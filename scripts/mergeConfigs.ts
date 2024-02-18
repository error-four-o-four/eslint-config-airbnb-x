import { Linter } from 'eslint';

import custom, {
	es2022,
	node,
	imports,
	stylistic,
	typescript,
} from '../src/configs/custom/index.js';

import { NOTICE, ensureFolder, writeFile } from './utils/write.ts';
import { configHasPlugin, pluginNames } from './utils/plugins.ts';
import { isTypescriptRule } from './utils/rules.ts';

const mergedKeys = ['base-mixed', 'base-js', 'base-ts'] as const;

mergeConfigs();

// ###

function mergeConfigs() {
	// generate multiple sets of rules
	// * mixed => both .js, .ts
	// * js-specific
	// * ts-override (which turns off js-specific)
	// add 'languageOptions' and 'settings'
	const configs = createConfigs();

	// sort all rules
	// which are not a part of a plugin (node, imports, stylistic)
	const sorted = getSortedRulesEntries();

	sorted.forEach(([name, value]) => {
		if (!isTypescriptRule(name)) {
			// this rule won't be overwritten by typescript plugin
			// it applies to js and ts files
			configs['base-mixed'].rules[name] = value;
		} else {
			// this rule will be overwritten
			configs['base-js'].rules[name] = value;
			configs['base-ts'].rules[name] = 0;
		}
	});

	// @todo compare import rules
	// import/named, import/no-named-as-default-member
	// => base-js

	// add plugin rules (to js and ts)
	configs['base-mixed'].rules = {
		...configs['base-mixed'].rules,
		...imports.rules,
		...node.rules,
		...stylistic.rules,
	};

	configs['base-ts'].rules = {
		...configs['base-ts'].rules,
		...getTsOverwrites(configs['base-js'].rules),
	};

	writeConfigs(configs);
}

function createConfigs() {
	const languageOptionsJS = getMergedLanguageOptions();

	const { settings: settingsJS } = imports as PartiallyRequired<
	Linter.FlatConfig,
	'settings'
	>;

	const { languageOptions: languageOptionsTS, settings: settingsTS } = typescript as PartiallyRequired<Linter.FlatConfig, 'settings'>;

	return {
		[mergedKeys[0]]: {
			languageOptions: languageOptionsJS,
			settings: settingsJS,
			rules: {},
		},
		[mergedKeys[1]]: {
			rules: {},
		},
		[mergedKeys[2]]: {
			languageOptions: languageOptionsTS,
			settings: settingsTS,
			rules: {},
		},
	} as MergedConfigs;
	// return mergedKeys.reduce(
	// 	(all, key) => Object.assign(all, {
	// 		[key]: {
	// 			languageOptions: {},
	// 			settings: {},
	// 			rules: {},
	// 		},
	// 	}),
	// 	{} as MergedConfigs,
	// );
}

type MergedKey = (typeof mergedKeys)[number];

type MergedConfig = PartiallyRequired<Linter.FlatConfig, 'rules'>;

type MergedConfigs = {
	[K in MergedKey]: MergedConfig;
};

type PartiallyRequired<T, K extends keyof T> = Omit<T, K> &
	Required<Pick<T, K>>;

function getSortedRulesEntries() {
	return Object.values(custom)
		.filter((config) => {
			const name = config.name.split(':')[1];
			return !configHasPlugin(name);
		})
		.map((config) => Object.entries(config.rules || {}))
		.reduce(
			(all, entries) => [...all, ...entries],
			[] as [string, Linter.RuleEntry][],
		)
		.sort((a, b) => {
			const nameA = a[0].toUpperCase();
			const nameB = b[0].toUpperCase();

			return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
		});
}

function getTsOverwrites(
	source: NonNullable<Linter.FlatConfig['rules']>,
): NonNullable<Linter.FlatConfig['rules']> {
	return {
		// add .ts, .tsx 'never'
		...getImportExtensions(),
		// add .ts extensions
		...getImportExtraneousDeps(),
		// turn off
		// https://github.com/typescript-eslint/typescript-eslint/blob/13583e65f5973da2a7ae8384493c5e00014db51b/docs/linting/TROUBLESHOOTING.md#eslint-plugin-import
		[`${pluginNames.import}/named`]: 0,
		[`${pluginNames.import}/no-named-as-default-member`]: 0,
		// add plugin scope
		...Object.fromEntries(
			Object.entries(source).map(([name, value]) => [
				`${pluginNames.typescript}/${name}`,
				value,
			]),
		),
	};
}

function getImportExtensions() {
	const rules = imports.rules as NonNullable<Linter.FlatConfig['rules']>;

	const key = `${pluginNames.import}/extensions`;
	const rule = rules[key] as Linter.RuleLevelAndOptions;

	const record: Linter.RulesRecord = {
		[key]: [
			rule[0],
			rule[1],
			{
				...rule[2],
				ts: 'never',
				tsx: 'never',
			},
		],
	};

	return record;
}

function getImportExtraneousDeps() {
	const key = `${pluginNames.import}/no-extraneous-dependencies`;
	const rule = imports.rules![key] as Linter.RuleLevelAndOptions;

	const deps = rule[1].devDependencies as string[];
	const regex = /\bjs(x?)\b/g;

	const record: Linter.RulesRecord = {
		[key]: [
			rule[0],
			{
				// @todo replace '**/.eslintrc.js' with '**/.eslintrc{,.js,.cjs}'
				devDependencies: [
					...deps,
					...deps
						.filter((dep) => dep.includes('js') && !dep.includes('eslintrc'))
						.map((dep) => dep.replace(regex, 'ts$1')),
				],
				optionalDependencies: rule[1].optionalDependencies,
			},
		],
	};

	return record;
}

function getMergedLanguageOptions() {
	// @todo refactor
	const ecmaFeatures = {
		...es2022.languageOptions?.parserOptions?.ecmaFeatures,
		...node.languageOptions?.parserOptions?.ecmaFeatures,
		...imports.languageOptions?.parserOptions?.ecmaFeatures,
	};

	const parserOptions = {
		...es2022.languageOptions?.parserOptions,
		...node.languageOptions?.parserOptions,
		...imports.languageOptions?.parserOptions,
		ecmaFeatures,
	};

	return {
		...es2022.languageOptions,
		...node.languageOptions,
		...imports.languageOptions,
		parserOptions,
	};
}

function writeConfigs(source: MergedConfigs) {
	const { url } = import.meta;
	const folder = '../src/configs/merged';
	ensureFolder(`${folder}/`, url);

	const toData = (config: Linter.FlatConfig) => `${NOTICE}
/** @type {import('../../../shared/types.d.ts').FlatConfig} */
export default ${JSON.stringify(config)}
`;

	const names = Object.keys(source);

	names.reduce(async (chain, name) => {
		await chain;
		const config = source[name as MergedKey];

		const file = `${folder}/${name}.js`;
		const data = toData(config);

		return writeFile(url, file, data);
	}, Promise.resolve());
}
