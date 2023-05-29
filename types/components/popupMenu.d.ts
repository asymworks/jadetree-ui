/**
 * Jade Tree Popup Menu Component
 */
export default class JtPopupMenu extends HTMLElement {
    _id: string;
    _offset: number | null;
    _placement: string;
    _selector: string;
    _trigger?: HTMLElement;
    _target?: HTMLElement;
    /** @private */
    _onFocusIn(ev: Event): void;
    /** @private */
    _onFocusOut(ev: Event): void;
    /** @private */
    _position(): void;
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
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string): void;
    connectedCallback(): void;
    static register(): void;
}
