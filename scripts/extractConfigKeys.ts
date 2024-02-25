import path from 'node:path';

// @ts-expect-error missing types
import airbnb from 'eslint-config-airbnb-base';

import {
	NOTICE,
	createFile,
	getPath,
	toCamelCase,
} from './utils/write.ts';

const configKeys: string[] = airbnb.extends.map(
	(item: string) => path.basename(item, '.js'),
);

const file = getPath('./extractedConfigKeys.ts', import.meta.url);
const data = `${NOTICE}
export default {
	${configKeys.map(
		(name: string) => `${toCamelCase(name)}: '${name}',`,
	).join('\n')}
} as const;
`;

createFile(file, data);
