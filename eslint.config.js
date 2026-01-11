import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default [
    {
        ignores: ['node_modules/', 'dist/', 'build/', '*.log', '.DS_Store']
    },
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                browser: true,
                document: 'readonly',
                window: 'readonly',
                fetch: 'readonly',
                setTimeout: 'readonly',
                requestAnimationFrame: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                ResizeObserver: 'readonly'
            }
        },
        rules: {
            ...js.configs.recommended.rules,
            ...prettierConfig.rules,
            'no-unused-vars': 'error',
            'no-undef': 'off',
            'no-console': 'error',
            eqeqeq: ['error', 'always'],
            'no-var': 'error',
            'prefer-const': 'error',
            'no-sparse-arrays': 'error',
            'no-trailing-spaces': 'error',
            'no-multi-spaces': 'error',
            'consistent-return': 'error',
            'no-dupe-else-if': 'error',
            'no-else-return': 'error',
            'no-floating-decimal': 'error',
            'no-implicit-coercion': 'error',
            'no-new-wrappers': 'error',
            'no-proto': 'error',
            'no-return-assign': 'error',
            yoda: 'error'
        }
    }
];
