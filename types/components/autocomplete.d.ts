/**
 * Jade Tree Autocomplete Text Input Component
 */
import JtListBox, { JtListBoxOptions, JtListItem, JtListItemTemplate } from './listbox';
export default class JtAutocomplete extends HTMLElement {
    _btnOpen: HTMLButtonElement;
    _btnClear?: HTMLButtonElement;
    _btnClose: HTMLButtonElement;
    _headerTemplate: JtListItemTemplate | null;
    _listbox?: JtListBox;
    _listboxFocused: boolean;
    _listboxLoaded: boolean;
    _listboxSource: string;
    _input: HTMLInputElement;
    _id: string;
    _initialHeight?: number;
    _itemTemplate: JtListItemTemplate | null;
    _mode: string;
    _observer: MutationObserver;
    _templateChanging: boolean;
    _textboxFocused: boolean;
    get disabled(): boolean;
    set disabled(value: boolean);
    get groupClass(): string;
    set groupClass(value: string);
    get groupClassList(): DOMTokenList;
    get headerClass(): string;
    set headerClass(value: string);
    get headerClassList(): DOMTokenList;
    get headerTemplate(): string | JtListItemTemplate | null;
    set headerTemplate(template: string | JtListItemTemplate | null);
    get itemClass(): string;
    set itemClass(value: string);
    get itemClassList(): DOMTokenList;
    get itemTemplate(): string | JtListItemTemplate | null;
    set itemTemplate(template: string | JtListItemTemplate | null);
    get listClass(): string;
    set listClass(value: string);
    get listClassList(): DOMTokenList;
    get open(): boolean;
    set open(value: boolean);
    get readOnly(): boolean;
    set readOnly(value: boolean);
    /** @private */
    _checkListBox(): void;
    /** @private */
    _closeList(): void;
    /** @private */
    _controlMutated(list: MutationRecord[]): void;
    /** @private */
    _focusClear(): void;
    /** @private */
    _focusListbox(): void;
    /** @private */
    _focusTextbox(): void;
    /** @private */
    _listBoxOptions(): JtListBoxOptions;
    /** @private */
    _loadTemplate(template: string): JtListItemTemplate | null;
    /** @private */
    _onClick(): void;
    /** @private */
    _onDocumentClick(ev: Event): void;
    /** @private */
    _onFocusIn(): void;
    /** @private */
    _onFocusOut(): void;
    /** @private */
    _onInput(): void;
    /** @private */
    _onItemClick(ev: CustomEvent): void;
    /** @private */
    _onItemFocusIn(ev: FocusEvent): void;
    /** @private */
    _onItemFocusOut(ev: FocusEvent): void;
    /** @private */
    _onKeyDown(ev: KeyboardEvent): void;
    /** @private */
    _onKeyUp(ev: KeyboardEvent): void;
    /** @private */
    _onOpenClick(): void;
    /** @private */
    _openList(): void;
    /** @private */
    _setListItems(items: HTMLElement | JtListItem[]): void;
    /** @private */
    _setValue(value: string): void;
    /** @private */
    _setup(): void;
    /** Clear the Input Element */
    clear(): void;
    /** @return Item Data matching the current Input (or null) */
    matchingItem(): JtListItem | null;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    connectedCallback(): void;
    static register(): void;
}
