import { write } from './shared/utils/write.ts';

import {
	createMergedConfigs,
	mergeLanguageOptions,
	mergeSettings,
	mergeRules,
	sortRules,
} from './merge/main.ts';

/**
 * @todo
 * create configs, which apply to different code bases, like
 * js-only, js-mixed, ts-mixed, ts-only
 *
 */

/**
 * @note
 * mixed => applies to both .js & .ts
 * js-specific
 * ts-override (which turns off js-specific)
 */

const mergedConfigs = createMergedConfigs();

/**
 * @note
 * merge languageOptions
 * except from ('node' and) 'typescript'
 *
 * @todo
 * consider to add a config to differentiate environments node/browser
 */

mergeLanguageOptions(mergedConfigs);
mergeSettings(mergedConfigs);
mergeRules(mergedConfigs);
sortRules(mergedConfigs);

// #####

const destination = './src/configs/merged';
await write.configFiles(destination, mergedConfigs);
