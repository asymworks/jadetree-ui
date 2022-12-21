const path = require('path');
module.exports = {
  core: {
    builder: "webpack5"
  },
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
    "storybook-addon-mock",
    "storybook-mobile",
  ],
  framework: "@storybook/html",
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.s(a|c)ss$/,
      use: ["style-loader", "css-loader", "postcss-loader"],
      include: path.resolve(__dirname, "../"),
    });
    return config;
  }
}
