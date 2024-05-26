/**
 * @file
 * generates and writes 'custom' flat config files
 * to 'src/configs/custom'
 * depends on the scripts 'node:compat' and 'node:extract'
 * it's necessary to run these beforehand
 */

/** @note created with 'node:compat' */
import convertedConfigs from '../src/configs/airbnb/index.ts';

import {
	createCustomConfigs,
	applyCustomMetaData,
	applyOptionsAndSettings,
} from './generate/main.ts';

import { write } from './shared/utils/write.ts';

/**
 *  @note
 * create an object literal with
 * the exported configs of 'eslint-config-airbnb-base' as the property key and
 * an empty 'Linter.FlatConfig' object literal as a placeholder
 * with the sorted, corresponding property values  @see CustomConfigs
 *
 * set a placeholder for the corresponding plugin
 * which is parsed later @see write.configFiles
 */
const customConfigs = createCustomConfigs();

/**
 * @todo solve overlapping rules in 'imports' and 'typescript' configs
 * @todo customize overwrites for 'typescript' config
 */

/**
 * @note
 * iterate over each entry of the extracted meta data
 * get the value of 'eslint-config-airbnb-base' rule
 * apply, replace or overwrite it depending on the meta data
 */
applyCustomMetaData(convertedConfigs, customConfigs);

/**
 * @note
 * apply and customize 'languageOptions' and 'settings'
 */
applyOptionsAndSettings(convertedConfigs, customConfigs);

// #####

const destination = './src/configs/custom';

await write.configFiles(destination, customConfigs);
write.indexFile(`${destination}/index.ts`, customConfigs);
