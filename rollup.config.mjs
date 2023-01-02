import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

import pkg from './package.json' assert { type: 'json' };

// Library Configuration
const configs = {
  name: 'JtControls',
  files: [
    'components/autocomplete.js',
    'components/select.js',
    'index.js',
  ],
  formats: ['es', 'iife'],
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
const generateOutputConfig = function(file, minify) {
  const baseFn = file.replace('.js', '').replace('.ts', '');
  return configs.formats.map((format) => {
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
}

// Generate all Output Stanzas for a file
const generateOutputs = function(filename) {
  // Create Basic (un-minified) Outputs
  const outputs = generateOutputConfig(filename, false);
  if (!configs.minify) {
    return outputs;
  }

  // Create Minified Outputs
  const outputsMin = generateOutputConfig(filename, true);
  return [
    ...outputs,
    ...outputsMin,
  ];
}

// Generate All Rollup Configurations
const createConfigs = function() {
  return configs.files.map((file) => ({
    input: `${configs.pathIn}/${file}`,
    output: generateOutputs(file),
    plugins: configs.plugins,
  }));
};

export default createConfigs();
