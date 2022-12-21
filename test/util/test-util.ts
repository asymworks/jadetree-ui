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
