import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

import pkg from './package.json' assert { type: 'json' };

// Library Configuration
const configs = {
  name: 'JtControls',
  files: [
    'components/autocomplete.js',
    'components/popupMenu.js',
    'components/select.js',
    'index.js',
  ],
  default: 'es',
  pathIn: 'lib',
  pathOut: 'dist',
  minify: true,
  sourceMap: false,
  plugins: [
    commonjs(),
    nodeResolve(),
  ],
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

// Generate the Output Stanza for a file
const generateOutputConfig = function(file, minify, formats) {
  const baseFn = file.replace('.js', '').replace('.ts', '');
  return formats.map((format) => {
    const output = {
      format,
      banner,
      sourcemap: configs.sourceMap,
    };
    if (format === 'es') {
      // Build Tree-Shakable Library
      output.dir = `${configs.pathOut}/esm`;
      output.preserveModules = true;
      output.preserveModulesRoot = 'lib';
    }
    if (format === 'iife' || format === 'umd') {
      output.file = `${configs.pathOut}/${baseFn}${format === configs.default ? '' : `.${format}`}${minify ? '.min' : ''}.js`;
      output.name = configs.name;
      output.intro = `const ${configs.iifeFlag} = true;`;

      if (minify) {
        output.plugins = [ terser(configs.terserConfig || {}) ];
      }
    }
    return output;
  });
}

// Generate all Output Stanzas for a file
const generateOutputs = function(filename, formats) {
  // Create Basic (un-minified) Outputs
  const outputs = generateOutputConfig(filename, false, formats);
  if (!configs.minify) {
    return outputs;
  }

  // Create Minified Outputs
  const outputsMin = generateOutputConfig(filename, true, formats);
  return [
    ...outputs,
    ...outputsMin,
  ];
}

// Generate All Rollup Configurations
const createConfigs = function(files, formats, externals = []) {
  return files.map((file) => {
    const output = generateOutputs(file, formats);
    return {
      input: `${configs.pathIn}/${file}`,
      output,
      plugins: configs.plugins,
      ...(
        externals ? { external: externals } : {}
      )
    };
  });
};

export default [
  ...createConfigs(configs.files, ['umd', 'iife']),
  ...createConfigs(['index.js'], ['es'], [ /node_modules/ ]),
];
