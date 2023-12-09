import defineBaseConfig from './src/base.js'

/* eslint-disable no-console */
console.log('linting')

export default defineBaseConfig([
	{
		name: 'custom:overrides'
		// rules: {
		// 	"n/file-extension-in-import": [
    //     "error",
		// 		"always"
    // ]
		// }
	}
])