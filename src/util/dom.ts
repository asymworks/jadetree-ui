/**
 * DOM Manipulation Helpers
 */

/** @private */
const hasDOMParser = (function() {
    if (!window.DOMParser) return false;
    try {
        const parser = new DOMParser();
        parser.parseFromString('x', 'text/html');
    } catch(err) {
        return false;
    }
    return true;
})();

/**
 * Create a DOM Element from an HTML String. If the provided HTML results in a
 * single root element, that element is returned; otherwise a `<body>` or 
 * `<div>` element is returned with the provided HTML as the `innerHTML`.
 * @param html HTML String
 * @return DOM Element 
 */
export function htmlToElement(html: string): Element {
    if (hasDOMParser) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html');
        if (doc.body.firstElementChild instanceof Element) {
            return doc.body.firstElementChild;
        }
        return doc.body;
    }

    const div = document.createElement('div');
    div.innerHTML = html;
    if (div.firstElementChild instanceof Element) return div.firstElementChild;
    return div;
}

/**
 * Find closest previous sibling matching a test
 * @param start Starting Element
 * @param test Test Function to apply to Element
 * @return Closest previous element for which the {@link test} function returns
 *      true, or `null` if no previous child elements match.
 */
export function prevSibling(start: Element, test: (el: Element) => boolean): Element | null {
    let el = start.previousElementSibling;
    while (el) {
        if (test(el)) return el;
        el = el.previousElementSibling;
    }

    return el;
}

/**
 * Find closest next sibling matching a test
 * @param start Starting Element
 * @param test Test Function to apply to Element
 * @return Closest next element for which the {@link test} function returns
 *      true, or `null` if no subsequent child elements match.
 */
export function nextSibling(start: Element, test: (el: Element) => boolean): Element | null {
    let el = start.nextElementSibling;
    while (el) {
        if (test(el)) return el;
        el = el.nextElementSibling;
    }

    return el;
}

/**
 * Boolean HTML Attribute Check Options
 */
export type BoolAttributeOptions = {
    aria?: boolean;
}

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
export function boolAttribute(el: Element, name: string, options?: BoolAttributeOptions): boolean {
    if (el && el.hasAttribute(name)) {
        // ARIA attributes must be 'true'
        if (options?.aria || name.toLowerCase().startsWith('aria-')) {
            return el.getAttribute(name)?.toLowerCase() === 'true';
        }

        // Presence of the attribute always imples true
        return true;
    }

    // Absence of the attribute always implies false
    return false;
}