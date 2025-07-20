/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'next/core-web-vitals',
  ],
  rules: {
    // React specific rules
    'react/no-unescaped-entities': 'off',
    'react/display-name': 'off',
    
    // General rules
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn',
    'eqeqeq': 'error',
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'dist/',
  ],
}