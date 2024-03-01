import extractedConfigKeys from '../extractedConfigKeys.ts';

export { extractedConfigKeys as airbnbConfigKeys };

export const airbnbConfigKeyValues = Object.values(extractedConfigKeys);

export const addedConfigKeys = {
	stylistic: 'stylistic',
	typescript: 'typescript',
	disableLegacy: 'disable-legacy',
} as const;

export const addedConfigKeyValues = Object.values(addedConfigKeys);

export const customConfigKeys = {
	...Object.fromEntries(
		Object.entries(extractedConfigKeys).filter(([name]) => name !== 'es6'),
	) as Omit<typeof extractedConfigKeys, 'es6'>,
	es2022: 'es2022',
	...addedConfigKeys,
} as const;

export const customConfigKeyValues = Object.values(customConfigKeys);

export const configWithPluginKeys: Pick<
	typeof customConfigKeys,
	'imports' | 'node' | 'stylistic' | 'typescript'
> = {
	imports: 'imports',
	node: 'node',
	stylistic: 'stylistic',
	typescript: 'typescript',
} as const;

export const configWithPluginKeyValues = Object.values(configWithPluginKeys);

export const ECMA_VERSION = 2022;
export const SOURCE_TYPE = 'module';

export const EXTS_JS = ['.js', '.mjs'];

export const EXTS_TS = ['.js', '.mjs'];
