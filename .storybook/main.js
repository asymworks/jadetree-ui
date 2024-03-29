const path = require('path');
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-a11y', {
    name: '@storybook/addon-docs',
    options: {
      configureJSX: true
    }
  }, '@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions', {
    name: '@storybook/addon-postcss',
    options: {
      postcssLoaderOptions: {
        implementation: require('postcss')
      }
    }
  }, '@storybook/preset-scss', 'storybook-addon-mock', '@storybook/addon-mdx-gfm'],
  framework: {
    name: '@storybook/html-webpack5',
    options: {}
  },
  docs: {
    autodocs: true
  }
};