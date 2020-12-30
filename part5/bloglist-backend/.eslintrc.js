/* eslint-disable linebreak-style */
module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    semi: [
      'error',
      'never',
    ],
    'linebreak-style': [
      'error',
      'windows',
    ],
    indent: [
      'error',
      2,
    ],
  },
}
