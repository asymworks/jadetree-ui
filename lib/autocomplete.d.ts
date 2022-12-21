/**
 * Jade Tree Autocomplete Text Input Component
 */
import './scss/autocomplete.scss';
import JtListBox, { JtListBoxOptions, JtListItem } from './listbox';
export default class JtAutocomplete extends HTMLElement {
    _btnOpen: HTMLButtonElement;
    _btnClear?: HTMLButtonElement;
    _btnClose: HTMLButtonElement;
    _listbox?: JtListBox;
    _listboxFocused: boolean;
    _listboxLoaded: boolean;
    _listboxSource: string;
    _input: HTMLInputElement;
    _id: string;
    _mode: string;
    _observer: MutationObserver;
    _textboxFocused: boolean;
    get disabled(): boolean;
    set disabled(value: boolean);
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
    _onClick(): void;
    /** @private */
    _onDocumentClick(ev: Event): void;
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
    clear(): void;
    constructor();
    static register(): void;
}
declare global {
    const __ROLLUP_IIFE: boolean;
}
