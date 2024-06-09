/**
 * @file
 * generates and writes 'custom' flat config files
 * to 'src/configs/custom'
 * depends on the scripts 'node:compat' and 'node:extract'
 * it's necessary to run these beforehand
 */

import { sortConfigRules } from './shared/utils/main.ts';
import parse from './shared/utils/parse.ts';
import write from './shared/utils/write.ts';

import { getCustomConfigs } from './generate/main.ts';
import { configHasPlugin, mapConfigKeyToPrefix } from './generate/utils.ts';

import type { CustomConfigKeysWithPlugin, CustomConfigs } from './generate/types.ts';

const customConfigs = getCustomConfigs();

const destination = './src/configs/custom';
const parsedConfigs = parseFlatConfigs(customConfigs, destination);

await write.files(destination, parsedConfigs);

// #####
function parseFlatConfigs(configs: CustomConfigs, folder: string) {
	const entries = Object.entries(configs);
	const parsed = entries.map((entry) => {
		const [name, config] = entry;

		sortConfigRules(config);

		// manually add plugins
		const hasPlugin = configHasPlugin(name);
		const plugin = mapConfigKeyToPrefix(name as CustomConfigKeysWithPlugin);
		const data = hasPlugin
			? parse.config(config, folder, [plugin])
			: parse.config(config, folder);
		return [name, data] as [string, string];
	});

	parsed.push(['index', parse.index(entries)]);

	return parsed;
}
