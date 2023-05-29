/*! JtControls v0.1.21 | (c) 2023 Jonathan Krauss | BSD-3-Clause License | git+https://github.com/asymworks/jadetree-ui.git */
var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var qinu_minExports = {};
var qinu_min = {
  get exports(){ return qinu_minExports; },
  set exports(v){ qinu_minExports = v; },
};

(function (module, exports) {
	!function(t,n){module.exports=n();}(commonjsGlobal,function(){var t={length:32,template:"%qinu%",dict:"1234567890abcdefghijklmnopqrstuvwxyz",random:!1},n=function(t,e){if(!t.length)return "";var r=e.indexOf(t.slice(-1));return r+1<e.length?t.slice(0,-1)+e[r+1]:n(t.slice(0,-1),e)+e[0]},e=function(t,n,r){if(void 0===r&&(r=""),r.length>=n)return r;var i=t[Math.floor(Math.random()*t.length)];return e(t,n,r+i)},r=function(t,n,e){return e.reduce(function(t,n,e){return t.replace(new RegExp("%arg\\["+e+"\\]%","g"),n)},t.replace(/%qinu%/g,n))},i=function(n){return n||0===n?"object"!=typeof n&&(n={length:+n}):n={},(n=Object.assign({},t,n)).dict&&(n.dict=n.dict.split("").sort().filter(function(t,n,e){return e[n-1]!==t}).join("")),n},o=function(){};function c(t,n){var c=this instanceof o?t:i(t),u=c.dict,f=c.length,a=c.template,s=c.args,l=c.random;n instanceof Array||(n=Array.prototype.slice.call(arguments,1)),s instanceof Array&&(n=s.concat(n));var d=!l&&this instanceof o?this.next(u,f):e(u,f);return r(a,d,n)}return o.prototype.next=function(t,r){var i=this.key||e(t,r);return this.key=n(i,t),this.key},c.create=function(t){return c.bind(new o,i(t))},c});
	
} (qinu_min));

var qinu = qinu_minExports;

/** Unique Id Generator */
/** @private Item UID Generator */
const uid = qinu.create({
    length: 6,
    template: "%arg[0]%-%qinu%"
});

/**
 * DOM Manipulation Helpers
 */
