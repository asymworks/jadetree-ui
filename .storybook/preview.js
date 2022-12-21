export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  a11y: {
    config: {
      rules: [
        {
          // This tells Axe to run the 'autocomplete-valid' rule on selectors
          // that match '*:not([autocomplete="off--jt-controls"])' (all elements
          // except [autocomplete="off--jt-controls"]).
          // 
          // This is the safest way of ignoring a violation across all stories,
          // as Axe will only ignore very specific elements and keep reporting
          // violations on other elements of this rule.
          id: 'autocomplete-valid',
          selector: '*:not([autocomplete="off--jt-controls"])',
        },
      ],
    },
  },
}