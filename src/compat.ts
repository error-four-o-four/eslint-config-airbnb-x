import { pluginImport, pluginPrefix } from './plugins.ts';

import configs from './configs/airbnb/index.ts';

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
