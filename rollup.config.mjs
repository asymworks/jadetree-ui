import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import path from 'path';

import pkg from './package.json' assert { type: 'json' };

// Library Configuration
const configs = {
  name: 'JtControls',
  files: [
    'autocomplete.ts',
    'index.ts',
  ],
  formats: ['es', 'iife'],
  default: 'es',
  pathIn: 'src',
  pathOut: 'lib',
  pathCss: 'css',
  minify: true,
  sourceMap: false,
  plugins: [
    commonjs(),
    nodeResolve(),
    typescript(),
  ],
  postcssConfig: {
    extract: true,
  },
  terserConfig: {
    /* Mangle properties starting with '_' */
    mangle: {
      properties: {
        regex: /^_/,
      },
    },
  },
  iifeFlag: '__ROLLUP_IIFE',
};

// Banner
const banner = `/*! ${configs.name ? configs.name : pkg.name} v${pkg.version} | (c) ${new Date().getFullYear()} ${pkg.author.name} | ${pkg.license} License | ${pkg.repository.url} */`;

// Generate the PostCSS Configuration for a single file
const postCssConfig = function(baseFn, minify) {
  const cssFn = `${configs.pathCss}/${baseFn}${minify ? '.min' : ''}.css`;
  const { extract, ...config } = configs.postcssConfig;
  if (typeof extract === 'boolean' && extract) {
    config['extract'] = cssFn;
  }
  return Object.assign({}, config, { minimize: !!minify });
};

// Generate the Rollup Configuration for a single file
const createInputConfig = function(file, minify) {
  const baseFn = path.basename(file.replace('.js', '').replace('.ts', ''));
  const outputs = configs.formats.map((format) => {
    const output = {
      file: `${configs.pathOut}/${baseFn}${format === configs.default ? '' : `.${format}`}${minify ? '.min' : ''}.js`,
      format,
      banner,
      sourcemap: configs.sourceMap,
    };
    if (minify) {
      output.plugins = [ terser(configs.terserConfig || {}) ];
    }
    if (format === 'iife') {
      output.name = configs.name;
      output.intro = `const ${configs.iifeFlag} = true;`;
    }
    return output;
  });

  return {
    input: `${configs.pathIn}/${file}`,
    output: outputs,
    plugins: [
      postcss(postCssConfig(baseFn, minify)),
      ...configs.plugins,
    ],
  };
};

// Generate All Rollup Configurations
const createConfigs = function() {
  return configs.files.reduce(
    (output, filename) => {
      return output.concat([
        ...[ createInputConfig(filename, false) ],
        ...( configs.minify ? [ createInputConfig(filename, true) ] : []),
      ]);
    },
    []);
};

export default createConfigs();

// console.log(JSON.stringify(createConfigs()))

/*
export default [
  {
    input: 'src/components/autocomplete.ts',
    output: [
      {
        format: 'es',
        file: './lib/autocomplete.js',
        plugins: [
        ],
      },
    ],
    plugins: [
      postcss({
        extract: 'css/autocomplete.css',
      }),
      commonjs(),
      nodeResolve(),
      typescript(),
    ],
  },
  {
    input: 'src/components/autocomplete.ts',
    output: [
      {
        format: 'es',
        file: './lib/autocomplete.min.js',
        plugins: [
        ],
      },
    ],
    plugins: [
      postcss({
        extract: 'css/autocomplete.min.css',
        minimize: true,
      }),
      commonjs(),
      nodeResolve(),
      typescript(),
      terser(),
    ],
  }
];
*/