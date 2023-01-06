/** Test Utility Functions */

/**
 * Wait until an attribute is set on a DOM Element
 * @param el    Element Reference
 * @param attr  Attribute Name
 * @returns     Promise that resolves to the attribute value or null if the
 *   attribute was removed.
 */
export function waitForAttr(el: HTMLElement, attr: string): Promise<string|null> {
    return new Promise<string|null>((resolve) => {
        if (el.hasAttribute(attr)) resolve(el.getAttribute(attr));
        const obs = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.attributeName === attr) {
                    resolve(el.getAttribute(attr));
                    obs.disconnect();
                }
            }
        });
        obs.observe(el, { attributes: true });
    });
}

/**
 * Wait until an attribute is removed from a DOM Element
 * @param el    Element Reference
 * @param attr  Attribute Name
 * @returns     Promise that resolves when the attribute has been removed
 */
export function waitForRemovedAttr(el: HTMLElement, attr: string): Promise<void> {
    return new Promise<void>((resolve) => {
        if (!el.hasAttribute(attr)) resolve();
        const obs = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.attributeName === attr && !el.hasAttribute(attr)) {
                    resolve();
                    obs.disconnect();
                }
            }
        });
        obs.observe(el, { attributes: true });
    });
}

/**
 * Wait until a selector is available in the DOM
 * @param selectors Selector Query
 * @returns         Promise that resolves when the selector is available
 */
export function waitForSelector(selectors: string): Promise<void> {
    return new Promise<void>((resolve) => {
        if (document.querySelector(selectors)) resolve();
        const obs = new MutationObserver((mutations) => {
            for (const m of mutations) {
                for (const n of m.addedNodes) {
                    if (n instanceof HTMLElement && n.matches(selectors)) {
                        resolve();
                        obs.disconnect();
                    }
                }
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    });
}
