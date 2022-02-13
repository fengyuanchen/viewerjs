module.exports = {
  extends: 'stylelint-config-standard-scss',
  plugins: [
    'stylelint-order',
  ],
  rules: {
    'color-function-notation': 'legacy',
    'no-descending-specificity': null,
    'order/properties-alphabetical-order': true,
  },
};
