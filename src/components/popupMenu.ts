/**
 * Jade Tree Popup Menu Component
 */

import { 
    autoUpdate,
    computePosition,
    flip,
    offset,
    shift,
    Placement,
} from '@floating-ui/dom';
import { rovingIndex } from 'roving-ux';
import uid from '../util/uid';

export default class JtPopupMenu extends HTMLElement {
    _id: string;
    _offset: number | null;
    _placement: string;
    _selector: string;
    _trigger?: HTMLElement;
    _target?: HTMLElement;

    /** @private */
    _onFocusIn(ev: Event) {
        if ((ev.currentTarget instanceof Element) && ev.currentTarget.closest(`#${this._id}`)) {
            this.open();
            this._position();
        }
    }

    /** @private */
    _onFocusOut(ev: Event) {
        if ((ev.currentTarget instanceof Element) && ev.currentTarget.closest(`#${this._id}`)) {
            this.close();
        }
    }

    /** @private */
    _position() {
        const alignment = this.getAttribute('alignment') || 'center';
        const placement = this.getAttribute('placement') || 'right';

        this._offset = this.getAttribute('offset')
            ? parseInt(this.getAttribute('offset'))
            : null;
        this._placement = `${placement}${alignment !== 'center' ? '-' + alignment : ''}`;
        this._selector = this.getAttribute('selector') || 'button';

        if (!this._trigger || !this._target) return;

        autoUpdate(this._trigger, this._target, () => {
            computePosition(this._trigger, this._target, {
                placement: this._placement as Placement,
                middleware: [
                    flip(),
                    shift(),
                    this._offset && offset(this._offset),
                ]
            }).then(({x, y}) => {
                Object.assign(this._target.style, {
                    left: `${x}px`,
                    top: `${y}px`, 
                });
            });
        });
    }

    /** @private */
    _setup() {
        if (!this.isConnected) return;
        if (!this.hasAttribute('id')) this.setAttribute('id', this._id);

        this._trigger = this.querySelector('[slot=trigger]');
        this._target = this.querySelector('[slot=target]');
        this._target.classList.add('jt-popup__popup');
        if (!this._target.hasAttribute('id')) this._target.setAttribute('id', `${this._id}-menu`);

        const container = document.createElement('div');
        container.classList.add('jt-popup');
        container.setAttribute('aria-haspopup', 'true');
        container.setAttribute('aria-controls', this._target.getAttribute('id'));
        container.setAttribute('aria-expanded', 'false');

        container.appendChild(this._trigger);
        container.appendChild(this._target);

        this.appendChild(container);

        rovingIndex({ 
            element: container,
            target: `[slot=target] ${this._selector}`,
        });

        container.addEventListener('focusin', (ev: FocusEvent) => this._onFocusIn(ev));
        container.addEventListener('focusout', (ev: FocusEvent) => this._onFocusOut(ev));
        container.addEventListener('keyup', (ev: KeyboardEvent) => (ev.code === 'Escape' && ev.target instanceof HTMLElement) && ev.target.blur());

        this._trigger.setAttribute('tabindex', '-1');
        this._trigger.addEventListener('click', () => {
            const e = this.querySelector(`[slot=target] ${this._selector}`);
            (e instanceof HTMLElement) && e.focus();
        });
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

    /* -- Web Component Lifecycle Hooks --*/
    static get observedAttributes(): string[] {
        return [
            'alignment',
            'placement',
            'offset',
        ];
    }

    attributeChangedCallback(name: string) {
        switch (name) {
            case 'alignment':
            case 'placement':
            case 'offset':
                this._position();
                break;
        }
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
