module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2018, // 최신 문법 지원
    sourceType: 'module', // 모듈 시스템 사용시
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'jest'],
  rules: {'react/react-in-jsx-scope': 'off'},
  settings: {},
};
