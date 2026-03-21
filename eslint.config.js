import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    ignores: ['src/mockServiceWorker.js', 'src/main.js', 'dist/**', 'vendors/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.js', '*.js', 'mocker/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        FormData: 'readonly',
        IntersectionObserver: 'readonly',
        CustomEvent: 'readonly',
        MutationObserver: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        AbortController: 'readonly',
        ReadableStream: 'readonly',
        fetch: 'readonly',
      },
    },
    rules: {
      'max-len': ['error', {code: 120}],
      'no-console': 'warn',
      'no-unused-vars': 'error',
      'prefer-const': 'error',
    },
  },
];
