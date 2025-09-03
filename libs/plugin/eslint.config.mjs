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
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		// Override or add rules here
		rules: {},
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		// Override or add rules here
		rules: {},
	},
	{
		files: ['**/*.js', '**/*.jsx'],
		// Override or add rules here
		rules: {},
	},
	{
		files: ['**/*.json'],
		rules: {
			'@nx/dependency-checks': [
				'warn',
				{
					ignoredDependencies: [
						'tslib',
						'ts-morph',
						'@angular-eslint/bundled-angular-compiler',
						'@nx/devkit',
						'@nx/dependency-checks',
					],
				},
			],
		},
		languageOptions: {
			parser: await import('jsonc-eslint-parser'),
		},
	},
	{
		files: ['./package.json', './generators.json'],
		rules: {
			'@nx/nx-plugin-checks': 'warn',
		},
		languageOptions: {
			parser: await import('jsonc-eslint-parser'),
		},
	},
];
