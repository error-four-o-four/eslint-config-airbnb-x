// Rules generated with script
/** @type {import('eslint').Linter.FlatConfig} */
export default {
	name: 'airbnb:imports',
	languageOptions: { ecmaVersion: 6, sourceType: 'module' },
	settings: {
		'import/resolver': { node: { extensions: ['.mjs', '.js', '.json'] } },
		'import/extensions': ['.js', '.mjs', '.jsx'],
		'import/core-modules': [],
		'import/ignore': [
			'node_modules',
			'\\.(coffee|scss|css|less|hbs|svg|json)$',
		],
	},
	rules: {
		'import/no-unresolved': ['error', { commonjs: true, caseSensitive: true }],
		'import/named': 'error',
		'import/default': 'off',
		'import/namespace': 'off',
		'import/export': 'error',
		'import/no-named-as-default': 'error',
		'import/no-named-as-default-member': 'error',
		'import/no-deprecated': 'off',
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: [
					'test/**',
					'tests/**',
					'spec/**',
					'**/__tests__/**',
					'**/__mocks__/**',
					'test.{js,jsx}',
					'test-*.{js,jsx}',
					'**/*{.,_}{test,spec}.{js,jsx}',
					'**/jest.config.js',
					'**/jest.setup.js',
					'**/vue.config.js',
					'**/webpack.config.js',
					'**/webpack.config.*.js',
					'**/rollup.config.js',
					'**/rollup.config.*.js',
					'**/gulpfile.js',
					'**/gulpfile.*.js',
					'**/Gruntfile{,.js}',
					'**/protractor.conf.js',
					'**/protractor.conf.*.js',
					'**/karma.conf.js',
					'**/.eslintrc.js',
				],
				optionalDependencies: false,
			},
		],
		'import/no-mutable-exports': 'error',
		'import/no-commonjs': 'off',
		'import/no-amd': 'error',
		'import/no-nodejs-modules': 'off',
		'import/first': 'error',
		'import/imports-first': 'off',
		'import/no-duplicates': 'error',
		'import/no-namespace': 'off',
		'import/extensions': [
			'error',
			'ignorePackages',
			{ js: 'never', mjs: 'never', jsx: 'never' },
		],
		'import/order': [
			'error',
			{ groups: [['builtin', 'external', 'internal']] },
		],
		'import/newline-after-import': 'error',
		'import/prefer-default-export': 'error',
		'import/no-restricted-paths': 'off',
		'import/max-dependencies': ['off', { max: 10 }],
		'import/no-absolute-path': 'error',
		'import/no-dynamic-require': 'error',
		'import/no-internal-modules': ['off', { allow: [] }],
		'import/unambiguous': 'off',
		'import/no-webpack-loader-syntax': 'error',
		'import/no-unassigned-import': 'off',
		'import/no-named-default': 'error',
		'import/no-anonymous-default-export': [
			'off',
			{
				allowArray: false,
				allowArrowFunction: false,
				allowAnonymousClass: false,
				allowAnonymousFunction: false,
				allowLiteral: false,
				allowObject: false,
			},
		],
		'import/exports-last': 'off',
		'import/group-exports': 'off',
		'import/no-default-export': 'off',
		'import/no-named-export': 'off',
		'import/no-self-import': 'error',
		'import/no-cycle': ['error', { maxDepth: '∞' }],
		'import/no-useless-path-segments': ['error', { commonjs: true }],
		'import/dynamic-import-chunkname': [
			'off',
			{ importFunctions: [], webpackChunknameFormat: '[0-9a-zA-Z-_/.]+' },
		],
		'import/no-relative-parent-imports': 'off',
		'import/no-unused-modules': [
			'off',
			{ ignoreExports: [], missingExports: true, unusedExports: true },
		],
		'import/no-import-module-exports': ['error', { exceptions: [] }],
		'import/no-relative-packages': 'error',
	},
	plugins: {
		import: {
			rules: {
				'no-unresolved': {
					meta: {
						type: 'problem',
						docs: {
							category: 'Static analysis',
							description:
								'Ensure imports point to a file/module that can be resolved.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-unresolved.md',
						},
						schema: [
							{
								type: 'object',
								properties: {
									commonjs: { type: 'boolean' },
									amd: { type: 'boolean' },
									esmodule: { type: 'boolean' },
									ignore: {
										type: 'array',
										minItems: 1,
										items: { type: 'string' },
										uniqueItems: true,
									},
									caseSensitive: { type: 'boolean', default: true },
									caseSensitiveStrict: { type: 'boolean', default: false },
								},
								additionalProperties: false,
							},
						],
					},
				},
				named: {
					meta: {
						type: 'problem',
						docs: {
							category: 'Static analysis',
							description:
								'Ensure named imports correspond to a named export in the remote file.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/named.md',
						},
						schema: [
							{
								type: 'object',
								properties: { commonjs: { type: 'boolean' } },
								additionalProperties: false,
							},
						],
					},
				},
				default: {
					meta: {
						type: 'problem',
						docs: {
							category: 'Static analysis',
							description:
								'Ensure a default export is present, given a default import.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/default.md',
						},
						schema: [],
					},
				},
				namespace: {
					meta: {
						type: 'problem',
						docs: {
							category: 'Static analysis',
							description:
								'Ensure imported namespaces contain dereferenced properties as they are dereferenced.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/namespace.md',
						},
						schema: [
							{
								type: 'object',
								properties: {
									allowComputed: {
										description:
											'If `false`, will report computed (and thus, un-lintable) references to namespace members.',
										type: 'boolean',
										default: false,
									},
								},
								additionalProperties: false,
							},
						],
					},
				},
				'no-namespace': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description: 'Forbid namespace (a.k.a. "wildcard" `*`) imports.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-namespace.md',
						},
						fixable: 'code',
						schema: [
							{
								type: 'object',
								properties: {
									ignore: {
										type: 'array',
										items: { type: 'string' },
										uniqueItems: true,
									},
								},
							},
						],
					},
				},
				export: {
					meta: {
						type: 'problem',
						docs: {
							category: 'Helpful warnings',
							description:
								'Forbid any invalid exports, i.e. re-export of the same name.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/export.md',
						},
						schema: [],
					},
				},
				'no-mutable-exports': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Helpful warnings',
							description:
								'Forbid the use of mutable exports with `var` or `let`.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-mutable-exports.md',
						},
						schema: [],
					},
				},
				extensions: {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description:
								'Ensure consistent use of file extension within the import path.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/extensions.md',
						},
						schema: {
							anyOf: [
								{
									type: 'array',
									items: [{ enum: ['always', 'ignorePackages', 'never'] }],
									additionalItems: false,
								},
								{
									type: 'array',
									items: [
										{ enum: ['always', 'ignorePackages', 'never'] },
										{
											type: 'object',
											properties: {
												pattern: {
													type: 'object',
													patternProperties: {
														'.*': {
															enum: ['always', 'ignorePackages', 'never'],
														},
													},
												},
												ignorePackages: { type: 'boolean' },
											},
										},
									],
									additionalItems: false,
								},
								{
									type: 'array',
									items: [
										{
											type: 'object',
											properties: {
												pattern: {
													type: 'object',
													patternProperties: {
														'.*': {
															enum: ['always', 'ignorePackages', 'never'],
														},
													},
												},
												ignorePackages: { type: 'boolean' },
											},
										},
									],
									additionalItems: false,
								},
								{
									type: 'array',
									items: [
										{
											type: 'object',
											patternProperties: {
												'.*': { enum: ['always', 'ignorePackages', 'never'] },
											},
										},
									],
									additionalItems: false,
								},
								{
									type: 'array',
									items: [
										{ enum: ['always', 'ignorePackages', 'never'] },
										{
											type: 'object',
											patternProperties: {
												'.*': { enum: ['always', 'ignorePackages', 'never'] },
											},
										},
									],
									additionalItems: false,
								},
							],
						},
					},
				},
				'no-restricted-paths': {
					meta: {
						type: 'problem',
						docs: {
							category: 'Static analysis',
							description:
								'Enforce which files can be imported in a given folder.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-restricted-paths.md',
						},
						schema: [
							{
								type: 'object',
								properties: {
									zones: {
										type: 'array',
										minItems: 1,
										items: {
											type: 'object',
											properties: {
												target: {
													anyOf: [
														{ type: 'string' },
														{
															type: 'array',
															items: { type: 'string' },
															uniqueItems: true,
															minLength: 1,
														},
													],
												},
												from: {
													anyOf: [
														{ type: 'string' },
														{
															type: 'array',
															items: { type: 'string' },
															uniqueItems: true,
															minLength: 1,
														},
													],
												},
												except: {
													type: 'array',
													items: { type: 'string' },
													uniqueItems: true,
												},
												message: { type: 'string' },
											},
											additionalProperties: false,
										},
									},
									basePath: { type: 'string' },
								},
								additionalProperties: false,
							},
						],
					},
				},
				'no-internal-modules': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Static analysis',
							description: 'Forbid importing the submodules of other modules.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-internal-modules.md',
						},
						schema: [
							{
								anyOf: [
									{
										type: 'object',
										properties: {
											allow: { type: 'array', items: { type: 'string' } },
										},
										additionalProperties: false,
									},
									{
										type: 'object',
										properties: {
											forbid: { type: 'array', items: { type: 'string' } },
										},
										additionalProperties: false,
									},
								],
							},
						],
					},
				},
				'group-exports': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description:
								'Prefer named exports to be grouped together in a single export declaration',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/group-exports.md',
						},
					},
				},
				'no-relative-packages': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Static analysis',
							description: 'Forbid importing packages through relative paths.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-relative-packages.md',
						},
						fixable: 'code',
						schema: [
							{
								type: 'object',
								properties: {
									commonjs: { type: 'boolean' },
									amd: { type: 'boolean' },
									esmodule: { type: 'boolean' },
									ignore: {
										type: 'array',
										minItems: 1,
										items: { type: 'string' },
										uniqueItems: true,
									},
								},
								additionalProperties: false,
							},
						],
					},
				},
				'no-relative-parent-imports': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Static analysis',
							description: 'Forbid importing modules from parent directories.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-relative-parent-imports.md',
						},
						schema: [
							{
								type: 'object',
								properties: {
									commonjs: { type: 'boolean' },
									amd: { type: 'boolean' },
									esmodule: { type: 'boolean' },
									ignore: {
										type: 'array',
										minItems: 1,
										items: { type: 'string' },
										uniqueItems: true,
									},
								},
								additionalProperties: false,
							},
						],
					},
				},
				'consistent-type-specifier-style': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description:
								'Enforce or ban the use of inline type-only markers for named imports.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/consistent-type-specifier-style.md',
						},
						fixable: 'code',
						schema: [
							{
								type: 'string',
								enum: ['prefer-inline', 'prefer-top-level'],
								default: 'prefer-inline',
							},
						],
					},
				},
				'no-self-import': {
					meta: {
						type: 'problem',
						docs: {
							category: 'Static analysis',
							description: 'Forbid a module from importing itself.',
							recommended: true,
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-self-import.md',
						},
						schema: [],
					},
				},
				'no-cycle': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Static analysis',
							description:
								'Forbid a module from importing a module with a dependency path back to itself.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-cycle.md',
						},
						schema: [
							{
								type: 'object',
								properties: {
									commonjs: { type: 'boolean' },
									amd: { type: 'boolean' },
									esmodule: { type: 'boolean' },
									ignore: {
										type: 'array',
										minItems: 1,
										items: { type: 'string' },
										uniqueItems: true,
									},
									maxDepth: {
										anyOf: [
											{
												description: 'maximum dependency depth to traverse',
												type: 'integer',
												minimum: 1,
											},
											{ enum: ['∞'], type: 'string' },
										],
									},
									ignoreExternal: {
										description: 'ignore external modules',
										type: 'boolean',
										default: false,
									},
									allowUnsafeDynamicCyclicDependency: {
										description:
											'Allow cyclic dependency if there is at least one dynamic import in the chain',
										type: 'boolean',
										default: false,
									},
								},
								additionalProperties: false,
							},
						],
					},
				},
				'no-named-default': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description: 'Forbid named default exports.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-named-default.md',
						},
						schema: [],
					},
				},
				'no-named-as-default': {
					meta: {
						type: 'problem',
						docs: {
							category: 'Helpful warnings',
							description:
								'Forbid use of exported name as identifier of default export.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-named-as-default.md',
						},
						schema: [],
					},
				},
				'no-named-as-default-member': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Helpful warnings',
							description:
								'Forbid use of exported name as property of default export.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-named-as-default-member.md',
						},
						schema: [],
					},
				},
				'no-anonymous-default-export': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description: 'Forbid anonymous values as default exports.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-anonymous-default-export.md',
						},
						schema: [
							{
								type: 'object',
								properties: {
									allowArray: {
										description:
											'If `false`, will report default export of an array',
										type: 'boolean',
									},
									allowArrowFunction: {
										description:
											'If `false`, will report default export of an arrow function',
										type: 'boolean',
									},
									allowCallExpression: {
										description:
											'If `false`, will report default export of a function call',
										type: 'boolean',
									},
									allowAnonymousClass: {
										description:
											'If `false`, will report default export of an anonymous class',
										type: 'boolean',
									},
									allowAnonymousFunction: {
										description:
											'If `false`, will report default export of an anonymous function',
										type: 'boolean',
									},
									allowLiteral: {
										description:
											'If `false`, will report default export of a literal',
										type: 'boolean',
									},
									allowObject: {
										description:
											'If `false`, will report default export of an object expression',
										type: 'boolean',
									},
									allowNew: {
										description:
											'If `false`, will report default export of a class instantiation',
										type: 'boolean',
									},
								},
								additionalProperties: false,
							},
						],
					},
				},
				'no-unused-modules': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Helpful warnings',
							description:
								'Forbid modules without exports, or exports without matching import in another module.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-unused-modules.md',
						},
						schema: [
							{
								properties: {
									src: {
										description:
											'files/paths to be analyzed (only for unused exports)',
										type: 'array',
										uniqueItems: true,
										items: { type: 'string', minLength: 1 },
									},
									ignoreExports: {
										description:
											'files/paths for which unused exports will not be reported (e.g module entry points)',
										type: 'array',
										uniqueItems: true,
										items: { type: 'string', minLength: 1 },
									},
									missingExports: {
										description: 'report modules without any exports',
										type: 'boolean',
									},
									unusedExports: {
										description: 'report exports without any usage',
										type: 'boolean',
									},
								},
								anyOf: [
									{
										properties: {
											unusedExports: { enum: [true] },
											src: { minItems: 1 },
										},
										required: ['unusedExports'],
									},
									{
										properties: { missingExports: { enum: [true] } },
										required: ['missingExports'],
									},
								],
							},
						],
					},
				},
				'no-commonjs': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Module systems',
							description:
								'Forbid CommonJS `require` calls and `module.exports` or `exports.*`.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-commonjs.md',
						},
						schema: {
							anyOf: [
								{
									type: 'array',
									items: [{ enum: ['allow-primitive-modules'] }],
									additionalItems: false,
								},
								{
									type: 'array',
									items: [
										{
											type: 'object',
											properties: {
												allowPrimitiveModules: { type: 'boolean' },
												allowRequire: { type: 'boolean' },
												allowConditionalRequire: { type: 'boolean' },
											},
											additionalProperties: false,
										},
									],
									additionalItems: false,
								},
							],
						},
					},
				},
				'no-amd': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Module systems',
							description: 'Forbid AMD `require` and `define` calls.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-amd.md',
						},
						schema: [],
					},
				},
				'no-duplicates': {
					meta: {
						type: 'problem',
						docs: {
							category: 'Style guide',
							description:
								'Forbid repeated import of the same module in multiple places.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-duplicates.md',
						},
						fixable: 'code',
						schema: [
							{
								type: 'object',
								properties: {
									considerQueryString: { type: 'boolean' },
									'prefer-inline': { type: 'boolean' },
								},
								additionalProperties: false,
							},
						],
					},
				},
				first: {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description: 'Ensure all imports appear before other statements.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/first.md',
						},
						fixable: 'code',
						schema: [
							{
								type: 'string',
								enum: ['absolute-first', 'disable-absolute-first'],
							},
						],
					},
				},
				'max-dependencies': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description:
								'Enforce the maximum number of dependencies a module can have.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/max-dependencies.md',
						},
						schema: [
							{
								type: 'object',
								properties: {
									max: { type: 'number' },
									ignoreTypeImports: { type: 'boolean' },
								},
								additionalProperties: false,
							},
						],
					},
				},
				'no-extraneous-dependencies': {
					meta: {
						type: 'problem',
						docs: {
							category: 'Helpful warnings',
							description: 'Forbid the use of extraneous packages.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-extraneous-dependencies.md',
						},
						schema: [
							{
								type: 'object',
								properties: {
									devDependencies: { type: ['boolean', 'array'] },
									optionalDependencies: { type: ['boolean', 'array'] },
									peerDependencies: { type: ['boolean', 'array'] },
									bundledDependencies: { type: ['boolean', 'array'] },
									packageDir: { type: ['string', 'array'] },
									includeInternal: { type: ['boolean'] },
									includeTypes: { type: ['boolean'] },
								},
								additionalProperties: false,
							},
						],
					},
				},
				'no-absolute-path': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Static analysis',
							description: 'Forbid import of modules using absolute paths.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-absolute-path.md',
						},
						fixable: 'code',
						schema: [
							{
								type: 'object',
								properties: {
									commonjs: { type: 'boolean' },
									amd: { type: 'boolean' },
									esmodule: { type: 'boolean' },
									ignore: {
										type: 'array',
										minItems: 1,
										items: { type: 'string' },
										uniqueItems: true,
									},
								},
								additionalProperties: false,
							},
						],
					},
				},
				'no-nodejs-modules': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Module systems',
							description: 'Forbid Node.js builtin modules.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-nodejs-modules.md',
						},
						schema: [
							{
								type: 'object',
								properties: {
									allow: {
										type: 'array',
										uniqueItems: true,
										items: { type: 'string' },
									},
								},
								additionalProperties: false,
							},
						],
					},
				},
				'no-webpack-loader-syntax': {
					meta: {
						type: 'problem',
						docs: {
							category: 'Static analysis',
							description: 'Forbid webpack loader syntax in imports.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-webpack-loader-syntax.md',
						},
						schema: [],
					},
				},
				order: {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description: 'Enforce a convention in module import order.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/order.md',
						},
						fixable: 'code',
						schema: [
							{
								type: 'object',
								properties: {
									groups: { type: 'array' },
									pathGroupsExcludedImportTypes: { type: 'array' },
									distinctGroup: { type: 'boolean', default: true },
									pathGroups: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												pattern: { type: 'string' },
												patternOptions: { type: 'object' },
												group: {
													type: 'string',
													enum: [
														'builtin',
														'external',
														'internal',
														'unknown',
														'parent',
														'sibling',
														'index',
														'object',
														'type',
													],
												},
												position: { type: 'string', enum: ['after', 'before'] },
											},
											additionalProperties: false,
											required: ['pattern', 'group'],
										},
									},
									'newlines-between': {
										enum: [
											'ignore',
											'always',
											'always-and-inside-groups',
											'never',
										],
									},
									alphabetize: {
										type: 'object',
										properties: {
											caseInsensitive: { type: 'boolean', default: false },
											order: {
												enum: ['ignore', 'asc', 'desc'],
												default: 'ignore',
											},
											orderImportKind: {
												enum: ['ignore', 'asc', 'desc'],
												default: 'ignore',
											},
										},
										additionalProperties: false,
									},
									warnOnUnassignedImports: { type: 'boolean', default: false },
								},
								additionalProperties: false,
							},
						],
					},
				},
				'newline-after-import': {
					meta: {
						type: 'layout',
						docs: {
							category: 'Style guide',
							description: 'Enforce a newline after import statements.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/newline-after-import.md',
						},
						fixable: 'whitespace',
						schema: [
							{
								type: 'object',
								properties: {
									count: { type: 'integer', minimum: 1 },
									exactCount: { type: 'boolean' },
									considerComments: { type: 'boolean' },
								},
								additionalProperties: false,
							},
						],
					},
				},
				'prefer-default-export': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description:
								'Prefer a default export if module exports a single name or multiple names.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/prefer-default-export.md',
						},
						schema: [
							{
								type: 'object',
								properties: {
									target: {
										type: 'string',
										enum: ['single', 'any'],
										default: 'single',
									},
								},
								additionalProperties: false,
							},
						],
					},
				},
				'no-default-export': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description: 'Forbid default exports.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-default-export.md',
						},
						schema: [],
					},
				},
				'no-named-export': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description: 'Forbid named exports.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-named-export.md',
						},
						schema: [],
					},
				},
				'no-dynamic-require': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Static analysis',
							description: 'Forbid `require()` calls with expressions.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-dynamic-require.md',
						},
						schema: [
							{
								type: 'object',
								properties: { esmodule: { type: 'boolean' } },
								additionalProperties: false,
							},
						],
					},
				},
				unambiguous: {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Module systems',
							description:
								'Forbid potentially ambiguous parse goal (`script` vs. `module`).',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/unambiguous.md',
						},
						schema: [],
					},
				},
				'no-unassigned-import': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description: 'Forbid unassigned imports',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-unassigned-import.md',
						},
						schema: [
							{
								type: 'object',
								properties: {
									devDependencies: { type: ['boolean', 'array'] },
									optionalDependencies: { type: ['boolean', 'array'] },
									peerDependencies: { type: ['boolean', 'array'] },
									allow: { type: 'array', items: { type: 'string' } },
								},
								additionalProperties: false,
							},
						],
					},
				},
				'no-useless-path-segments': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Static analysis',
							description:
								'Forbid unnecessary path segments in import and require statements.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-useless-path-segments.md',
						},
						fixable: 'code',
						schema: [
							{
								type: 'object',
								properties: {
									commonjs: { type: 'boolean' },
									noUselessIndex: { type: 'boolean' },
								},
								additionalProperties: false,
							},
						],
					},
				},
				'dynamic-import-chunkname': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description:
								'Enforce a leading comment with the webpackChunkName for dynamic imports.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/dynamic-import-chunkname.md',
						},
						schema: [
							{
								type: 'object',
								properties: {
									importFunctions: {
										type: 'array',
										uniqueItems: true,
										items: { type: 'string' },
									},
									webpackChunknameFormat: { type: 'string' },
								},
							},
						],
					},
				},
				'no-import-module-exports': {
					meta: {
						type: 'problem',
						docs: {
							category: 'Module systems',
							description:
								'Forbid import statements with CommonJS module.exports.',
							recommended: true,
						},
						fixable: 'code',
						schema: [
							{
								type: 'object',
								properties: { exceptions: { type: 'array' } },
								additionalProperties: false,
							},
						],
					},
				},
				'no-empty-named-blocks': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Helpful warnings',
							description: 'Forbid empty named import blocks.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-empty-named-blocks.md',
						},
						fixable: 'code',
						schema: [],
						hasSuggestions: true,
					},
				},
				'exports-last': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description: 'Ensure all exports appear after other statements.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/exports-last.md',
						},
						schema: [],
					},
				},
				'no-deprecated': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Helpful warnings',
							description:
								'Forbid imported names marked with `@deprecated` documentation tag.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/v2.29.0/docs/rules/no-deprecated.md',
						},
						schema: [],
					},
				},
				'imports-first': {
					meta: {
						type: 'suggestion',
						docs: {
							category: 'Style guide',
							description: 'Replaced by `import/first`.',
							url: 'https://github.com/import-js/eslint-plugin-import/blob/7b25c1cb95ee18acc1531002fd343e1e6031f9ed/docs/rules/imports-first.md',
						},
						fixable: 'code',
						schema: [
							{
								type: 'string',
								enum: ['absolute-first', 'disable-absolute-first'],
							},
						],
						deprecated: true,
					},
				},
			},
			configs: {
				recommended: {
					plugins: ['import'],
					rules: {
						'import/no-unresolved': 'error',
						'import/named': 'error',
						'import/namespace': 'error',
						'import/default': 'error',
						'import/export': 'error',
						'import/no-named-as-default': 'warn',
						'import/no-named-as-default-member': 'warn',
						'import/no-duplicates': 'warn',
					},
					parserOptions: { sourceType: 'module', ecmaVersion: 2018 },
				},
				errors: {
					plugins: ['import'],
					rules: {
						'import/no-unresolved': 2,
						'import/named': 2,
						'import/namespace': 2,
						'import/default': 2,
						'import/export': 2,
					},
				},
				warnings: {
					plugins: ['import'],
					rules: {
						'import/no-named-as-default': 1,
						'import/no-named-as-default-member': 1,
						'import/no-duplicates': 1,
					},
				},
				'stage-0': {
					plugins: ['import'],
					rules: { 'import/no-deprecated': 1 },
				},
				react: {
					settings: { 'import/extensions': ['.js', '.jsx'] },
					parserOptions: { ecmaFeatures: { jsx: true } },
				},
				'react-native': {
					settings: {
						'import/resolver': {
							node: {
								extensions: ['.js', '.web.js', '.ios.js', '.android.js'],
							},
						},
					},
				},
				electron: { settings: { 'import/core-modules': ['electron'] } },
				typescript: {
					settings: {
						'import/extensions': ['.ts', '.cts', '.mts', '.tsx', '.js', '.jsx'],
						'import/external-module-folders': [
							'node_modules',
							'node_modules/@types',
						],
						'import/parsers': {
							'@typescript-eslint/parser': ['.ts', '.cts', '.mts', '.tsx'],
						},
						'import/resolver': {
							node: {
								extensions: ['.ts', '.cts', '.mts', '.tsx', '.js', '.jsx'],
							},
						},
					},
					rules: { 'import/named': 'off' },
				},
			},
		},
	},
};
