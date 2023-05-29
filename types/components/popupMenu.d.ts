/**
 * Jade Tree Popup Menu Component
 */
export default class JtPopupMenu extends HTMLElement {
    _id: string;
    _trigger?: HTMLElement;
    _target?: HTMLElement;
    /** @private */
    _onFocusIn(ev: FocusEvent): void;
    /** @private */
    _onFocusOut(ev: FocusEvent): void;
    /** @private */
    _setup(): void;
    /**
     * Close the Popup Menu
     */
    close(): void;
    /**
     * Open the Popup Menu
     */
    open(): void;
    constructor();
    connectedCallback(): void;
    static register(): void;
}
