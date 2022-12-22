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
export function interpolate(str, params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${str}\`;`)(...vals);
}
