module.exports = {
  extends: 'stylelint-config-standard-scss',
  plugins: [
    'stylelint-order',
  ],
  rules: {
    'no-descending-specificity': null,
    'order/properties-alphabetical-order': true,
  },
};
