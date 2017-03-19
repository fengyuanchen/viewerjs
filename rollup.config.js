const babel = require('rollup-plugin-babel');

module.exports = {
  entry: 'src/js/viewer.js',
  targets: [
    {
      dest: 'dist/viewer.js',
    },
    {
      dest: 'docs/js/viewer.js',
    },
  ],
  format: 'umd',
  moduleName: 'Viewer',
  plugins: [
    babel({
      exclude: '/node_modules/**',
    }),
  ],
};
