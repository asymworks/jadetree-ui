module.exports = (ctx) => ({
  syntax: 'postcss-scss',
  plugins: {
    autoprefixer: {},
    '@csstools/postcss-sass': {},
    cssnano: ctx.env === 'production' ? {} : false,
  }
});
