import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies);

export default {
  input: './index.js',
  plugins: [
    babel({
      babelrc: false,
      presets: [['@babel/env', { modules: false }]],
      plugins: [
        'transform-class-properties',
        // "transform-object-rest-spread",
        '@babel/plugin-transform-destructuring',
        '@babel/plugin-transform-spread',
        '@babel/plugin-transform-arrow-functions',
        'syntax-object-rest-spread',
      ],
      comments: true,
    }),
    nodeResolve({
      jsnext: true,
    }),
  ],
  external,
  output: [
    {
      file: pkg.rolledup,
      format: 'umd',
      sourcemap: true,
      strict: false,
      exports: 'named',
      name: 'reduxrestfetcher',
    },
  ],
};
