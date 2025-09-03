import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import baseConfig from '../../eslint.config.mjs';
const compat = new FlatCompat({
	baseDirectory: dirname(fileURLToPath(import.meta.url)),
	recommendedConfig: js.configs.recommended,
});

export default [
	{
		ignores: ['**/dist'],
	},
	...baseConfig,
	...compat
		.config({
			extends: [
				'plugin:@nx/angular',
				'plugin:@angular-eslint/template/process-inline-templates',
			],
		})
		.map((config) => ({
			...config,
			files: ['**/*.ts'],
			rules: {
				...config.rules,
				'@angular-eslint/directive-class-suffix': 0,
				'@angular-eslint/component-class-suffix': 0,
				'@angular-eslint/no-input-rename': 0,
				'@typescript-eslint/no-explicit-any': 0,
				'@typescript-eslint/no-namespace': 0,
				'@typescript-eslint/ban-types': [
					'error',
					{
						types: {
							Function: false,
							object: false,
						},
						extendDefaults: true,
					},
				],
			},
		})),
	...compat
		.config({
			extends: ['plugin:@nx/angular-template'],
		})
		.map((config) => ({
			...config,
			files: ['**/*.html'],
			excludedFiles: ['*inline-template-*.component.html'],
			rules: {
				...config.rules,
			},
		})),
	{
		files: ['**/*.json'],
		rules: {
			'@nx/dependency-checks': [
				'error',
				{
					ignoredDependencies: [
						'tslib',
						'@angular/common',
						'@angular/core',
						'@use-gesture/vanilla',
						'rxjs',
						'@nx/devkit',
						'nx',
						'ts-morph',
						'@angular-eslint/bundled-angular-compiler',
					],
				},
			],
		},
		languageOptions: {
			parser: await import('jsonc-eslint-parser'),
		},
	},
	{
		files: ['**/*.ts'],
		rules: {
			'@angular-eslint/prefer-standalone': 'off',
		},
	},
];
