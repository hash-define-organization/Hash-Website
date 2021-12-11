module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    'no-eval': 'off',
    'no-undef': 'off',
    'valid-jsdoc': 'off',
    //remove trailing spaces
    'no-trailing-spaces': ['error', 'remove'],
    //remove trailing commas
    'comma-dangle': 'off',
    //remove spaces before function parentheses
    'space-before-function-paren': ['error', 'never'],
    // braced style
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    //skip blank lines
    'no-multiple-empty-lines': 'true',
    //indent error 4
    'indent': ['error', 4],
  }
};
