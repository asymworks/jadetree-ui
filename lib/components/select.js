/**
 * Jade Tree Autocomplete Text Input Component
 */
import JtListBox from './listbox';
import { boolAttribute, htmlToElement } from '../util/dom';
import { interpolate } from '../util/html';
import uid from '../util/uid';
export default class JtSelect extends HTMLElement {
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
                console.log(mutation);
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
        if (this.disabled)
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
    /* -- Web Component Registration Helper -- */
    static register() {
        customElements.define("jt-select", JtSelect);
    }
}
// Auto-Register the Web Component in an IIFE
if (typeof __ROLLUP_IIFE === 'boolean' && __ROLLUP_IIFE) {
    JtSelect.register();
}
