import type { Linter } from 'eslint';

import names from './utils/names.ts';

const modified = {
	...Object.fromEntries(
		Object.entries(names.airbnb).filter(([name]) => name !== 'es6')
	),
	es2022: 'es2022',
} as ModifiedNamesType;

type ModifiedNamesType = {
	readonly es2022: 'es2022';
} & Omit<typeof names.airbnb, 'es6'>;

const airbnbNameValues = Object.values(names.airbnb);
const customNameValues = Object.values(names.custom);

const configNameValues = [
	...Object.values(modified),
	...customNameValues,
] as const;

export type AirbnbNames = (typeof airbnbNameValues)[number];
export type CustomNames = (typeof customNameValues)[number];
export type ConfigNames = (typeof configNameValues)[number];

export type BaseConfig = Linter.BaseConfig;
export type FlatConfig = Linter.FlatConfig;

export type AirbnbConfigs = { [K in AirbnbNames]: FlatConfig };
export type CustomConfigs = { [K in ConfigNames]: FlatConfig };

export type BaseConfigEntry = [AirbnbNames, BaseConfig];
