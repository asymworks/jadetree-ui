/*! JtControls v0.2.0 | (c) 2023 Jonathan Krauss | BSD-3-Clause License | git+https://github.com/asymworks/jadetree-ui.git */
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

export { JtSelect as default };
