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
/**
 * Callback Function Signature for {@link JtTokenList}
 * @param operation Set to 'add' or 'remove'
 * @param tokens    List of tokens to add or remove
 */
type JtTokenCallback = (operation: 'add' | 'remove', ...tokens: string[]) => void;
/**
 * Implementation of {@link DOMTokenList} used by custom components for user
 * defined classes on component parts. The class provides a callback function
 * which is invoked for each token `add` or `remove` operation.
 */
export declare class JtTokenList implements DOMTokenList {
    [key: number]: string;
    [Symbol.iterator](): IterableIterator<string>;
    _callback: JtTokenCallback;
    _tokens: string[];
    get length(): number;
    get value(): string;
    set value(value: string | null);
    add(...tokens: string[]): void;
    contains(token: string): boolean;
    entries(): IterableIterator<[number, string]>;
    forEach(callbackfn: (value: string, key: number, parent: DOMTokenList) => void, thisArg?: unknown): void;
    item(index: number): string;
    keys(): IterableIterator<number>;
    remove(...tokens: string[]): void;
    replace(token: string, newToken: string): boolean;
    supports(token: string): boolean;
    toggle(token: string, force?: boolean): boolean;
    values(): IterableIterator<string>;
    constructor(cb: JtTokenCallback, tokens?: string[]);
}
export {};
