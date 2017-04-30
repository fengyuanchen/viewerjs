const babel = require('rollup-plugin-babel');

module.exports = {
  entry: 'src/js/viewer.js',
  targets: [
    {
      dest: 'dist/viewer.js',
    },
    {
      dest: 'dist/viewer.common.js',
      format: 'cjs',
    },
    {
      dest: 'dist/viewer.esm.js',
      format: 'es',
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
