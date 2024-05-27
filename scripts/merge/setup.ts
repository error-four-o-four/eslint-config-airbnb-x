export const mergedConfigKeys = [
	'base',
	'baseJs',
	'baseTs',
	'baseTsOnly',
] as const;

export const tsOnlyRules = new Set([
	'constructor-super',
	'getter-return',
	'no-const-assign',
	'no-dupe-args',
	'no-dupe-class-members',
	'no-dupe-keys',
	'no-func-assign',
	'no-import-assign',
	'no-new-symbol',
	'no-obj-calls',
	'no-redeclare',
	'no-setter-return',
	'no-this-before-super',
	'no-undef',
	'no-unreachable',
	'no-unsafe-negation',
	'valid-typeof',
	// https://github.com/iamturns/eslint-config-airbnb-typescript/blob/766a2b975055bd827b72cbb538643e9103c1bdd4/lib/shared.js#L286
	'import/named',
	'import/no-named-as-default-member',
	'import/no-unresolved',
]);
