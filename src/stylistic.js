import { plugins, pluginNames } from './setup/plugins.js';
import stylistic from './configs/stylistic/index.js';

import defineBaseConfig from './base.js';

const name = pluginNames.stylistic;
const config = Object.assign(stylistic, {
	plugins: {
		[name]: plugins[name],
	},
});

export default function defineStylisticConfig(...overrides) {
	return defineBaseConfig(config, ...overrides);
}