/** @private */
const hasDOMParser = (function () {
    if (!window.DOMParser)
        return false;
    try {
        const parser = new DOMParser();
        parser.parseFromString('x', 'text/html');
    }
    catch (err) {
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
function htmlToElement(html) {
    if (hasDOMParser) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        if (doc.body.firstElementChild instanceof Element) {
            return doc.body.firstElementChild;
        }
        return doc.body;
    }
    const div = document.createElement('div');
    div.innerHTML = html;
    if (div.firstElementChild instanceof Element)
        return div.firstElementChild;
    return div;
}
/**
 * Find closest previous sibling matching a test
 * @param start Starting Element
 * @param test Test Function to apply to Element
 * @return Closest previous element for which the {@link test} function returns
 *      true, or `null` if no previous child elements match.
 */
function prevSibling(start, test) {
    let el = start.previousElementSibling;
    while (el) {
        if (test(el))
            return el;
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
function nextSibling(start, test) {
    let el = start.nextElementSibling;
    while (el) {
        if (test(el))
            return el;
        el = el.nextElementSibling;
    }
    return el;
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
function boolAttribute(el, name, options) {
    var _a;
    if (el && el.hasAttribute(name)) {
        // ARIA attributes must be 'true'
        if ((options === null || options === void 0 ? void 0 : options.aria) || name.toLowerCase().startsWith('aria-')) {
            return ((_a = el.getAttribute(name)) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'true';
        }
        // Presence of the attribute always imples true
        return true;
    }
    // Absence of the attribute always implies false
    return false;
}
/**
 * Implementation of {@link DOMTokenList} used by custom components for user
 * defined classes on component parts. The class provides a callback function
 * which is invoked for each token `add` or `remove` operation.
 */
class JtTokenList {
    [Symbol.iterator]() {
        return this.values();
    }
    get length() {
        return this._tokens.length;
    }
    get value() {
        return this._tokens.join(' ');
    }
    set value(value) {
        if (!value) {
            if (this._tokens.length > 0) {
                this._callback('remove', ...this._tokens);
            }
            this._tokens = [];
        }
        else {
            const _tokens = (value || '').split(' ').map(s => s.trim());
            const _added = _tokens.filter(t => !this._tokens.includes(t));
            const _removed = this._tokens.filter(t => !_tokens.includes(t));
            (_added.length > 0) && this._callback('add', ..._added);
            (_removed.length > 0) && this._callback('remove', ..._removed);
        }
    }
    add(...tokens) {
        const _tokens = tokens.filter(t => !this._tokens.includes(t));
        if (_tokens.length > 0) {
            this._tokens.push(..._tokens);
            this._callback('add', ..._tokens);
        }
    }
    contains(token) {
        return this._tokens.includes(token);
    }
    entries() {
        return this._tokens.entries();
    }
    forEach(callbackfn, thisArg) {
        const cb = callbackfn.bind(thisArg);
        for (const [key, cls] of this.entries()) {
            cb(cls, key, this);
        }
    }
    item(index) {
        if (index < 0 || index >= this.length)
            return null;
        return this._tokens.at(index);
    }
    keys() {
        return this._tokens.keys();
    }
    remove(...tokens) {
        const _tokens = tokens.filter(t => this._tokens.includes(t));
        if (_tokens.length > 0) {
            this._tokens = this._tokens.filter(t => !_tokens.includes(t));
            this._callback('remove', ..._tokens);
        }
    }
    replace(token, newToken) {
        const idx = this._tokens.indexOf(token);
        if (idx === -1)
            return false;
        this._tokens[idx] = newToken;
        this._callback('remove', token);
        this._callback('add', newToken);
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    supports(token) {
        return true;
    }
    toggle(token, force) {
        if (!this.contains(token) && (typeof force === 'undefined' || force)) {
            this.add(token);
        }
        else if (this.contains(token) && (typeof force === 'undefined' || !force)) {
            this.remove(token);
        }
        return this.contains(token);
    }
    values() {
        return this._tokens.values();
    }
    constructor(cb, tokens) {
        this._callback = cb;
        this._tokens = tokens || [];
    }
}

/**
 * Jade Tree ListBox Module
 * @module components/jt-combobox
 */
/** Item UID Helper */
const _itemIdGenerator = (id) => uid(`${id}-item`);
/** @private Default List Item Rendering Template */
const defaultItemTemplate = (item) => {
    if (item.searchRegex && item.label && !item.empty) {
        return item.label.replace(item.searchRegex, '<mark>$&</mark>');
    }
    else if (item.creating) {
        return `Press enter to create <mark>${item.searchString}</mark>`;
    }
    else if (item.empty) {
        if (item.searchString || item.label) {
            return `No Items Found`;
        }
        else {
            return 'No Items';
        }
    }
    return item.label || '';
};
/** @private Default Header Rendering Template */
const defaultHeaderTemplate = (item) => item.label || '';
/** @private Default List Box Options */
const _defaultOptions = {
    canSelect: true,
    cursorTimeout: 150,
    filterRegex: (search) => new RegExp(`\\b(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i'),
    pageSize: 10,
    type: 'single',
};
/**
 * List Box Widget
 */
class JtListBox {
    /** @private */
    _adjustScroll() {
        if (!this._focused)
            return;
        const hlEl = this._root.querySelector(`#${this._focused}`);
        if (hlEl) {
            hlEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    /** @private */
    _createDom(items) {
        const els = `<ul class="jt-listbox" role="listbox" id="${this._id}" data-type="${this._options.type}"></ul>`;
        this._root = htmlToElement(els);
        this._root.classList.add(...this._listClassList.values());
        if (typeof this._options.tabIndex === 'number') {
            this._root.setAttribute('tabindex', `${this._options.tabIndex}`);
        }
        // Add Items
        if (items instanceof HTMLElement) {
            for (const option of items.children) {
                if (option instanceof HTMLOptionElement ||
                    option instanceof HTMLOptGroupElement) {
                    // Skip placeholder items on initial create
                    if (option.dataset.role === 'placeholder')
                        continue;
                    this.add(option);
                }
                else if (option.nodeType !== 3) {
                    console.warn(`Unexpected element ${option.nodeName.toLowerCase()} in <${items.nodeName.toLowerCase()}>`);
                }
            }
        }
        else if (Array.isArray(items)) {
            items.forEach((option) => this.add(option));
        }
        else {
            console.error(`Unexpected type "${typeof items}" provided to _createDom`, items);
        }
        // Add Empty List Placeholder
        const emptyEls = `<li class="jt-listbox__item" id="${this._id}-empty" data-empty="true" aria-hidden="true" hidden="true"></li>`;
        const emptyEl = htmlToElement(emptyEls);
        emptyEl.classList.add(...this._itemClassList.values());
        if (this._options.canCreate) {
            emptyEl.setAttribute('role', 'option');
        }
        else {
            emptyEl.setAttribute('role', 'presentation');
        }
        this._renderItem(emptyEl);
        this._root.append(emptyEl);
        this._updateItems();
        return this._root;
    }
    /** @private */
    _createGroup(item, replacing = false) {
        const key = item.key ? item.key : _itemIdGenerator(this._id);
        if (document.querySelector(`#${key}`) && !replacing) {
            console.error(`An element with key ${key} already exists.`);
        }
        const { label, group, disabled, data } = item;
        if (!label) {
            console.warn('Label for <optgroup> is empty');
        }
        const els = `
<li class="jt-listbox__group" id="${key}">
    <ul role="group" aria-labelledby="${key}-hdr">
        <li role="presentation" class="jt-listbox__item jt-listbox__item--header" data-label="${label}" id="${key}-hdr"></li>
    </ul>
</li>`;
        const el = htmlToElement(els);
        el.classList.add(...this._groupClassList.values());
        Object.keys(data || {}).length &&
            (el.dataset.itemData = JSON.stringify(data));
        if (disabled) {
            el.setAttribute('aria-disabled', 'true');
        }
        const ul = el.querySelector('ul[role="group"]');
        if (!ul)
            throw new Error('_createGroup did not render a ul[role=group]');
        const hdr = el.querySelector('li[role=presentation]');
        hdr.classList.add(...this._headerClassList.values());
        if (!hdr)
            throw new Error('_createGroup did not render a li[role=presentation]');
        // Add Header Data and Render
        hdr.dataset.groupId = key;
        hdr.dataset.itemData = JSON.stringify(data);
        this._renderItem(hdr);
        // Render Group Items
        group === null || group === void 0 ? void 0 : group.forEach((child) => {
            if (child.group) {
                console.error('Nested option groups are not allowed');
            }
            else {
                ul.append(this._createOption(child));
            }
        });
        // Return Group Item
        return el;
    }
    /** @private */
    _createOption(item, replacing = false) {
        const key = item.key ? item.key : _itemIdGenerator(this._id);
        if (document.querySelector(`#${key}`) && !replacing) {
            console.error(`An element with key ${key} already exists.`);
        }
        const { label, value, disabled, separator, data } = item;
        if (separator) {
            const els = `<li class="jt-listbox__item" id="${key}" role="separator"></li>`;
            const el = htmlToElement(els);
            el.classList.add(...this._itemClassList.values());
            el.dataset.itemData = JSON.stringify(data);
            this._renderItem(el);
            return el;
        }
        if (!label && !value) {
            console.warn('Neither label nor value was specified for <option>');
        }
        if (this._root.querySelector(`[data-value="${value || label}"]`) && !replacing) {
            console.warn(`An element with value ${value || label} already exists.`);
        }
        const els = `<li class="jt-listbox__item" id="${key}" data-value="${value || label}" data-label="${label || value}" role="option"></li>`;
        const el = htmlToElement(els);
        el.classList.add(...this._itemClassList.values());
        Object.keys(data || {}).length &&
            (el.dataset.itemData = JSON.stringify(data));
        if (data && data.searchLabel) {
            el.dataset.searchLabel = data.searchLabel;
        }
        if (disabled) {
            el.setAttribute('aria-disabled', 'true');
        }
        this._renderItem(el);
        return el;
    }
    /** @private */
    _cursorMove(id) {
        this._cursorMoving = true;
        this._setHover();
        this._setFocus(id);
        this._adjustScroll();
        setTimeout(() => {
            this._cursorMoving = false;
        }, this._options.cursorTimeout);
    }
    /** @private */
    _deselect(id) {
        if (!id || !this._isSelected(id))
            return;
        this._selected = this._selected.filter((key) => key !== id);
        const el = this._root.querySelector(`#${id}`);
        if (el) {
            el.removeAttribute('aria-checked');
        }
    }
    /** @private */
    _elementChanged(mutations) {
        for (const mutation of mutations) {
            let target = mutation.target;
            if (mutation.type === 'characterData') {
                target = mutation.target.parentElement;
            }
            if (!(target instanceof HTMLElement))
                return;
            if (target.getAttribute('data-jt-list-box') === this._id) {
                // Handle Added and Removed <option> and <optgroup> Elements
                for (const el of mutation.addedNodes) {
                    if (el instanceof HTMLOptGroupElement ||
                        el instanceof HTMLOptionElement) {
                        const beforeEl = nextSibling(el, (el) => el instanceof HTMLElement &&
                            el.hasAttribute('data-key'));
                        if (beforeEl instanceof HTMLElement) {
                            this.add(el, beforeEl.dataset.key);
                        }
                        else {
                            this.add(el, null);
                        }
                    }
                }
                for (const el of mutation.removedNodes) {
                    if (el instanceof HTMLElement &&
                        el.hasAttribute('data-key')) {
                        this.remove(el.dataset.key);
                    }
                }
            }
            else if (mutation.target instanceof HTMLOptionElement ||
                mutation.target instanceof HTMLOptGroupElement) {
                // Handle Changed <option> and <optgroup> Elements
                const key = target.getAttribute('data-key');
                if (!key)
                    continue;
                const oldLI = this._root.querySelector(`#${key}`);
                if (!oldLI)
                    continue;
                const newItem = this._elementToItemData(mutation.target, false);
                const newLI = mutation.target instanceof HTMLOptGroupElement
                    ? this._createGroup(newItem, true)
                    : this._createOption(newItem, true);
                this._root.replaceChild(newLI, oldLI);
                newLI.id = key;
            }
        }
    }
    /** @private */
    _elementToItemData(element, watch = true) {
        var _a;
        const disabled = element.disabled;
        const key = element.dataset.key
            ? element.dataset.key
            : _itemIdGenerator(this._id);
        if (watch && this._observer) {
            element.dataset.key = key;
            this._observer.observe(element, {
                attributes: true,
                characterData: element.nodeName === 'OPTION',
                childList: element.nodeName === 'OPTGROUP',
                subtree: false,
            });
        }
        if (element instanceof HTMLOptGroupElement) {
            const label = element.dataset.label
                ? element.dataset.label
                : element.label.trim();
            const group = Array.from(element.querySelectorAll('option'))
                .map((el) => this._elementToItemData(el, watch))
                .filter((el) => el !== null);
            return { key, label, group, disabled, data: element.dataset };
        }
        else if (element.dataset.role === 'separator') {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const data = (({ key, label, role, ...rest }) => rest)(element.dataset);
            return { key, disabled, separator: true, data };
        }
        else {
            const value = element.value;
            const label = element.dataset.label
                ? element.dataset.label
                : element.label
                    ? element.label
                    : ((_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const data = (({ key, label, role, ...rest }) => rest || {})(element.dataset);
            return {
                key,
                label: label || value,
                value: value || label,
                disabled,
                selected: boolAttribute(element, 'selected'),
                data,
            };
        }
    }
    /** @private */
    _isSelectable(el) {
        return (el.getAttribute('role') === 'option' &&
            !boolAttribute(el, 'aria-disabled'));
    }
    /** @private */
    _isSelected(id) {
        return this._selected.indexOf(id) !== -1;
    }
    /** @private */
    _labelForId(id) {
        const el = this._root.querySelector(`#${id}`);
        if (el instanceof HTMLElement) {
            return el.dataset.label;
        }
        return undefined;
    }
    /** @private */
    _onClick(ev) {
        const el = ev.target;
        if (el && el instanceof HTMLElement && this._isSelectable(el)) {
            const activateEvt = new CustomEvent('item:click', {
                bubbles: true,
                detail: {
                    mouseEvent: ev,
                    value: el.dataset.value,
                },
            });
            this._root.dispatchEvent(activateEvt);
        }
    }
    /** @private */
    _onPointerEnter(ev) {
        const el = ev.target;
        if (el &&
            el instanceof HTMLElement &&
            this._isSelectable(el) &&
            !this._cursorMoving) {
            this._setFocus();
            this._setHover(el.id);
        }
    }
    /** @private */
    _onPointerLeave(ev) {
        const el = ev.target;
        if (el &&
            el instanceof HTMLElement &&
            el.matches('.jt-hover') &&
            !this._cursorMoving) {
            this._setFocus();
            this._setHover();
        }
    }
    /** @private */
    _renderData(li) {
        var _a;
        const item = {
            key: li.id || '',
            value: li.dataset.value,
            label: li.dataset.label,
            groupLabel: li.dataset.groupLabel,
            searchRegex: this._regex || undefined,
            searchString: this._filter || undefined,
            type: this._options.type || 'single',
            data: {},
        };
        try {
            item.data = JSON.parse(li.dataset.itemData || '{}');
        }
        catch (err) {
            /* pass */
        }
        const role = (_a = li.getAttribute('role')) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (role === 'option') {
            item.disabled = boolAttribute(li, 'aria-disabled');
            item.focused = this._focused === li.id;
        }
        else if (role === 'separator') {
            item.separator = true;
        }
        else if (li.dataset.empty === 'true') {
            item.creating = this._options.canCreate;
            item.empty = true;
        }
        return item;
    }
    /** @private */
    _renderItem(li) {
        var _a;
        let template;
        const item = this._renderData(li);
        const role = (_a = li.getAttribute('role')) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (role === 'option' || role === 'separator' || li.dataset.empty === 'true') {
            template = this._itemTemplate || defaultItemTemplate;
        }
        else if (role === 'presentation') {
            template = this._headerTemplate || defaultHeaderTemplate;
        }
        if (template) {
            li.innerHTML = template(item);
        }
        else {
            li.textContent = item.label || '';
        }
    }
    /** @private */
    _select(id) {
        if (!id || this._isSelected(id))
            return;
        if (this._options.type === 'multiple') {
            const el = this._root.querySelector(`#${id}`);
            if (el instanceof HTMLElement) {
                this._selected.push(id);
                el.setAttribute('aria-checked', 'true');
            }
        }
        else if (this._options.type === 'single') {
            this._root.querySelectorAll('[role=option]').forEach((el) => {
                el.removeAttribute('aria-checked');
                el.removeAttribute('aria-selected');
            });
            if (id === null) {
                this._selected = [];
            }
            else {
                const el = this._root.querySelector(`#${id}`);
                if (el) {
                    this._selected = [id];
                    el.setAttribute('aria-selected', 'true');
                }
            }
        }
    }
    /** @private */
    _setFocus(id) {
        const cur = this._root.querySelector('.jt-focused');
        const next = id ? this._root.querySelector(`#${id}`) : null;
        if (id && cur && cur.id === id)
            return;
        if (cur) {
            cur.dispatchEvent(new FocusEvent('item:focusout', {
                bubbles: true,
                relatedTarget: next,
            }));
            cur.classList.remove('jt-focused');
            this._focused = '';
            this._renderItem(cur);
        }
        if (next instanceof HTMLElement && this._isSelectable(next)) {
            next.classList.add('jt-focused');
            next.dispatchEvent(new FocusEvent('item:focusin', {
                bubbles: true,
                relatedTarget: cur,
            }));
            this._focused = id;
            this._renderItem(next);
        }
    }
    /** @private */
    _setHover(id) {
        const cur = this._root.querySelector('.jt-hover');
        const next = id ? this._root.querySelector(`#${id}`) : null;
        if (id && cur && cur.id === id)
            return;
        if (cur) {
            cur.classList.remove('jt-hover');
            this._hover = '';
            this._renderItem(cur);
        }
        if (next instanceof HTMLElement && this._isSelectable(next)) {
            next.classList.add('jt-hover');
            this._hover = id;
            this._renderItem(next);
        }
    }
    /** @private */
    _updateItems() {
        let anyFound = false;
        this._root.querySelectorAll('[role=option]').forEach((opt) => {
            if (!(opt instanceof HTMLElement))
                return;
            const label = opt.dataset.searchLabel
                ? opt.dataset.searchLabel
                : opt.dataset.label;
            // Hide elements that do not match the search criteria
            if (label && this._filter && label.match(this._regex) === null) {
                opt.setAttribute('aria-hidden', 'true');
                opt.setAttribute('hidden', 'true');
            }
            else {
                opt.removeAttribute('aria-hidden');
                opt.removeAttribute('hidden');
                anyFound = true;
            }
            this._renderItem(opt);
        });
        // Hide Separators and Empty Group Headers
        const testFn = (el) => el.getAttribute('role') === 'option' &&
            !boolAttribute(el, 'hidden') &&
            !boolAttribute(el, 'aria-hidden');
        this._root.querySelectorAll('[role=separator]').forEach(function (el) {
            if (!nextSibling(el, testFn) || !prevSibling(el, testFn)) {
                el.setAttribute('aria-hidden', 'true');
                el.setAttribute('hidden', 'true');
            }
            else {
                el.removeAttribute('aria-hidden');
                el.removeAttribute('hidden');
            }
        });
        this._root
            .querySelectorAll('[role=presentation]')
            .forEach((el) => {
            if (!(el instanceof HTMLElement))
                return;
            const group = el.closest('.jt-listbox__group');
            if (!group)
                return;
            if (!nextSibling(el, testFn)) {
                group.setAttribute('aria-hidden', 'true');
                group.setAttribute('hidden', 'true');
            }
            else {
                group.removeAttribute('aria-hidden');
                group.removeAttribute('hidden');
            }
            this._renderItem(el);
        });
        // Show/Hide the Empty List Element
        const emptyEl = this._root.querySelector(`#${this._id}-empty`);
        if (emptyEl instanceof HTMLElement) {
            if (!anyFound) {
                emptyEl.removeAttribute('aria-hidden');
                emptyEl.removeAttribute('hidden');
            }
            else {
                emptyEl.setAttribute('aria-hidden', 'true');
                emptyEl.setAttribute('hidden', 'true');
            }
            this._renderItem(emptyEl);
        }
    }
    /** @private */
    _userClassChanged(item, op, ...tokens) {
        if (item === 'list') {
            this._root.classList[op](...tokens);
        }
        else if (item === 'group') {
            this._root.querySelectorAll('[role="group"]')
                .forEach((el) => el.classList[op](...tokens));
        }
        else if (item === 'header') {
            this._root.querySelectorAll('[role="group"] [role="presentation"]')
                .forEach((el) => el.classList[op](...tokens));
        }
        else if (item === 'item') {
            this._root.querySelectorAll('.jt-listbox__item')
                .forEach((el) => el.classList[op](...tokens));
        }
    }
    /** @private */
    _valueForId(id) {
        const el = this._root.querySelector(`#${id}`);
        if (el instanceof HTMLElement) {
            return el.dataset.value;
        }
        return undefined;
    }
    /** @private */
    _visibleIds() {
        if (!this._root)
            return [];
        return Array.from(this._root.querySelectorAll('[role=option]'))
            .filter((el) => !boolAttribute(el, 'aria-hidden') &&
            !boolAttribute(el, 'aria-disabled'))
            .filter((el) => !this._options.hideSelected || !this._isSelected(el.id))
            .map((el) => el.id);
    }
    /**
     * Add an item to the List Box
     * @param item Item element or data to add. Must be an `<option>` or
     *  `<optgroup>` element, or an instance of {@link JtListItemData}.
     * @param index Index or Item Key where the item will be added. If the
     *  provided value is an item key (string), the new item will be inserted
     *  before the referenced item.  If no index is provided, the item will be
     *  inserted at the end.
     * @return HTML List Item Element
     */
    add(item, index) {
        let before = null;
        if (typeof index === 'number') {
            const options = Array.from(this._root.querySelectorAll('[role=option]'));
            if (index > 0 && index < options.length)
                before = options[index];
        }
        else if (typeof index === 'string') {
            before = this._root.querySelector(`#${index}`);
        }
        let itemEl;
        const itemData = item instanceof HTMLElement
            ? this._elementToItemData(item)
            : typeof item === 'object'
                ? item
                : { label: item };
        if (!itemData)
            return null;
        if (itemData.group) {
            itemEl = this._createGroup(itemData);
        }
        else {
            itemEl = this._createOption(itemData);
        }
        if (!itemEl)
            return null;
        if (before) {
            before.insertAdjacentElement('beforebegin', itemEl);
        }
        else {
            this._root.append(itemEl);
        }
        if (itemData.selected) {
            if ((this._options.type !== 'multiple') && (this.value !== '')) {
                console.warn(`Multiple selected options provided to ${this._id}`);
            }
            this._select(itemEl.id);
        }
        return itemEl;
    }
    /** Clear the Selected Item */
    clear() {
        this._selected = [];
        this._root.querySelectorAll('[role=option]').forEach((el) => {
            el.removeAttribute('aria-checked');
            el.removeAttribute('aria-selected');
        });
    }
    /**
     * De-Select an Item by Value
     * @param value Item Value
     */
    deselect(value) {
        this._root
            .querySelectorAll(`[data-value="${value}"]`)
            .forEach((el) => this._deselect(el.id));
    }
    /**
     * Clean up the List Box Data prior to being unloaded
     */
    disconnect() {
        if (this._observer) {
            this._observer.disconnect();
        }
        const srcEl = document.querySelector(`[data-jt-list-box="${this._id}"]`);
        if (srcEl) {
            srcEl.removeAttribute('data-jt-list-box');
        }
        document
            .querySelectorAll(`option[data-key^="${this._id}"]`)
            .forEach((element) => element.removeAttribute('data-key'));
    }
    /** Clear the Focus */
    focusClear() {
        this._setHover();
        this._setFocus();
    }
    /**
     * Move the focus to the next selectable option. If the focus is already
     * on the last option, the focus does not move.
     */
    focusDown() {
        const items = this._visibleIds();
        const curIdx = items.indexOf(this._focused || this._hover);
        if (curIdx < items.length - 1) {
            this._cursorMove(items[curIdx + 1]);
        }
    }
    /**
     * Move the focus to the last selectable option. If the focus is already
     * on the last option, the focus does not move.
     */
    focusEnd() {
        const items = this._visibleIds();
        if (items.length > 0) {
            this._cursorMove(items[items.length - 1]);
        }
    }
    /**
     * Move the focus to the first selectable option. If the focus is already
     * on the first option, the focus does not move.
     */
    focusHome() {
        const items = this._visibleIds();
        if (items.length > 0) {
            this._cursorMove(items[0]);
        }
    }
    /**
     * Move the focus down 10 (or the number provided in the
     * {@link JtListBoxOptions.pageSize} option) items, or to the last option.
     */
    focusPageDown() {
        const items = this._visibleIds();
        const curIdx = items.indexOf(this._focused || this._hover);
        if (items.length > 0) {
            const nextIdx = Math.min(curIdx + (this._options.pageSize || 10), items.length - 1);
            this._cursorMove(items[nextIdx]);
        }
    }
    /**
     * Move the focus up 10 (or the number provided in the
     * {@link JtListBoxOptions.pageSize} option) items, or to the first option.
     */
    focusPageUp() {
        const items = this._visibleIds();
        const curIdx = items.indexOf(this._focused || this._hover) === -1
            ? items.length
            : items.indexOf(this._focused || this._hover);
        if (items.length > 0) {
            const nextIdx = Math.max(curIdx - (this._options.pageSize || 10), 0);
            this._cursorMove(items[nextIdx]);
        }
    }
    /**
     * Move the focus to the first selected option.  If there is no selected
     * options, the first item is selected.
     */
    focusSelected() {
        if (this._selected.length === 0) {
            this.focusHome();
        }
        else {
            this._cursorMove(this._selected[0]);
        }
    }
    /**
     * Select the next Item by the First Letters (select box typeahead)
     * @param query Item Query String
     * @return If a match was found
     */
    focusTypeahead(query) {
        if (!query)
            return;
        const lcQuery = query.toLowerCase();
        const items = this._visibleIds()
            .map((id) => { var _a; return [id, (_a = this._labelForId(id)) === null || _a === void 0 ? void 0 : _a.toLowerCase()]; })
            .filter((item) => typeof item[1] === 'string' && item[1].startsWith(lcQuery));
        // No Items Found?
        if (!items.length) {
            this._setFocus();
            return;
        }
        // Cycle through Items
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const curIdx = items.findIndex(([id, _]) => id === this._focused);
        if (curIdx >= items.length - 1) {
            this._cursorMove(items[0][0]);
        }
        else {
            this._cursorMove(items[curIdx + 1][0]);
        }
    }
    /**
     * Move the focus to the next selectable option. If the focus is already
     * on the first option, the focus does not move.
     */
    focusUp() {
        const items = this._visibleIds();
        const curIdx = items.indexOf(this._focused || this._hover);
        if (curIdx === -1) {
            this._cursorMove(items[items.length - 1]);
        }
        else if (curIdx > 0) {
            this._cursorMove(items[curIdx - 1]);
        }
    }
    /**
     * Move the focus to an option by value. If the option is not found or is
     * not selectable, the focus does not move. Returns `true` if an item was
     * found and selected, `false` otherwise.
     */
    focusValue(value) {
        const el = this._root.querySelector(`[data-value="${value}"]`);
        if (el && el instanceof HTMLElement && this._isSelectable(el)) {
            this._cursorMove(el.id);
            return true;
        }
        return false;
    }
    /** Return an Item by Index or Item Key */
    item(index) {
        let item = null;
        if (typeof index === 'number') {
            const options = Array.from(this._root.querySelectorAll('[role=option]'));
            if (index > 0 && index < options.length)
                item = options[index];
        }
        else if (typeof index === 'string') {
            item = this._root.querySelector(`#${index}`);
        }
        if (item instanceof HTMLLIElement) {
            return this._renderData(item);
        }
        return null;
    }
    /** Return an Item by Value */
    itemByValue(value) {
        const item = document.querySelector(`[data-value="${value}"]`);
        if (item instanceof HTMLLIElement) {
            return this._renderData(item);
        }
        return null;
    }
    /**
     * Remove an Item by Index or Item Key
     * @param index Index or Item Key where the item will be added. If the
     *  provided value is an item key (string), the new item will be inserted
     *  before the referenced item.  If no index is provided, the item will be
     *  inserted at the end.
     */
    remove(index) {
        let item = null;
        if (typeof index === 'number') {
            const options = Array.from(this._root.querySelectorAll('[role=option]'));
            if (index > 0 && index < options.length)
                item = options[index];
        }
        else if (typeof index === 'string') {
            item = this._root.querySelector(`#${index}`);
        }
        if (item) {
            this._root.removeChild(item);
        }
    }
    /**
     * Select an Item by Value
     * @param value Item Value
     */
    select(value) {
        this._root
            .querySelectorAll(`[data-value="${value}"]`)
            .forEach((el) => this._select(el.id));
    }
    /**
     * Toggle an Item by Value
     * @param value Item Value
     */
    toggle(value) {
        this._root
            .querySelectorAll(`[data-value="${value}"]`)
            .forEach((el) => this._isSelected(el.id)
            ? this._deselect(el.id)
            : this._select(el.id));
    }
    /** @return Selected Item Label(s) */
    get displayText() {
        const values = this._selected
            .map((id) => this._labelForId(id))
            .filter((value) => !!value);
        if (this._options.type === 'multiple') {
            return values;
        }
        else if (this._options.type === 'single') {
            return values.length ? values[0] : '';
        }
        else {
            return '';
        }
    }
    /** @return If the list has Selectable Options */
    get empty() {
        return this._visibleIds().length === 0;
    }
    /** @return Current Filter String */
    get filter() {
        return this._filter;
    }
    /** @param filter Filter String */
    set filter(filter) {
        this._filter = filter;
        if (this._filter) {
            if (this._options.filterRegex) {
                this._regex = this._options.filterRegex(filter);
            }
            else {
                this._regex = new RegExp(`\\b(${filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i');
            }
        }
        else {
            this._regex = null;
        }
        this._updateItems();
    }
    /** @return Option Id that is currently Active */
    get focusedId() {
        return this._focused || this._hover;
    }
    /** @return Option Value that is currently Active */
    get focusedValue() {
        if (!this._focused || this._hover)
            return '';
        const el = this._root.querySelector(`#${this._focused || this._hover}`);
        if (el && el.dataset.value)
            return el.dataset.value;
        return '';
    }
    /** @return User Class List for Group Lists */
    get groupClassList() {
        return this._groupClassList;
    }
    /** @return User Class List for Group Headers */
    get headerClassList() {
        return this._headerClassList;
    }
    /** @return User Template for Group Headers */
    get headerTemplate() {
        return this._headerTemplate;
    }
    /** @param template New User Template for Group Headers */
    set headerTemplate(template) {
        this._headerTemplate = template;
        this._updateItems();
    }
    /** @return User Class List for Listbox */
    get listClassList() {
        return this._listClassList;
    }
    /** @return User Class List for List Items */
    get itemClassList() {
        return this._itemClassList;
    }
    /** @return User Template for List Items */
    get itemTemplate() {
        return this._itemTemplate;
    }
    /** @param template New User Template for List Items */
    set itemTemplate(template) {
        this._itemTemplate = template;
        this._updateItems();
    }
    /** @return List Box Root Element */
    get root() {
        return this._root;
    }
    /** @return Current Selection */
    get value() {
        const values = this._selected
            .map((id) => this._valueForId(id))
            .filter((value) => !!value);
        if (this._options.type === 'multiple') {
            return values;
        }
        else if (this._options.type === 'single') {
            return values.length ? values[0] : '';
        }
        else {
            return '';
        }
    }
    /**
     * Set the Current Selection
     * @param value New Selection
     */
    set value(value) {
        this.clear();
        if (this._options.type === 'multiple') {
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    this.select(v);
                });
            }
            else {
                this.select(value);
            }
        }
        else if (this._options.type === 'single') {
            if (Array.isArray(value))
                throw new Error('Cannot select multiple items');
            this.select(value);
        }
    }
    constructor(id, items, options) {
        this._composing = false;
        this._cursorMoving = false;
        this._filter = '';
        this._focused = '';
        this._hover = '';
        this._id = '';
        this._regex = null;
        this._selected = [];
        this._id = id;
        this._options = Object.assign({}, _defaultOptions, options || {});
        this._groupClassList = new JtTokenList((op, ...tokens) => this._userClassChanged('group', op, ...tokens), this._options.groupListClasses || []);
        this._headerClassList = new JtTokenList((op, ...tokens) => this._userClassChanged('header', op, ...tokens), this._options.groupHeaderClasses || []);
        this._itemClassList = new JtTokenList((op, ...tokens) => this._userClassChanged('item', op, ...tokens), this._options.itemClasses || []);
        this._listClassList = new JtTokenList((op, ...tokens) => this._userClassChanged('list', op, ...tokens), this._options.listClasses || []);
        this._headerTemplate = this._options.groupHeaderTemplate || null;
        this._itemTemplate = this._options.itemTemplate || null;
        this._observer = new MutationObserver((list) => this._elementChanged(list));
        if (items instanceof HTMLElement) {
            items.dataset.jtListBox = this._id;
            this._observer.observe(items, { childList: true });
        }
        this._root = this._createDom(items);
        this._root.addEventListener('click', (ev) => this._onClick(ev), {
            capture: true,
        });
        this._root.addEventListener('pointerenter', (ev) => this._onPointerEnter(ev), { capture: true });
        this._root.addEventListener('pointerleave', (ev) => this._onPointerLeave(ev), { capture: true });
    }
}

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

/**
 * Jade Tree Autocomplete Text Input Component
 */
/*
 * Allow the autocomplete element to mimic `text`, `search`, `url`, `tel`,
 * or `email` `<input>` types.  Although the HTML spec allows `list` to be used
 * with other `<input>` types, this control will not.
 */
const ALLOWED_INPUT_TYPES = ['text', 'search', 'url', 'tel', 'email'];
class JtAutocomplete extends HTMLElement {
    /* -- Properties -- */
    get disabled() {
        var _a;
        return !!((_a = this._input) === null || _a === void 0 ? void 0 : _a.disabled);
    }
    set disabled(value) {
        if (value) {
            this.setAttribute('aria-disabled', 'true');
            this.setAttribute('disabled', '');
        }
        else {
            this.removeAttribute('aria-disabled');
            this.removeAttribute('disabled');
        }
        this._btnOpen.disabled = value;
        this._btnClear && (this._btnClear.disabled = value);
        if (this._input.disabled != value) {
            this._input.disabled = value;
        }
    }
    get groupClass() {
        return this.getAttribute('groupclass');
    }
    set groupClass(value) {
        this.setAttribute('groupclass', value);
    }
    get groupClassList() {
        return this._listbox.groupClassList;
    }
    get headerClass() {
        return this.getAttribute('headerclass');
    }
    set headerClass(value) {
        this.setAttribute('headerclass', value);
    }
    get headerClassList() {
        return this._listbox.headerClassList;
    }
    get headerTemplate() {
        return this._headerTemplate;
    }
    set headerTemplate(template) {
        if (typeof template === 'function') {
            this.setAttribute('headertemplate', 'function');
            this._headerTemplate = template;
            this._listbox.headerTemplate = template;
        }
        else if (typeof template === 'string') {
            this.setAttribute('headertemplate', template);
        }
        else if (!template) {
            this.removeAttribute('headertemplate');
        }
    }
    get itemClass() {
        return this.getAttribute('itemclass');
    }
    set itemClass(value) {
        this.setAttribute('itemclass', value);
    }
    get itemClassList() {
        return this._listbox.itemClassList;
    }
    get itemTemplate() {
        return this._itemTemplate;
    }
    set itemTemplate(template) {
        if (typeof template === 'function') {
            this.setAttribute('itemtemplate', 'function');
            this._itemTemplate = template;
            this._listbox.itemTemplate = template;
        }
        else if (typeof template === 'string') {
            this.setAttribute('itemtemplate', template);
        }
        else if (!template) {
            this.removeAttribute('itemtemplate');
        }
    }
    get listClass() {
        return this.getAttribute('listclass');
    }
    set listClass(value) {
        this.setAttribute('listclass', value);
    }
    get listClassList() {
        return this._listbox.listClassList;
    }
    get open() {
        return boolAttribute(this._input, 'aria-expanded');
    }
    set open(value) {
        if (value && !this.disabled) {
            this._openList();
        }
        else {
            this._closeList();
        }
    }
    get readOnly() {
        return this._input.readOnly;
    }
    set readOnly(value) {
        if (value) {
            this.setAttribute('aria-readonly', 'true');
            this.setAttribute('readonly', '');
        }
        else {
            this.removeAttribute('aria-readonly');
            this.removeAttribute('readonly');
        }
        if (this._input.readOnly != value) {
            this._input.readOnly = value;
        }
    }
    /** @private */
    _checkListBox() {
        if (this._listboxLoaded || !this._listboxSource)
            return;
        if (this._listboxSource[0] == '#') {
            const list = document.querySelector(this._listboxSource);
            if (list instanceof HTMLElement) {
                this._setListItems(list);
            }
        }
        else {
            fetch(this._listboxSource)
                .then((response) => response.json())
                .then((response) => this._setListItems(response))
                .catch((err) => { throw new Error(err); });
        }
    }
    /** @private */
    _closeList() {
        this.classList.remove('jt-open');
        this._input.setAttribute('aria-expanded', 'false');
        this._btnOpen.setAttribute('aria-expanded', 'false');
        this._listbox.focusClear();
        this._listbox.filter = '';
    }
    /** @private */
    _controlMutated(list) {
        for (const mutation of list) {
            switch (mutation.attributeName) {
                case 'disabled':
                    this.disabled = this._input.disabled;
                    break;
                case 'readonly':
                    this.readOnly = this._input.readOnly;
                    break;
                case 'list':
                    if (this._input.hasAttribute('list') && this._input.getAttribute('list')) {
                        this._closeList();
                        this._listboxLoaded = false;
                        this._listboxSource = `#${this._input.getAttribute('list')}`;
                        this._input.removeAttribute('list');
                        break;
                    }
            }
        }
    }
    /** @private */
    _focusClear() {
        this._listboxFocused = false;
        this._textboxFocused = false;
        this._input.parentElement.classList.remove('jt-focus');
        this._listbox.root.classList.remove('jt-focus');
    }
    /** @private */
    _focusListbox() {
        this._listboxFocused = true;
        this._textboxFocused = false;
        this._input.parentElement.classList.remove('jt-focus');
        this._listbox.root.classList.add('jt-focus');
    }
    /** @private */
    _focusTextbox() {
        this._listboxFocused = false;
        this._textboxFocused = true;
        this._input.parentElement.classList.add('jt-focus');
        this._listbox.root.classList.remove('jt-focus');
    }
    /** @private */
    _listBoxOptions() {
        return {
            groupListClasses: this.groupClass ? [...this.groupClass.split(' ')] : [],
            groupHeaderClasses: this.headerClass ? [...this.headerClass.split(' ')] : [],
            itemClasses: this.itemClass ? [...this.itemClass.split(' ')] : [],
            listClasses: this.listClass ? [...this.listClass.split(' ')] : [],
            groupHeaderTemplate: this._headerTemplate,
            itemTemplate: this._itemTemplate,
            type: 'single',
        };
    }
    /** @private */
    _loadTemplate(template) {
        if (!template)
            return null;
        // Treat as a template string
        if (template.includes('${')) {
            return (item) => interpolate(template, { item });
        }
        // Load a <template> by Id
        try {
            const tmplEl = document.querySelector(`#${template}`);
            if (tmplEl instanceof HTMLElement) {
                return (item) => interpolate(tmplEl.innerHTML, { item });
            }
        }
        catch ( /* pass */_a) { /* pass */ }
        // Do not use static strings
        return null;
    }
    /** @private */
    _onClick() {
        if (this.disabled || this.readOnly)
            return;
        this.open = !this.open;
    }
    /** @private */
    _onDocumentClick(ev) {
        const tgt = ev.target;
        if ((tgt instanceof HTMLElement) && (tgt.closest(`#${this._id}`)) === null) {
            this._closeList();
        }
    }
    /** @private */
    _onFocusIn() {
        this._focusTextbox();
    }
    /** @private */
    _onFocusOut() {
        this._focusClear();
    }
    /** @private */
    _onInput() {
        if (!this.open) {
            this._openList();
        }
        this._listbox.focusValue(this._listbox.filter);
        this._listbox.filter = this._input.value;
    }
    /** @private */
    _onItemClick(ev) {
        if (!this.readOnly) {
            this._setValue(ev.detail.value);
        }
        this._closeList();
    }
    /** @private */
    _onItemFocusIn(ev) {
        if (ev.target instanceof HTMLElement && ev.target.id !== '') {
            this._input.setAttribute('aria-activedescendant', ev.target.id);
        }
        else {
            this._input.removeAttribute('aria-activedescendant');
        }
    }
    /** @private */
    _onItemFocusOut(ev) {
        if (!(ev.relatedTarget instanceof HTMLElement) || ev.relatedTarget.id === '') {
            this._input.removeAttribute('aria-activedescendant');
        }
        else {
            this._input.setAttribute('aria-activedescendant', ev.relatedTarget.id);
        }
    }
    /** @private */
    _onKeyDown(ev) {
        let handled = false;
        const lbFocus = this._listboxFocused;
        switch (ev.key) {
            case 'Enter':
                if (this._listboxFocused && this._listbox.focusedId) {
                    this._setValue(this._listbox.focusedValue);
                    this._closeList();
                    this._focusTextbox();
                    handled = true;
                }
                else if (this.open) {
                    this._closeList();
                    this._focusTextbox();
                    handled = true;
                }
                break;
            case 'Esc':
            case 'Escape':
                if (this.open) {
                    this._closeList();
                    this._focusTextbox();
                }
                else {
                    this._setValue('');
                }
                handled = true;
                break;
            case 'ArrowDown':
            case 'Down':
                this._openList();
                this._focusListbox();
                if (!ev.altKey && (!this._listbox.focusedId || lbFocus)) {
                    this._listbox.focusDown();
                }
                handled = true;
                break;
            case 'ArrowUp':
            case 'Up':
                if (!this._listbox.empty) {
                    this._openList();
                    this._focusListbox();
                    if (!ev.altKey && (!this._listbox.focusedId || lbFocus)) {
                        this._listbox.focusUp();
                    }
                }
                handled = true;
                break;
            case 'Tab':
                if (this._listbox.focusedId !== '') {
                    this._setValue(this._listbox.focusedValue);
                }
                this._closeList();
                break;
        }
        if (handled) {
            ev.stopPropagation();
            ev.preventDefault();
        }
    }
    /** @private */
    _onKeyUp(ev) {
        const printable = (ev.key.length === 1) && ev.key.match(/\S| /);
        let handled = false;
        if (printable) {
            this._listbox.filter = this._input.value;
        }
        else if (ev.key === 'Escape' || ev.key === 'Esc' || ev.key == 'Enter') {
            return;
        }
        switch (ev.key) {
            case 'Backspace':
                this._focusTextbox();
                this._listbox.focusClear();
                this._listbox.filter = this._input.value;
                handled = true;
                break;
            case 'Left':
            case 'ArrowLeft':
            case 'Right':
            case 'ArrowRight':
            case 'Home':
            case 'End':
                this._focusTextbox();
                this._listbox.focusClear();
                handled = true;
                break;
            default:
                if (!this._listbox.empty) {
                    if (!this.open) {
                        this._openList();
                    }
                    this._listbox.focusValue(this._listbox.filter);
                }
                handled = true;
                break;
        }
        if (handled) {
            ev.stopPropagation();
            ev.preventDefault();
        }
    }
    /** @private */
    _onOpenClick() {
        if (this.disabled)
            return;
        this.open = !this.open;
    }
    /** @private */
    _openList() {
        this._checkListBox();
        if (!this.open) {
            this.classList.add('jt-open');
            this._input.setAttribute('aria-expanded', 'true');
            this._btnOpen.setAttribute('aria-expanded', 'true');
            if (!this.readOnly) {
                if (!this._listbox.focusValue(this._input.value)) {
                    this.querySelector('.jt-popup').scrollTop = 0;
                }
            }
            if (document.activeElement !== this._input) {
                this._input.focus();
            }
        }
    }
    /** @private */
    _setListItems(items) {
        const listBox = new JtListBox(`${this._id}-listbox`, items, this._listBoxOptions());
        this._listbox.root.replaceWith(listBox.root);
        this._listbox = listBox;
        this._listboxLoaded = true;
        this._listbox.root.addEventListener('item:click', (ev) => this._onItemClick(ev));
        this._listbox.root.addEventListener('item:focusin', (ev) => this._onItemFocusIn(ev));
        this._listbox.root.addEventListener('item:focusout', (ev) => this._onItemFocusOut(ev));
    }
    /** @private */
    _setValue(value) {
        if (!this.readOnly) {
            this._listbox.filter = value;
            this._input.value = value;
            this._input.setSelectionRange(value.length, value.length);
            this._input.dispatchEvent(new Event('input'));
        }
    }
    /** @private */
    _setup() {
        if (!this.isConnected)
            return;
        if (!this.hasAttribute('id'))
            this.setAttribute('id', this._id);
        this._input = this.querySelector('input');
        if (!this._input)
            return;
        if (!ALLOWED_INPUT_TYPES.includes(this._input.type || 'text')) {
            throw new Error(`JtAutocomplete does not support <input type='${this._input.type}'>`);
        }
        // https://bugs.chromium.org/p/chromium/issues/detail?id=468153#c164
        // JtAutocomplete will honor an existing 'autocomplete' attribute, but
        // will otherwise use `off` as the correct value per W3C. For users
        // primarily on Chrome, the page author should set `autocomplete` to
        // whatever seems to work at that time for Chrome.
        if (!this._input.hasAttribute('autocomplete')) {
            this._input.setAttribute('autocomplete', 'off');
        }
        this._input.setAttribute('role', 'combobox');
        this._input.setAttribute('aria-autocomplete', 'list');
        this._input.addEventListener('click', () => this._onClick());
        this._input.addEventListener('focusin', () => this._onFocusIn());
        this._input.addEventListener('focusout', () => this._onFocusOut());
        this._input.addEventListener('input', () => this._onInput());
        this._input.addEventListener('keydown', (ev) => this._onKeyDown(ev));
        this._input.addEventListener('keyup', (ev) => this._onKeyUp(ev));
        // Create buttons
        this._btnClose = htmlToElement(`<button type='button' data-action='close' id="${this._id}-close" tabindex="-1"><span class='jt-sr-only'>Close Suggestion List</span></button>`);
        this._btnClose.addEventListener('click', () => this._closeList());
        this._btnOpen = htmlToElement(`<button type='button' data-action='open' id='${this._id}-open' tabindex="-1"><span class='jt-sr-only'>Show Suggestions<span></button>`);
        this._btnOpen.addEventListener('click', () => this._onOpenClick());
        this._btnClear = htmlToElement(`<button type='button' data-action='clear' id='${this._id}-clear' tabindex="-1"><span class='jt-sr-only'>Clear Input</span></button>`);
        this._btnClear.addEventListener('click', () => this.clear());
        const btns = document.createElement('div');
        btns.classList.add('jt-control__buttons');
        btns.appendChild(this._btnOpen);
        btns.appendChild(this._btnClear);
        // Create Control
        const control = document.createElement('div');
        control.classList.add('jt-control');
        control.appendChild(this._btnClose);
        control.appendChild(this._input);
        control.appendChild(btns);
        this.appendChild(control);
        // Create Empty Listbox
        this._listboxLoaded = false;
        if (this.hasAttribute('src')) {
            this._listboxSource = this.getAttribute('src');
        }
        else if (this.hasAttribute('list')) {
            this._listboxSource = `#${this.getAttribute('list')}`;
        }
        else if (this._input.hasAttribute('list')) {
            this.setAttribute('list', this._input.getAttribute('list'));
            this._listboxSource = `#${this._input.getAttribute('list')}`;
            this._input.setAttribute('list', '');
            this._input.removeAttribute('list');
        }
        this._listbox = new JtListBox(`${this._id}-listbox`, [], this._listBoxOptions());
        this._listbox.groupClassList.value = this.getAttribute('groupClass');
        this._listbox.headerClassList.value = this.getAttribute('headerClass');
        this._listbox.itemClassList.value = this.getAttribute('itemClass');
        this._listbox.listClassList.value = this.getAttribute('listClass');
        const popup = document.createElement('div');
        popup.classList.add('jt-popup');
        popup.appendChild(this._listbox.root);
        this.appendChild(popup);
        // Initialize State
        this.open = false;
        this.disabled = this._input.disabled;
        this.readOnly = this._input.readOnly;
        this.classList.toggle('jt-placeholder-shown', this._input.value == '');
        this._input.addEventListener('input', () => {
            this.classList.toggle('jt-placeholder-shown', this._input.value == '');
        });
        // Watch for attribute changes on the <input>
        this._observer = new MutationObserver((list) => this._controlMutated(list));
        this._observer.observe(this._input, { attributes: true });
        // Register Click-Away Handler
        document.addEventListener('click', (ev) => this._onDocumentClick(ev));
    }
    /** Clear the Input Element */
    clear() {
        this._setValue('');
        requestAnimationFrame(() => {
            this._input.focus();
        });
    }
    /** @return Item Data matching the current Input (or null) */
    matchingItem() {
        if (!this._input.value)
            return null;
        return this._listbox.itemByValue(this._input.value);
    }
    /* -- Constructor -- */
    constructor() {
        super();
        this._id = this.getAttribute('id') || uid('jt-autocomplete');
    }
    /* -- Web Component Lifecycle Hooks --*/
    static get observedAttributes() {
        return [
            'groupclass',
            'headerclass',
            'headertemplate',
            'itemclass',
            'itemtemplate',
            'listclass',
            'src',
        ];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'groupclass':
                this._listbox.groupClassList.value = newValue;
                break;
            case 'headerclass':
                this._listbox.headerClassList.value = newValue;
                break;
            case 'itemclass':
                this._listbox.itemClassList.value = newValue;
                break;
            case 'listclass':
                this._listbox.listClassList.value = newValue;
                break;
            case 'headertemplate':
                if (newValue === null) {
                    this._headerTemplate = null;
                    this._listbox.headerTemplate = null;
                }
                else if (newValue !== 'function') {
                    this._headerTemplate = this._loadTemplate(newValue);
                    this._listbox.headerTemplate = this._headerTemplate;
                }
                break;
            case 'itemtemplate':
                if (newValue === null) {
                    this._itemTemplate = null;
                    this._listbox.itemTemplate = null;
                }
                else if (newValue !== 'function') {
                    this._itemTemplate = this._loadTemplate(newValue);
                    this._listbox.itemTemplate = this._itemTemplate;
                }
                break;
            case 'src':
                this._closeList();
                this._listboxLoaded = false;
                this._listboxSource = newValue;
                break;
        }
    }
    connectedCallback() {
        // Set up the component after the rendering loop finishes
        setTimeout(() => this._setup(), 0);
    }
    /* -- Web Component Registration Helper -- */
    static register() {
        customElements.define("jt-autocomplete", JtAutocomplete);
    }
}
// Auto-Register the Web Component in an IIFE
if (typeof __ROLLUP_IIFE === 'boolean' && __ROLLUP_IIFE) {
    JtAutocomplete.register();
}

function getAlignment(placement) {
  return placement.split('-')[1];
}

function getLengthFromAxis(axis) {
  return axis === 'y' ? 'height' : 'width';
}

function getSide(placement) {
  return placement.split('-')[0];
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].includes(getSide(placement)) ? 'x' : 'y';
}

function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  const commonAlign = reference[length] / 2 - floating[length] / 2;
  const side = getSide(placement);
  const isVertical = mainAxis === 'x';
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case 'start':
      coords[mainAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[mainAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a reference element when it is given a certain positioning strategy.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
      continue;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}

function getSideObjectFromPadding(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}

function rectToClientRect(rect) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = options;
  const paddingObject = getSideObjectFromPadding(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    ...rects.floating,
    x,
    y
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

const min$1 = Math.min;
const max$1 = Math.max;

function within(min$1$1, value, max$1$1) {
  return max$1(min$1$1, min$1(value, max$1$1));
}

const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
}

function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  let mainAlignmentSide = mainAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return {
    main: mainAlignmentSide,
    cross: getOppositePlacement(mainAlignmentSide)
  };
}

const oppositeAlignmentMap = {
  start: 'end',
  end: 'start'
};
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
}

function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}

function getSideList(side, isStart, rtl) {
  const lr = ['left', 'right'];
  const rl = ['right', 'left'];
  const tb = ['top', 'bottom'];
  const bt = ['bottom', 'top'];
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case 'left':
    case 'right':
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = options;
      const side = getSide(placement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      if (!specifiedFallbackPlacements && fallbackAxisSideDirection !== 'none') {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const {
          main,
          cross
        } = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[main], overflow[cross]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          // Try next placement and re-run the lifecycle.
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$map$so;
                const placement = (_overflowsData$map$so = overflowsData.map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$map$so[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

async function convertValueToCoords(state, value) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getMainAxisFromPlacement(placement) === 'x';
  const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = typeof value === 'function' ? value(state) : value;

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...rawValue
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = function (value) {
  if (value === void 0) {
    value = 0;
  }
  return {
    name: 'offset',
    options: value,
    async fn(state) {
      const {
        x,
        y
      } = state;
      const diffCoords = await convertValueToCoords(state, value);
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: diffCoords
      };
    }
  };
};

function getCrossAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = options;
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const mainAxis = getMainAxisFromPlacement(getSide(placement));
      const crossAxis = getCrossAxis(mainAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === 'y' ? 'top' : 'left';
        const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = within(min, mainAxisCoord, max);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === 'y' ? 'top' : 'left';
        const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = within(min, crossAxisCoord, max);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y
        }
      };
    }
  };
};

function getWindow(node) {
  var _node$ownerDocument;
  return ((_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}

function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}

function isNode(value) {
  return value instanceof getWindow(value).Node;
}
function getNodeName(node) {
  return isNode(node) ? (node.nodeName || '').toLowerCase() : '';
}

function isHTMLElement(value) {
  return value instanceof getWindow(value).HTMLElement;
}
function isElement(value) {
  return value instanceof getWindow(value).Element;
}
function isShadowRoot(node) {
  // Browsers without `ShadowRoot` support.
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }
  const OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !['inline', 'contents'].includes(display);
}
function isTableElement(element) {
  return ['table', 'td', 'th'].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const safari = isSafari();
  const css = getComputedStyle$1(element);

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  return css.transform !== 'none' || css.perspective !== 'none' || !safari && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !safari && (css.filter ? css.filter !== 'none' : false) || ['transform', 'perspective', 'filter'].some(value => (css.willChange || '').includes(value)) || ['paint', 'layout', 'strict', 'content'].some(value => (css.contain || '').includes(value));
}
function isSafari() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('-webkit-backdrop-filter', 'none');
}
function isLastTraversableNode(node) {
  return ['html', 'body', '#document'].includes(getNodeName(node));
}

const min = Math.min;
const max = Math.max;
const round = Math.round;

function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    fallback: shouldFallback
  };
}

function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}

const FALLBACK_SCALE = {
  x: 1,
  y: 1
};
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return FALLBACK_SCALE;
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    fallback
  } = getCssDimensions(domElement);
  let x = (fallback ? round(rect.width) : rect.width) / width;
  let y = (fallback ? round(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = {
  x: 0,
  y: 0
};
function getVisualOffsets(element, isFixed, floatingOffsetParent) {
  var _win$visualViewport, _win$visualViewport2;
  if (isFixed === void 0) {
    isFixed = true;
  }
  if (!isSafari()) {
    return noOffsets;
  }
  const win = element ? getWindow(element) : window;
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== win) {
    return noOffsets;
  }
  return {
    x: ((_win$visualViewport = win.visualViewport) == null ? void 0 : _win$visualViewport.offsetLeft) || 0,
    y: ((_win$visualViewport2 = win.visualViewport) == null ? void 0 : _win$visualViewport2.offsetTop) || 0
  };
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = FALLBACK_SCALE;
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = getVisualOffsets(domElement, isFixedStrategy, offsetParent);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentIFrame = win.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== win) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);
      iframeRect.x += (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      iframeRect.y += (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += iframeRect.x;
      y += iframeRect.y;
      currentIFrame = getWindow(currentIFrame).frameElement;
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}

function getDocumentElement(node) {
  return ((isNode(node) ? node.ownerDocument : node.document) || window.document).documentElement;
}

function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  if (offsetParent === documentElement) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = {
    x: 1,
    y: 1
  };
  const offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== 'fixed') {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === 'rtl') {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}

function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    // `getParentNode` will never return a `Document` due to the fallback
    // check, so it's either the <html> or <body> element.
    return parentNode.ownerDocument.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}

function getOverflowAncestors(node, list) {
  var _node$ownerDocument;
  if (list === void 0) {
    list = [];
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor));
}

