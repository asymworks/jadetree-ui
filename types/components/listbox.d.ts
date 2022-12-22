/**
 * Jade Tree ListBox Module
 * @module components/jt-combobox
 */
import { JtTokenList } from '../util/dom';
/**
 * List Box Item Data
 * @type JtListItemData
 */
export type JtListItemData = {
    key?: string;
    label?: string;
    value?: string;
    group?: JtListItemData[];
    disabled?: boolean;
    selected?: boolean;
    separator?: boolean;
    data?: object;
};
/**
 * List Box Item Source
 */
export type JtListItem = string | JtListItemData;
/**
 * List Box Item Render Data
 */
export type JtRenderItemData = JtListItemData & {
    creating?: boolean;
    empty?: boolean;
    focused?: boolean;
    groupLabel?: string;
    searchRegex?: RegExp;
    searchString?: string;
    type: string;
};
/** Item or Group Rendering Template */
export type JtListItemTemplate = (item: JtRenderItemData) => string;
/** @private Default List Item Rendering Template */
export declare const defaultItemTemplate: JtListItemTemplate;
/** @private Default Header Rendering Template */
export declare const defaultHeaderTemplate: JtListItemTemplate;
/**
 * List Box Options
 */
export type JtListBoxOptions = {
    canCreate?: boolean;
    canSelect?: boolean;
    cursorTimeout?: number;
    emptyTemplate?: JtListItemTemplate;
    filterRegex?: (search: string) => RegExp;
    groupHeaderClasses?: string[];
    groupHeaderTemplate?: JtListItemTemplate;
    groupListClasses?: string[];
    hideSelected?: boolean;
    itemClasses?: string[];
    itemTemplate?: JtListItemTemplate;
    listClasses?: string[];
    pageSize?: number;
    tabIndex?: number;
    type?: 'single' | 'multiple';
};
/**
 * List Box Widget
 */
