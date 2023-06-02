/*! JtControls v0.2.2 | (c) 2023 Jonathan Krauss | BSD-3-Clause License | git+https://github.com/asymworks/jadetree-ui.git */
/**
 * HTML Templating Helpers
 */
/**
 * Get a template from a string
 * https://stackoverflow.com/a/41015840
 * @param  str    The string to interpolate
 * @param  params The parameters
 * @return        The interpolated string
 */
function interpolate(str, params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${str}\`;`)(...vals);
}

export { interpolate };
