/**
 * Jade Tree ListBox Module
 * @module components/jt-combobox
 */
import uid from '../util/uid';
import { JtTokenList, boolAttribute, htmlToElement, nextSibling, prevSibling, } from '../util/dom';
/** Item UID Helper */
const _itemIdGenerator = (id) => uid(`${id}-item`);
/** @private Default List Item Rendering Template */
export const defaultItemTemplate = (item) => {
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
export const defaultHeaderTemplate = (item) => item.label || '';
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
export default class JtListBox {
    /** @private */
    _adjustScroll() {
        if (!this._focused)
            return;
        const hlEl = this._root.querySelector(`#${this._focused}`);
        if (hlEl) {
            const bounds = this._root.getBoundingClientRect();
            const { top, bottom } = hlEl.getBoundingClientRect();
            if (top < bounds.top || bottom > bounds.bottom) {
                hlEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
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
    _renderItem(li) {
        var _a;
        let template;
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
            template = this._itemTemplate || defaultItemTemplate;
        }
        else if (role === 'separator') {
            item.separator = true;
            template = this._itemTemplate || defaultItemTemplate;
        }
        else if (li.dataset.empty === 'true') {
            item.creating = this._options.canCreate;
            item.empty = true;
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
    /**
     * Remove an Item by Index or Value
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
