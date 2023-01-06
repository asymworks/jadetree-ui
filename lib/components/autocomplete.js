/**
 * Jade Tree Autocomplete Text Input Component
 */
import JtListBox from './listbox';
import { boolAttribute, htmlToElement } from '../util/dom';
import { interpolate } from '../util/html';
import uid from '../util/uid';
/*
 * Allow the autocomplete element to mimic `text`, `search`, `url`, `tel`,
 * or `email` `<input>` types.  Although the HTML spec allows `list` to be used
 * with other `<input>` types, this control will not.
 */
const ALLOWED_INPUT_TYPES = ['text', 'search', 'url', 'tel', 'email'];
export default class JtAutocomplete extends HTMLElement {
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