export default class JtListBox {
    _composing: boolean;
    _cursorMoving: boolean;
    _filter: string;
    _focused: string;
    _groupClassList: JtTokenList;
    _headerClassList: JtTokenList;
    _headerTemplate: JtListItemTemplate | null;
    _hover: string;
    _id: string;
    _itemClassList: JtTokenList;
    _itemTemplate: JtListItemTemplate | null;
    _listClassList: JtTokenList;
    _observer: MutationObserver;
    _options: JtListBoxOptions;
    _regex: RegExp | null;
    _root: HTMLUListElement;
    _selected: string[];
    /** @private */
    _adjustScroll(): void;
    /** @private */
    _createDom(items: HTMLElement | JtListItem[]): HTMLUListElement;
    /** @private */
    _createGroup(item: JtListItemData, replacing?: boolean): HTMLElement;
    /** @private */
    _createOption(item: JtListItemData, replacing?: boolean): HTMLElement;
    /** @private */
    _cursorMove(id: string): void;
    /** @private */
    _deselect(id: string): void;
    /** @private */
    _elementChanged(mutations: MutationRecord[]): void;
    /** @private */
    _elementToItemData(element: HTMLOptionElement | HTMLOptGroupElement, watch?: boolean): JtListItemData | null;
    /** @private */
    _isSelectable(el: HTMLElement): boolean;
    /** @private */
    _isSelected(id: string): boolean;
    /** @private */
    _labelForId(id: string): string | undefined;
    /** @private */
    _onClick(ev: MouseEvent): void;
    /** @private */
    _onPointerEnter(ev: MouseEvent): void;
    /** @private */
    _onPointerLeave(ev: MouseEvent): void;
    /** @private */
    _renderItem(li: HTMLElement): void;
    /** @private */
    _select(id: string): void;
    /** @private */
    _setFocus(id?: string): void;
    /** @private */
    _setHover(id?: string): void;
    /** @private */
    _updateItems(): void;
    /** @private */
    _userClassChanged(item: 'group' | 'header' | 'item' | 'list', op: 'add' | 'remove', ...tokens: string[]): void;
    /** @private */
    _valueForId(id: string): string | undefined;
    /** @private */
    _visibleIds(): string[];
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
    add(item: HTMLOptGroupElement | HTMLOptionElement | JtListItem, index?: number | string | null): HTMLElement | null;
    /** Clear the Selected Item */
    clear(): void;
    /**
     * De-Select an Item by Value
     * @param value Item Value
     */
    deselect(value: string): void;
    /**
     * Clean up the List Box Data prior to being unloaded
     */
    disconnect(): void;
    /** Clear the Focus */
    focusClear(): void;
    /**
     * Move the focus to the next selectable option. If the focus is already
     * on the last option, the focus does not move.
     */
    focusDown(): void;
    /**
     * Move the focus to the last selectable option. If the focus is already
     * on the last option, the focus does not move.
     */
    focusEnd(): void;
    /**
     * Move the focus to the first selectable option. If the focus is already
     * on the first option, the focus does not move.
     */
    focusHome(): void;
    /**
     * Move the focus down 10 (or the number provided in the
     * {@link JtListBoxOptions.pageSize} option) items, or to the last option.
     */
    focusPageDown(): void;
    /**
     * Move the focus up 10 (or the number provided in the
     * {@link JtListBoxOptions.pageSize} option) items, or to the first option.
     */
    focusPageUp(): void;
    /**
     * Move the focus to the first selected option.  If there is no selected
     * options, the first item is selected.
     */
    focusSelected(): void;
    /**
     * Select the next Item by the First Letters (select box typeahead)
     * @param query Item Query String
     * @return If a match was found
     */
    focusTypeahead(query: string): void;
    /**
     * Move the focus to the next selectable option. If the focus is already
     * on the first option, the focus does not move.
     */
    focusUp(): void;
    /**
     * Move the focus to an option by value. If the option is not found or is
     * not selectable, the focus does not move. Returns `true` if an item was
     * found and selected, `false` otherwise.
     */
    focusValue(value: string): boolean;
    /**
     * Remove an Item by Index or Value
     * @param index Index or Item Key where the item will be added. If the
     *  provided value is an item key (string), the new item will be inserted
     *  before the referenced item.  If no index is provided, the item will be
     *  inserted at the end.
     */
    remove(index: number | string): void;
    /**
     * Select an Item by Value
     * @param value Item Value
     */
    select(value: string): void;
    /**
     * Toggle an Item by Value
     * @param value Item Value
     */
    toggle(value: string): void;
    /** @return Selected Item Label(s) */
    get displayText(): string | string[];
    /** @return If the list has Selectable Options */
    get empty(): boolean;
    /** @return Current Filter String */
    get filter(): string;
    /** @param filter Filter String */
    set filter(filter: string);
    /** @return Option Id that is currently Active */
    get focusedId(): string;
    /** @return Option Value that is currently Active */
    get focusedValue(): string;
    /** @return User Class List for Group Lists */
    get groupClassList(): DOMTokenList;
    /** @return User Class List for Group Headers */
    get headerClassList(): DOMTokenList;
    /** @return User Template for Group Headers */
    get headerTemplate(): JtListItemTemplate;
    /** @param template New User Template for Group Headers */
    set headerTemplate(template: JtListItemTemplate | null);
    /** @return User Class List for Listbox */
    get listClassList(): DOMTokenList;
    /** @return User Class List for List Items */
    get itemClassList(): DOMTokenList;
    /** @return User Template for List Items */
    get itemTemplate(): JtListItemTemplate;
    /** @param template New User Template for List Items */
    set itemTemplate(template: JtListItemTemplate | null);
    /** @return List Box Root Element */
    get root(): HTMLUListElement;
    /** @return Current Selection */
    get value(): string | string[];
    /**
     * Set the Current Selection
     * @param value New Selection
     */
    set value(value: string | string[]);
    constructor(id: string, items: HTMLElement | JtListItem[], options?: JtListBoxOptions);
}
