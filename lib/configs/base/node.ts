/** @file GENERATED WITH SCRIPT */
import eslintPluginN from 'eslint-plugin-n';
import type { FlatConfig, ESLintPlugin } from '../../../src/globalTypes.ts';

export default {
	name: 'airbnb:node',
	plugins: {
		node: eslintPluginN as unknown as ESLintPlugin,
	},
	languageOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		parserOptions: {
			ecmaFeatures: {
				globalReturn: true,
			},
		},
		globals: {
			__dirname: false,
			__filename: false,
			AbortController: false,
			AbortSignal: false,
			atob: false,
			Blob: false,
			BroadcastChannel: false,
			btoa: false,
			Buffer: false,
			ByteLengthQueuingStrategy: false,
			clearImmediate: false,
			clearInterval: false,
			clearTimeout: false,
			CompressionStream: false,
			console: false,
			CountQueuingStrategy: false,
			crypto: false,
			Crypto: false,
			CryptoKey: false,
			CustomEvent: false,
			DecompressionStream: false,
			DOMException: false,
			Event: false,
			EventTarget: false,
			exports: true,
			fetch: false,
			File: false,
			FormData: false,
			global: false,
			Headers: false,
			Iterator: false,
			MessageChannel: false,
			MessageEvent: false,
			MessagePort: false,
			module: false,
			navigator: false,
			Navigator: false,
			performance: false,
			Performance: false,
			PerformanceEntry: false,
			PerformanceMark: false,
			PerformanceMeasure: false,
			PerformanceObserver: false,
			PerformanceObserverEntryList: false,
			PerformanceResourceTiming: false,
			process: false,
			queueMicrotask: false,
			ReadableByteStreamController: false,
			ReadableStream: false,
			ReadableStreamBYOBReader: false,
			ReadableStreamBYOBRequest: false,
			ReadableStreamDefaultController: false,
			ReadableStreamDefaultReader: false,
			Request: false,
			require: false,
			Response: false,
			setImmediate: false,
			setInterval: false,
			setTimeout: false,
			structuredClone: false,
			SubtleCrypto: false,
			TextDecoder: false,
			TextDecoderStream: false,
			TextEncoder: false,
			TextEncoderStream: false,
			TransformStream: false,
			TransformStreamDefaultController: false,
			URL: false,
			URLSearchParams: false,
			WebAssembly: false,
			WebSocket: false,
			WritableStream: false,
			WritableStreamDefaultController: false,
			WritableStreamDefaultWriter: false,
		},
	},
	rules: {
		'node/callback-return': 'off',
		'node/global-require': 'error',
		'node/handle-callback-err': 'off',
		'node/no-mixed-requires': ['off', false],
		'node/no-new-require': 'error',
		'node/no-path-concat': 'error',
		'node/no-process-env': 'off',
		'node/no-process-exit': 'off',
		'node/no-sync': 'off',
	},
} satisfies FlatConfig;
