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

/**
 * Callback Function Signature for {@link JtTokenList}
 * @param operation Set to 'add' or 'remove'
 * @param tokens    List of tokens to add or remove
 */
type JtTokenCallback = (operation: 'add'|'remove', ...tokens: string[]) => void;

/**
 * Implementation of {@link DOMTokenList} used by custom components for user
 * defined classes on component parts. The class provides a callback function
 * which is invoked for each token `add` or `remove` operation.
 */
export class JtTokenList implements DOMTokenList {
    [key: number]: string;
    [Symbol.iterator](): IterableIterator<string> {
        return this.values();
    }

    _callback: JtTokenCallback;
    _tokens: string[];

    get length(): number {
        return this._tokens.length;
    }

    get value(): string {
        return this._tokens.join(' ');
    }

    set value(value: string|null) {
        if (!value) {
            if (this._tokens.length > 0) {
                this._callback('remove', ...this._tokens);
            }
            this._tokens = [];
        } else {
            const _tokens = (value || '').split(' ').map(s => s.trim());
            const _added = _tokens.filter(t => !this._tokens.includes(t));
            const _removed = this._tokens.filter(t => !_tokens.includes(t));
            (_added.length > 0) && this._callback('add', ..._added);
            (_removed.length > 0) && this._callback('remove', ..._removed);
        }
    }

    add(...tokens: string[]): void {
        const _tokens = tokens.filter(t => !this._tokens.includes(t));
        if (_tokens.length > 0) {
            this._tokens.push(..._tokens);
            this._callback('add', ..._tokens);
        }
    }

    contains(token: string): boolean {
        return this._tokens.includes(token);
    }

    entries(): IterableIterator<[number, string]> {
        return this._tokens.entries();
    }

    forEach(callbackfn: (value: string, key: number, parent: DOMTokenList) => void, thisArg?: unknown): void {
        const cb = callbackfn.bind(thisArg);
        for (const [key, cls] of this.entries()) {
            cb(cls, key, this);
        }
    }

    item(index: number): string {
        if (index < 0 || index >= this.length) return null;
        return this._tokens.at(index);
    }

    keys(): IterableIterator<number> {
        return this._tokens.keys();
    }

    remove(...tokens: string[]): void {
        const _tokens = tokens.filter(t => this._tokens.includes(t));
        if (_tokens.length > 0) {
            this._tokens = this._tokens.filter(t => !_tokens.includes(t));
            this._callback('remove', ..._tokens);
        }
    }

    replace(token: string, newToken: string): boolean {
        const idx = this._tokens.indexOf(token);
        if (idx === -1) return false;
        this._tokens[idx] = newToken;
        this._callback('remove', token);
        this._callback('add', newToken);
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    supports(token: string): boolean {
        return true;
    }

    toggle(token: string, force?: boolean): boolean {
        if (!this.contains(token) && (typeof force === 'undefined' || force)) {
            this.add(token);
        } else if (this.contains(token) && (typeof force === 'undefined' || !force)) {
            this.remove(token);
        }
        return this.contains(token);
    }

    values(): IterableIterator<string> {
        return this._tokens.values();
    }

    constructor(cb: JtTokenCallback, tokens?: string[]) {
        this._callback = cb;
        this._tokens = tokens || [];
    }
}
