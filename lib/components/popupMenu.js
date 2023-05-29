/**
 * Jade Tree Popup Menu Component
 */
import uid from '../util/uid';
export default class JtPopupMenu extends HTMLElement {
    /** @private */
    _onFocusIn(ev) {
        if ((ev.currentTarget instanceof Element) && ev.currentTarget.closest(`#${this._id}`)) {
            this.open();
        }
    }
    /** @private */
    _onFocusOut(ev) {
        if ((ev.currentTarget instanceof Element) && ev.currentTarget.closest(`#${this._id}`)) {
            this.close();
        }
    }
    /** @private */
    _setup() {
        if (!this.isConnected)
            return;
        if (!this.hasAttribute('id'))
            this.setAttribute('id', this._id);
        this._trigger = this.querySelector('[slot=trigger]');
        this._target = this.querySelector('[slot=target]');
        this._target.classList.add('jt-popup__target');
        if (!this._target.hasAttribute('id'))
            this._target.setAttribute('id', `${this._id}-menu`);
        const container = document.createElement('div');
        container.classList.add('jt-popup');
        container.setAttribute('aria-haspopup', 'true');
        container.setAttribute('aria-controls', this._target.getAttribute('id'));
        container.setAttribute('aria-expanded', 'false');
        container.appendChild(this._trigger);
        container.appendChild(this._target);
        this.appendChild(container);
        this._trigger.addEventListener('focusin', (ev) => this._onFocusIn(ev));
        this._trigger.addEventListener('focusout', (ev) => this._onFocusOut(ev));
    }
    /**
     * Close the Popup Menu
     */
    close() {
        this.querySelector('div').setAttribute('aria-expanded', 'false');
    }
    /**
     * Open the Popup Menu
     */
    open() {
        this.querySelector('div').setAttribute('aria-expanded', 'true');
    }
    /* -- Constructor -- */
    constructor() {
        super();
        this._id = this.getAttribute('id') || uid('jt-popup-menu');
    }
    connectedCallback() {
        // Set up the component after the rendering loop finishes
        setTimeout(() => this._setup(), 0);
    }
    /* -- Web Component Registration Helper -- */
    static register() {
        customElements.define("jt-popup-menu", JtPopupMenu);
    }
}
// Auto-Register the Web Component in an IIFE
if (typeof __ROLLUP_IIFE === 'boolean' && __ROLLUP_IIFE) {
    JtPopupMenu.register();
}
