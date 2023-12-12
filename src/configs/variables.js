// FILE GENERATED WITH SCRIPT
/** @type {import('eslint').Linter.FlatConfig} */
export default {
	name: 'airbnb:variables',
	rules: {
		'init-declarations': 'off',
		'no-delete-var': 'error',
		'no-label-var': 'error',
		'no-restricted-globals': [
			'error',
			{
				name: 'isFinite',
				message:
					'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
			},
			{
				name: 'isNaN',
				message:
					'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
			},
			'addEventListener',
			'blur',
			'close',
			'closed',
			'confirm',
			'defaultStatus',
			'defaultstatus',
			'event',
			'external',
			'find',
			'focus',
			'frameElement',
			'frames',
			'history',
			'innerHeight',
			'innerWidth',
			'length',
			'location',
			'locationbar',
			'menubar',
			'moveBy',
			'moveTo',
			'name',
			'onblur',
			'onerror',
			'onfocus',
			'onload',
			'onresize',
			'onunload',
			'open',
			'opener',
			'opera',
			'outerHeight',
			'outerWidth',
			'pageXOffset',
			'pageYOffset',
			'parent',
			'print',
			'removeEventListener',
			'resizeBy',
			'resizeTo',
			'screen',
			'screenLeft',
			'screenTop',
			'screenX',
			'screenY',
			'scroll',
			'scrollbars',
			'scrollBy',
			'scrollTo',
			'scrollX',
			'scrollY',
			'self',
			'status',
			'statusbar',
			'stop',
			'toolbar',
			'top',
		],
		'no-shadow': 'error',
		'no-shadow-restricted-names': 'error',
		'no-undef': 'error',
		'no-undef-init': 'error',
		'no-undefined': 'off',
		'no-unused-vars': [
			'error',
			{ vars: 'all', args: 'after-used', ignoreRestSiblings: true },
		],
		'no-use-before-define': [
			'error',
			{ functions: true, classes: true, variables: true },
		],
	},
};