function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isSafari();
    if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : {
    x: 1,
    y: 1
  };
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      ...clippingAncestor,
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element).filter(el => isElement(el) && getNodeName(el) !== 'body');
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === 'fixed';
  let currentNode = elementIsFixed ? getParentNode(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && ['absolute', 'fixed'].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}

function getDimensions(element) {
  return getCssDimensions(element);
}

function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const window = getWindow(element);
  if (!isHTMLElement(element)) {
    return window;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static' && !isContainingBlock(offsetParent))) {
    return window;
  }
  return offsetParent || getContainingBlock(element) || window;
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

const platform = {
  getClippingRect,
  convertOffsetParentRelativeRectToViewportRelativeRect,
  isElement,
  getDimensions,
  getOffsetParent,
  getDocumentElement,
  getScale,
  async getElementRects(_ref) {
    let {
      reference,
      floating,
      strategy
    } = _ref;
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    return {
      reference: getRectRelativeToOffsetParent(reference, await getOffsetParentFn(floating), strategy),
      floating: {
        x: 0,
        y: 0,
        ...(await getDimensionsFn(floating))
      }
    };
  },
  getClientRects: element => Array.from(element.getClientRects()),
  isRTL: element => getComputedStyle$1(element).direction === 'rtl'
};

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = true,
    animationFrame = false
  } = options;
  const ancestors = ancestorScroll || ancestorResize ? [...(isElement(reference) ? getOverflowAncestors(reference) : reference.contextElement ? getOverflowAncestors(reference.contextElement) : []), ...getOverflowAncestors(floating)] : [];
  ancestors.forEach(ancestor => {
    // ignores Window, checks for [object VisualViewport]
    const isVisualViewport = !isElement(ancestor) && ancestor.toString().includes('V');
    if (ancestorScroll && (animationFrame ? isVisualViewport : true)) {
      ancestor.addEventListener('scroll', update, {
        passive: true
      });
    }
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  let observer = null;
  if (elementResize) {
    observer = new ResizeObserver(() => {
      update();
    });
    isElement(reference) && !animationFrame && observer.observe(reference);
    if (!isElement(reference) && reference.contextElement && !animationFrame) {
      observer.observe(reference.contextElement);
    }
    observer.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _observer;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    (_observer = observer) == null ? void 0 : _observer.disconnect();
    observer = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a reference element when it is given a certain CSS positioning
 * strategy.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};

const e=new Map,t="rtl"===window.getComputedStyle(document.documentElement).direction,n={LEFT:37,UP:38,RIGHT:39,DOWN:40},r=t=>{const{currentTarget:n}=t;e.get("last_rover")!=n&&e.has(n)&&(i(n,e.get(n).active),e.set("last_rover",n));},a=e=>{const{currentTarget:r}=e;switch(e.keyCode){case n[t?"LEFT":"RIGHT"]:case n.DOWN:e.preventDefault(),c(r);break;case n[t?"RIGHT":"LEFT"]:case n.UP:e.preventDefault(),d(r);}},s=new MutationObserver((t,n)=>{t.filter(e=>e.removedNodes.length>0).forEach(t=>{[...t.removedNodes].filter(e=>1===e.nodeType).forEach(t=>{e.forEach((n,o)=>{"last_rover"!==o&&t.contains(o)&&(o.removeEventListener("focusin",r),o.removeEventListener("keydown",a),e.delete(o),n.targets.forEach(e=>e.tabIndex=""),(0===e.size||1===e.size&&e.has("last_rover"))&&(e.clear(),s.disconnect()));});});});}),o=({element:t,target:n})=>{const o=t.querySelectorAll(n||":scope *"),c=o[0];t.tabIndex=-1,o.forEach(e=>e.tabIndex=-1),c.tabIndex=0,e.set(t,{targets:o,active:c,index:0}),t.addEventListener("focusin",r),t.addEventListener("keydown",a),s.observe(document,{childList:!0,subtree:!0});},c=t=>{const n=e.get(t);n.index+=1,n.index>n.targets.length-1&&(n.index=n.targets.length-1);let r=n.targets[n.index];r&&i(t,r);},d=t=>{const n=e.get(t);n.index-=1,n.index<1&&(n.index=0);let r=n.targets[n.index];r&&i(t,r);},i=(t,n)=>{const r=e.get(t);r.active.tabIndex=-1,r.active=n,r.active.tabIndex=0,r.active.focus();};

/**
 * Jade Tree Popup Menu Component
 */
class JtPopupMenu extends HTMLElement {
    /** @private */
    _onFocusIn(ev) {
        if ((ev.currentTarget instanceof Element) && ev.currentTarget.closest(`#${this._id}`)) {
            this.open();
            this._position();
        }
    }
    /** @private */
    _onFocusOut(ev) {
        if ((ev.currentTarget instanceof Element) && ev.currentTarget.closest(`#${this._id}`)) {
            this.close();
        }
    }
    /** @private */
    _position() {
        const alignment = this.getAttribute('alignment') || 'center';
        const placement = this.getAttribute('placement') || 'right';
        this._offset = this.getAttribute('offset')
            ? parseInt(this.getAttribute('offset'))
            : null;
        this._placement = `${placement}${alignment !== 'center' ? '-' + alignment : ''}`;
        this._selector = this.getAttribute('selector') || 'button';
        console.log('Positioning to ', this._placement);
        if (!this._trigger || !this._target)
            return;
        autoUpdate(this._trigger, this._target, () => {
            computePosition(this._trigger, this._target, {
                placement: this._placement,
                middleware: [
                    flip(),
                    shift(),
                    this._offset && offset(this._offset),
                ]
            }).then(({ x, y }) => {
                Object.assign(this._target.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                });
            });
        });
    }
    /** @private */
    _setup() {
        if (!this.isConnected)
            return;
        if (!this.hasAttribute('id'))
            this.setAttribute('id', this._id);
        this._trigger = this.querySelector('[slot=trigger]');
        this._target = this.querySelector('[slot=target]');
        this._target.classList.add('jt-popup__popup');
        if (!this._target.hasAttribute('id'))
            this._target.setAttribute('id', `${this._id}-menu`);
        const container = document.createElement('div');
        container.classList.add('jt-popup');
        container.setAttribute('aria-haspopup', 'true');
        container.setAttribute('aria-controls', this._target.getAttribute('id'));
        container.setAttribute('aria-expanded', 'false');
        container.appendChild(this._trigger);
        container.appendChild(this._target);
        this.appendChild(container);
        o({
            element: container,
            target: `[slot=target] ${this._selector}`,
        });
        container.addEventListener('focusin', (ev) => this._onFocusIn(ev));
        container.addEventListener('focusout', (ev) => this._onFocusOut(ev));
        container.addEventListener('keyup', (ev) => (ev.code === 'Escape' && ev.target instanceof HTMLElement) && ev.target.blur());
        this._trigger.setAttribute('tabindex', '-1');
        this._trigger.addEventListener('click', () => {
            const e = this.querySelector(`[slot=target] ${this._selector}`);
            (e instanceof HTMLElement) && e.focus();
        });
    }
    /**
     * Close the Popup Menu
     */
    close() {
        this.querySelector('div').setAttribute('aria-expanded', 'false');
    }
    /**
     * Open the Popup Menu
     */
    open() {
        this.querySelector('div').setAttribute('aria-expanded', 'true');
    }
    /* -- Constructor -- */
    constructor() {
        super();
        this._id = this.getAttribute('id') || uid('jt-popup-menu');
    }
    /* -- Web Component Lifecycle Hooks --*/
    static get observedAttributes() {
        return [
            'alignment',
            'placement',
            'offset',
        ];
    }
    attributeChangedCallback(name) {
        switch (name) {
            case 'alignment':
            case 'placement':
            case 'offset':
                this._position();
                break;
        }
    }
    connectedCallback() {
        // Set up the component after the rendering loop finishes
        setTimeout(() => this._setup(), 0);
    }
    /* -- Web Component Registration Helper -- */
    static register() {
        customElements.define("jt-popup-menu", JtPopupMenu);
    }
}
// Auto-Register the Web Component in an IIFE
if (typeof __ROLLUP_IIFE === 'boolean' && __ROLLUP_IIFE) {
    JtPopupMenu.register();
}

/**
 * Jade Tree Autocomplete Text Input Component
 */
class JtSelect extends HTMLElement {
    /* -- Properties -- */
    get disabled() {
        return boolAttribute(this, 'disabled');
    }
    set disabled(value) {
        if (value) {
            this.setAttribute('aria-disabled', 'true');
            this.setAttribute('disabled', '');
            this._control.setAttribute('aria-disabled', 'true');
            this._select.setAttribute('disabled', '');
        }
        else {
            this.removeAttribute('aria-disabled');
            this.removeAttribute('disabled');
            this._control.removeAttribute('aria-disabled');
            this._select.removeAttribute('disabled');
        }
        this._btnClear && (this._btnClear.disabled = value);
    }
    get groupClass() {
        return this.getAttribute('groupclass');
    }
    set groupClass(value) {
        this.setAttribute('groupclass', value);
    }
    get groupClassList() {
        return this._listbox.groupClassList;
    }
    get headerClass() {
        return this.getAttribute('headerclass');
    }
    set headerClass(value) {
        this.setAttribute('headerclass', value);
    }
    get headerClassList() {
        return this._listbox.headerClassList;
    }
    get headerTemplate() {
        return this._headerTemplate;
    }
    set headerTemplate(template) {
        if (typeof template === 'function') {
            this.setAttribute('headertemplate', 'function');
            this._headerTemplate = template;
            this._listbox.headerTemplate = template;
        }
        else if (typeof template === 'string') {
            this.setAttribute('headertemplate', template);
        }
        else if (!template) {
            this.removeAttribute('headertemplate');
        }
    }
    get itemClass() {
        return this.getAttribute('itemclass');
    }
    set itemClass(value) {
        this.setAttribute('itemclass', value);
    }
    get itemClassList() {
        return this._listbox.itemClassList;
    }
    get itemTemplate() {
        return this._itemTemplate;
    }
    set itemTemplate(template) {
        if (typeof template === 'function') {
            this.setAttribute('itemtemplate', 'function');
            this._itemTemplate = template;
            this._listbox.itemTemplate = template;
        }
        else if (typeof template === 'string') {
            this.setAttribute('itemtemplate', template);
        }
        else if (!template) {
            this.removeAttribute('itemtemplate');
        }
    }
    get listClass() {
        return this.getAttribute('listclass');
    }
    set listClass(value) {
        this.setAttribute('listclass', value);
    }
    get listClassList() {
        return this._listbox.listClassList;
    }
    get open() {
        return boolAttribute(this._control, 'aria-expanded');
    }
    set open(value) {
        if (value && !this.disabled) {
            this._openList();
        }
        else {
            this._closeList();
        }
    }
    get readOnly() {
        return boolAttribute(this, 'readonly');
    }
    set readOnly(value) {
        if (value) {
            this.setAttribute('aria-readonly', 'true');
            this.setAttribute('readonly', '');
        }
        else {
            this.removeAttribute('aria-readonly');
            this.removeAttribute('readonly');
        }
    }
    get searchable() {
        return boolAttribute(this, 'searchable');
    }
    set searchable(value) {
        if (value) {
            this.setAttribute('searchable', '');
        }
        else {
            this.removeAttribute('searchable');
        }
    }
    get value() {
        return this._listbox.value;
    }
    /** @private */
    _checkListBox() {
        if (this._listboxLoaded)
            return;
        if (!this.hasAttribute('src')) {
            this._setListItems(this._select);
        }
        else {
            fetch(this.getAttribute('src'))
                .then((response) => response.json())
                .then((response) => this._setListItems(response))
                .catch((err) => { throw new Error(err); });
        }
    }
    /** @private */
    _closeList() {
        this._control.setAttribute('aria-expanded', 'false');
        this._listbox && this._listbox.focusClear();
        this.classList.remove('jt-open');
        if (this.searchable) {
            this._control.tabIndex = this._tabIndex;
            this._filterInput.tabIndex = -1;
            this._filterInput.value = '';
            this._listbox.filter = '';
        }
    }
    /** @private */
    _controlMutated(list) {
        for (const mutation of list) {
            if (mutation.type === 'attributes' && mutation.target === this._select) {
                /* Change to Disabled Attribute */
                switch (mutation.attributeName) {
                    case 'disabled':
                        this.disabled = this._select.disabled;
                        break;
                }
            }
            else if (mutation.attributeName !== 'data-key') {
                /* Change to Option List */
                if (!this.hasAttribute('src')) {
                    this._closeList();
                    this._listboxLoaded = false;
                }
            }
        }
    }
    /** @private */
    _focusClear() {
        this._listboxFocused = false;
        this._controlFocused = false;
        this._control.parentElement.classList.remove('jt-focus');
        this._listbox.root.classList.remove('jt-focus');
    }
    /** @private */
    _focusControl() {
        this._listboxFocused = false;
        this._controlFocused = true;
        this._control.parentElement.classList.add('jt-focus');
        this._listbox.root.classList.remove('jt-focus');
    }
    /** @private */
    _focusListbox() {
        this._listboxFocused = true;
        this._controlFocused = false;
        this._control.parentElement.classList.remove('jt-focus');
        this._listbox.root.classList.add('jt-focus');
    }
    /** @private */
    _listBoxOptions() {
        return {
            groupListClasses: this.groupClass ? [...this.groupClass.split(' ')] : [],
            groupHeaderClasses: this.headerClass ? [...this.headerClass.split(' ')] : [],
            itemClasses: this.itemClass ? [...this.itemClass.split(' ')] : [],
            listClasses: this.listClass ? [...this.listClass.split(' ')] : [],
            groupHeaderTemplate: this._headerTemplate,
            itemTemplate: this._itemTemplate,
            type: 'single',
        };
    }
    /** @private */
    _loadTemplate(template) {
        if (!template)
            return null;
        // Treat as a template string
        if (template.includes('${')) {
            return (item) => interpolate(template, { item });
        }
        // Load a <template> by Id
        try {
            const tmplEl = document.querySelector(`#${template}`);
            if (tmplEl instanceof HTMLElement) {
                return (item) => interpolate(tmplEl.innerHTML, { item });
            }
        }
        catch ( /* pass */_a) { /* pass */ }
        // Do not use static strings
        return null;
    }
    /** @private */
    _onControlClick() {
        if (!this.open && !this.disabled) {
            this._openList();
        }
        else {
            this._closeList();
        }
    }
    /* @private */
    _onDocumentClick(ev) {
        const tgt = ev.target;
        if ((tgt instanceof HTMLElement) && (tgt.closest(`#${this._id}`)) === null) {
            this._closeList();
        }
    }
    /** @private */
    _onFilterInput(ev) {
        if (ev.isComposing || !this.searchable)
            return;
        this._listbox.filter = ev.target.value;
    }
    /** @private */
    _onFocusIn() {
        this._focusControl();
    }
    /** @private */
    _onFocusOut() {
        this._focusClear();
    }
    /** @private */
    _onItemClick(ev) {
        if (!this.readOnly) {
            this._selectValue(ev.detail.value);
        }
        this._closeList();
    }
    /** @private */
    _onItemFocusIn(ev) {
        this._control.setAttribute('aria-activedescendant', ev.target instanceof HTMLElement
            ? ev.target.id || ''
            : '');
    }
    /** @private */
    _onItemFocusOut(ev) {
        if (!(ev.relatedTarget instanceof HTMLElement)) {
            this._control.setAttribute('aria-activedescendant', '');
        }
        else {
            this._control.setAttribute('aria-activedescendant', ev.relatedTarget.id || '');
        }
    }
    _onKeyDown(ev) {
        const { key, altKey, ctrlKey, metaKey, isComposing } = ev;
        // Skip IME Composition Events
        if (isComposing)
            return;
        // Check for Open List actions
        const openKeys = ['ArrowDown', 'ArrowUp', 'Down', 'Enter', ' ', 'Up'];
        if (!this.open && openKeys.includes(key)) {
            this._openList();
            ev.stopPropagation();
            ev.preventDefault();
            return;
        }
        // Handle typeahead/filter character entry
        if (key === 'Backspace' ||
            key === 'Clear' ||
            (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey)) {
            if (this.searchable) {
                if (!this.open)
                    this._openList(false);
            }
            else if (key.length === 1) {
                if (!this.open)
                    this._openList(false);
                this._typeahead(key);
            }
        }
        // Handle Keyboard List Navigation
        switch (key) {
            case 'ArrowDown':
            case 'Down':
                this._listbox.focusDown();
                ev.stopPropagation();
                ev.preventDefault();
                return;
            case 'ArrowUp':
            case 'Up':
                if (altKey) {
                    this._selectFocused();
                    this._closeList();
                }
                else {
                    this._listbox.focusUp();
                }
                ev.stopPropagation();
                ev.preventDefault();
                return;
            case 'End':
                this._listbox.focusEnd();
                ev.stopPropagation();
                ev.preventDefault();
                return;
            case 'Enter':
            case ' ':
                if (key === ' ' && this.searchable)
                    return;
                this._selectFocused();
                this._closeList();
                ev.stopPropagation();
                ev.preventDefault();
                return;
            case 'Escape':
                this._closeList();
                ev.stopPropagation();
                ev.preventDefault();
                return;
            case 'Home':
                this._listbox.focusHome();
                ev.stopPropagation();
                ev.preventDefault();
                return;
        }
    }
    /** @private */
    _openList(focusItem = false) {
        if (this.disabled)
            return;
        this._checkListBox();
        this._control.setAttribute('aria-expanded', 'true');
        this.classList.add('jt-open');
        (focusItem && this._listbox) && this._listbox.focusSelected();
        if (this.searchable) {
            if (document.activeElement !== this._filterInput) {
                this._control.tabIndex = -1;
                this._filterInput.tabIndex = this._tabIndex || 0;
                this._filterInput.focus();
            }
        }
    }
    /** @private */
    _selectFocused() {
        this._listbox.focusedValue && this._selectValue(this._listbox.focusedValue);
    }
    /** @private */
    _selectValue(value) {
        if (this.disabled || this.readOnly)
            return;
        this._listbox.value = value;
        this._update();
        this._closeList();
        this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
    }
    /** @private */
    _setListItems(items) {
        const listBox = new JtListBox(`${this._id}-listbox`, items, this._listBoxOptions());
        this._listbox.root.replaceWith(listBox.root);
        this._listbox = listBox;
        this._listboxLoaded = true;
        this._listbox.root.addEventListener('item:click', (ev) => this._onItemClick(ev));
        this._listbox.root.addEventListener('item:focusin', (ev) => this._onItemFocusIn(ev));
        this._listbox.root.addEventListener('item:focusout', (ev) => this._onItemFocusOut(ev));
        this._updateWidth();
    }
    /** @private */
    _setup() {
        if (!this.isConnected)
            return;
        if (!this.hasAttribute('id'))
            this.setAttribute('id', this._id);
        this._select = this.querySelector('select');
        if (!this._select)
            return;
        // Store Tab Index
        this._tabIndex = this._select.tabIndex;
        // Create Select Control
        this._control = document.createElement('div');
        this._control.setAttribute('id', `${this._id}-control`);
        this._control.setAttribute('role', 'combobox');
        this._control.setAttribute('data-role', 'control');
        this._control.setAttribute('aria-controls', `${this._id}-listbox`);
        this._control.setAttribute('aria-expanded', 'false');
        this._control.setAttribute('aria-haspopup', 'listbox');
        this._control.setAttribute('tabindex', `${this._tabIndex}`);
        this._control.addEventListener('click', () => this._onControlClick());
        this._control.addEventListener('focusin', () => this._onFocusIn());
        this._control.addEventListener('focusout', () => this._onFocusOut());
        this.addEventListener('keydown', (ev) => this._onKeyDown(ev), { capture: true });
        // Create buttons
        this._btnClose = htmlToElement(`<button type='button' data-action='close' id="${this._id}-close" tabindex="-1"><span class='jt-sr-only'>Close Suggestion List</span></button>`);
        this._btnClose.addEventListener('click', () => this._closeList());
        this._btnClear = htmlToElement(`<button type='button' data-action='clear' id='${this._id}-clear' tabindex="-1"><span class='jt-sr-only'>Clear Input</span></button>`);
        this._btnClear.addEventListener('click', () => this.clear());
        const btns = document.createElement('div');
        btns.classList.add('jt-control__buttons');
        btns.appendChild(this._btnClear);
        // Create Control
        const control = document.createElement('div');
        control.classList.add('jt-control');
        control.appendChild(this._control);
        control.appendChild(btns);
        this.appendChild(control);
        // Create Search Box
        this._filterInput = htmlToElement(`<input id="${this._id}-filter" type="search" tabindex="-1" placeholder="Search Options" />`);
        this._filterInput.addEventListener('input', (ev) => this._onFilterInput(ev));
        const searchWrapper = document.createElement('div');
        searchWrapper.classList.add('jt-select__search');
        searchWrapper.appendChild(this._btnClose);
        searchWrapper.appendChild(this._filterInput);
        // Create Empty Listbox
        this._listboxLoaded = false;
        this._listbox = new JtListBox(`${this._id}-listbox`, [], this._listBoxOptions());
        this._listbox.groupClassList.value = this.getAttribute('groupClass');
        this._listbox.headerClassList.value = this.getAttribute('headerClass');
        this._listbox.itemClassList.value = this.getAttribute('itemClass');
        this._listbox.listClassList.value = this.getAttribute('listClass');
        const popup = document.createElement('div');
        popup.classList.add('jt-popup');
        popup.appendChild(searchWrapper);
        popup.appendChild(this._listbox.root);
        this.appendChild(popup);
        // Initialize State
        this.open = false;
        this.disabled = this._select.disabled;
        this.classList.toggle('jt-placeholder-shown', this._select.value == '');
        this._select.addEventListener('change', () => {
            this.classList.toggle('jt-placeholder-shown', this._select.value == '');
        });
        // Adopt Label and Hide Source Control
        if (this._select instanceof HTMLElement) {
            if (document.activeElement === this._select) {
                this._control.focus();
            }
            this._select.style.display = 'none';
            if (this._select.id) {
                const label = document.querySelector(`[for="${this._select.id}"]`);
                if (label instanceof HTMLLabelElement) {
                    label.htmlFor = `${this._id}-control`;
                    if (!label.id)
                        label.id = `${this._id}-label`;
                    this._control.setAttribute('aria-labelledby', label.id);
                }
            }
        }
        // Watch for attribute changes on the <select>
        this._observer = new MutationObserver((list) => this._controlMutated(list));
        this._observer.observe(this._select, { attributes: true, childList: true, subtree: true });
        // Register Click-Away Handler
        document.addEventListener('click', (ev) => this._onDocumentClick(ev));
        // Load the List Items
        this._checkListBox();
        this._update();
        this._updateWidth();
    }
    /** @private */
    _sync() {
        const selValues = Array.from(this._select.selectedOptions).map((el) => el.value);
        const isChanged = (this.value === '' && selValues.length !== 0)
            || (this.value !== '' && selValues.length > 0)
            || (this.value !== selValues[0]);
        if (!isChanged)
            return;
        if (!this._listbox.value) {
            this._select.value = '';
            this._select.dispatchEvent(new Event('change'));
        }
        else if (Array.isArray(this._listbox.value)) {
            this._select.querySelectorAll('option').forEach((el) => {
                el.selected = el.value && (this._listbox.value.includes(el.value));
            });
            this._select.dispatchEvent(new Event('change'));
        }
        else if (this._listbox.value !== selValues[0]) {
            this._select.value = this._listbox.value;
            this._select.dispatchEvent(new Event('change'));
        }
    }
    /** @private */
    _typeahead(char) {
        const allSame = (array) => (array.every((i) => i === array[0]));
        // Cancel existing typeahead timer
        if (typeof this._typeaheadTimer === 'number') {
            window.clearTimeout(this._typeaheadTimer);
        }
        // Set new typeahead timer
        this._typeaheadTimer = window.setTimeout(() => {
            this._filter = '';
        }, this._typeaheadTimeout || 500);
        // Update filter and select next item
        this._filter += char;
        if (this._filter.length > 1 && allSame(this._filter.split(''))) {
            // Repeated letters cycle through
            this._listbox.focusTypeahead(this._filter[0]);
        }
        else {
            // Match exact string
            this._listbox.focusTypeahead(this._filter);
        }
    }
    /** @private */
    _update() {
        if (!this._listbox.value) {
            this._control.innerHTML = `<span class="jt-placeholder">${this.getAttribute('placeholder') || '&nbsp;'}</span>`;
            this.classList.add('jt-placeholder-shown');
        }
        else {
            this._control.innerHTML = `<span>${this._listbox.displayText}</span>`;
            this.classList.remove('jt-placeholder-shown');
        }
        this._sync();
    }
    /** @private */
    _updateWidth() {
        const sw = this._listbox.root.scrollWidth;
        if (sw == 0) {
            // Poll every 100ms until the list box has a Client Width
            setTimeout(() => this._updateWidth(), 100);
        }
        else {
            this._control.style.width = `${sw}px`;
        }
    }
    /** Clear the Input Element */
    clear() {
        this._selectValue('');
    }
    /* -- Constructor -- */
    constructor() {
        super();
        this._filter = '';
        this._typeaheadTimeout = 500;
        this._id = this.getAttribute('id') || uid('jt-select');
    }
    /* -- Web Component Lifecycle Hooks --*/
    static get observedAttributes() {
        return [
            'groupclass',
            'headerclass',
            'headertemplate',
            'itemclass',
            'itemtemplate',
            'listclass',
            'src',
        ];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'groupclass':
                this._listbox.groupClassList.value = newValue;
                break;
            case 'headerclass':
                this._listbox.headerClassList.value = newValue;
                break;
            case 'itemclass':
                this._listbox.itemClassList.value = newValue;
                break;
            case 'listclass':
                this._listbox.listClassList.value = newValue;
                break;
            case 'headertemplate':
                if (newValue === null) {
                    this._headerTemplate = null;
                    this._listbox.headerTemplate = null;
                }
                else if (newValue !== 'function') {
                    this._headerTemplate = this._loadTemplate(newValue);
                    this._listbox.headerTemplate = this._headerTemplate;
                }
                break;
            case 'itemtemplate':
                if (newValue === null) {
                    this._itemTemplate = null;
                    this._listbox.itemTemplate = null;
                }
                else if (newValue !== 'function') {
                    this._itemTemplate = this._loadTemplate(newValue);
                    this._listbox.itemTemplate = this._itemTemplate;
                }
                break;
            case 'src':
                this._closeList();
                this._listboxLoaded = false;
                break;
        }
    }
    connectedCallback() {
        // Set up the component after the rendering loop finishes
        setTimeout(() => this._setup(), 0);
    }
    /* -- Web Component Registration Helper -- */
    static register() {
        customElements.define("jt-select", JtSelect);
    }
}
// Auto-Register the Web Component in an IIFE
if (typeof __ROLLUP_IIFE === 'boolean' && __ROLLUP_IIFE) {
    JtSelect.register();
}
