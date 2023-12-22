// import { fileURLToPath } from 'node:url';

// import legacy from '../src/configs/generated/disable-legacy.js';

// import bestPractices from '../src/configs/airbnb/best-practices.js';
// import errors from '../src/configs/airbnb/errors.js';
// import style from '../src/configs/airbnb/style.js';
// import variables from '../src/configs/airbnb/variables.js';
// import es6 from '../src/configs/airbnb/es6.js';
// import strict from '../src/configs/airbnb/strict.js';

// import { sortRulesByEntryName } from './utils/rules.ts';
// import { ensureFolder, writeFile } from './utils/write.ts';
// import type { ApprovedRuleEntry, NamedFlatConfig } from './types.ts';

// const allBaseConfigs = [
// 	legacy,
// 	bestPractices,
// 	errors,
// 	style,
// 	variables,
// 	es6,
// 	strict,
// ];

// const mergedBaseConfig: NamedFlatConfig = {
// 	name: 'airbnb:config',
// 	rules: mergeAndSortEntries(allBaseConfigs),
// };

// const dir = '../src/configs/merged';
// ensureFolder(fileURLToPath(new URL(`${dir}/`, import.meta.url)));

// const file = `${dir}/base.js`;
// const data = `// FILE GENERATED WITH SCRIPT
// /** @type {import('../../../shared/types.d.ts)} */
// export default ${JSON.stringify(mergedBaseConfig)}
// `;

// writeFile(import.meta.url, file, data);

// function mergeAndSortEntries(source: NamedFlatConfig[]) {
// 	const entries: ApprovedRuleEntry[] = [];

// 	source.forEach((item) => {
// 		if (item.rules) {
// 			entries.push(...Object.entries(item.rules));
// 		}
// 	});

// 	return entries.sort(sortRulesByEntryName).reduce(
// 		(all, [name, value]) =>
// 			Object.assign(all, {
// 				[name]: value,
// 			}),
// 		{}
// 	);
// }
