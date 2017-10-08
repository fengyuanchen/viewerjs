const babel = require('rollup-plugin-babel');
const pkg = require('./package');

const now = new Date();

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
  banner: `/*!
 * Viewer.js v${pkg.version}
 * https://github.com/${pkg.repository}
 *
 * Copyright (c) 2015-${now.getFullYear()} ${pkg.author.name}
 * Released under the ${pkg.license} license
 *
 * Date: ${now.toISOString()}
 */
`,
};
