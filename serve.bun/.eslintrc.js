/**
 * @typedef {import('eslint').Linter.Config} EslintConfig
 * @type {EslintConfig}
 */
module.exports = {
  root: true,
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:perfectionist/recommended-natural',
  ],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  ignorePatterns: ['**/*.js', '**/*/@generated/**/*'],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint', 'perfectionist'],
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    'no-console': 'error',
    'prettier/prettier': 'error',
    'perfectionist/sort-imports': [
      'error',
      {
        'custom-groups': {
          type: {
            bun: 'bun',
            'reflect-metadata': 'reflect-metadata',
          },
          value: {
            bun: ['bun'],
            'reflect-metadata': ['reflect-metadata'],
          },
        },
        groups: [
          'reflect-metadata',
          'side-effect',
          'type',
          'bun',
          'unknown',
          ['builtin', 'external'],
          'internal-type',
          'internal',
          ['parent-type', 'sibling-type', 'index-type'],
          ['parent', 'sibling', 'index'],
        ],
        'internal-pattern': ['@app/**'],
        'newlines-between': 'always',
        order: 'asc',
        type: 'line-length',
      },
    ],
  },
};
