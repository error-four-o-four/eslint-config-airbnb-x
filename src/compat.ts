import pluginImport from 'eslint-plugin-import-x';

import { pluginPrefix } from '../scripts/setupGlobal.ts';

import configs from './configs/airbnb/index.ts';

// @ts-expect-error
configs.imports.plugins = { [pluginPrefix.import]: pluginImport };

const {
	bestPractices,
	errors,
	es6,
	imports,
	node,
	strict,
	style,
	variables,
} = configs;

export {
	bestPractices,
	errors,
	es6,
	imports,
	node,
	strict,
	style,
	variables,
};

export default configs;
