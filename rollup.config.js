const babel = require('rollup-plugin-babel');

module.exports = {
  input: 'src/js/viewer.js',
  output: [
    {
      file: 'dist/viewer.js',
      format: 'umd',
    },
    {
      file: 'dist/viewer.common.js',
      format: 'cjs',
    },
    {
      file: 'dist/viewer.esm.js',
      format: 'es',
    },
    {
      file: 'docs/js/viewer.js',
      format: 'umd',
    },
  ],
  name: 'Viewer',
  plugins: [
    babel({
      exclude: '/node_modules/**',
    }),
  ],
};
