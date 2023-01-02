/**
 * Jade Tree Autocomplete Text Input Component
 */
import JtListBox, { JtListBoxOptions, JtListItem, JtListItemTemplate } from './listbox';
export default class JtSelect extends HTMLElement {
    _btnClear?: HTMLButtonElement;
    _btnClose: HTMLButtonElement;
    _control: HTMLDivElement;
    _controlFocused: boolean;
    _filter: string;
    _filterInput: HTMLInputElement;
    _headerTemplate: JtListItemTemplate | null;
    _listbox?: JtListBox;
    _listboxFocused: boolean;
    _listboxLoaded: boolean;
    _id: string;
    _itemTemplate: JtListItemTemplate | null;
    _mode: string;
    _observer: MutationObserver;
    _select: HTMLSelectElement;
    _templateChanging: boolean;
    _tabIndex: number;
    _typeaheadTimer?: number;
    _typeaheadTimeout: number;
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
    get searchable(): boolean;
    set searchable(value: boolean);
    get value(): string | string[];
    /** @private */
    _checkListBox(): void;
    /** @private */
    _closeList(): void;
    /** @private */
    _controlMutated(list: MutationRecord[]): void;
    /** @private */
    _focusClear(): void;
    /** @private */
    _focusControl(): void;
    /** @private */
    _focusListbox(): void;
    /** @private */
    _listBoxOptions(): JtListBoxOptions;
    /** @private */
    _loadTemplate(template: string): JtListItemTemplate | null;
    /** @private */
    _onControlClick(): void;
    _onDocumentClick(ev: Event): void;
    /** @private */
    _onFilterInput(ev: InputEvent): void;
    /** @private */
    _onFocusIn(): void;
    /** @private */
    _onFocusOut(): void;
    /** @private */
    _onItemClick(ev: CustomEvent): void;
    /** @private */
    _onItemFocusIn(ev: FocusEvent): void;
    /** @private */
    _onItemFocusOut(ev: FocusEvent): void;
    _onKeyDown(ev: KeyboardEvent): void;
    /** @private */
    _openList(focusItem?: boolean): void;
    /** @private */
    _selectFocused(): void;
    /** @private */
    _selectValue(value: string): void;
    /** @private */
    _setListItems(items: HTMLElement | JtListItem[]): void;
    /** @private */
    _sync(): void;
    /** @private */
    _typeahead(char: string): void;
    /** @private */
    _update(): void;
    /** @private */
    _updateWidth(): void;
    /** Clear the Input Element */
    clear(): void;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    static register(): void;
}
