/**
 * DOM Manipulation Helpers
 */
/**
 * Create a DOM Element from an HTML String. If the provided HTML results in a
 * single root element, that element is returned; otherwise a `<body>` or
 * `<div>` element is returned with the provided HTML as the `innerHTML`.
 * @param html HTML String
 * @return DOM Element
 */
export declare function htmlToElement(html: string): Element;
/**
 * Find closest previous sibling matching a test
 * @param start Starting Element
 * @param test Test Function to apply to Element
 * @return Closest previous element for which the {@link test} function returns
 *      true, or `null` if no previous child elements match.
 */
export declare function prevSibling(start: Element, test: (el: Element) => boolean): Element | null;
/**
 * Find closest next sibling matching a test
 * @param start Starting Element
 * @param test Test Function to apply to Element
 * @return Closest next element for which the {@link test} function returns
 *      true, or `null` if no subsequent child elements match.
 */
export declare function nextSibling(start: Element, test: (el: Element) => boolean): Element | null;
/**
 * Boolean HTML Attribute Check Options
 */
export type BoolAttributeOptions = {
    aria?: boolean;
};
/**
 * Check for the state of a boolean HTML attribute. This follows the HTML
 * spec where presence of the attribute implies `true` regardless of the
 * attribute's value, except if the {@link options.aria} flag is set, or if
 * the attribute name starts with `aria-`, in which case the attribute value
 * also must be exactly `true`.
 * @param el Element
 * @param name Attribute Name
 * @param options Comparison Options
 * @param options.aria Require the attribute to be 'true' or 'false'
 */
export declare function boolAttribute(el: Element, name: string, options?: BoolAttributeOptions): boolean;
