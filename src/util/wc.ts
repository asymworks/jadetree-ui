/**
 * Web Component Helpers
 */
import { htmlToElement } from './dom';

export class BaseComponent extends HTMLElement {
  _root?: Element;
  get root(): Element | null { return this._root }
  loadTemplate(id: string): string | null {
    const template = document.getElementById(id)?.cloneNode(true);
    if (template instanceof HTMLTemplateElement) {
        this.promoteStyles(template.content);
        return template.innerHTML;
    }
    return null;
  }
  promoteStyles(element) {
    element
        .querySelectorAll('style')
        .forEach((el) => this._root.insertAdjacentElement('beforebegin', el));
  }
  constructor(root = 'div', style?: string) {
    super();
    if (root[0] === '<') {
        this._root = htmlToElement(root);
    } else {
        this._root = document.createElement(root);
    }
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(this._root);
    if (style) {
        this._root.insertAdjacentHTML('beforebegin', `<style>${style}</style>`);
    }
    this.promoteStyles(this);
  }
}

export class FormComponent extends BaseComponent {
  static formAssociated = true;
  _internals: ElementInternals;
  _value?: string | File | FormData;
  get form() { return this._internals.form }
  get name() { return this.getAttribute('name') }
  get type() { return this.localName }
  get value() { return this._value }
  set value(value: string | File | FormData) {
    this._value = value;
    this._internals.setFormValue(value);
  }
  constructor(root?: string, style?: string) {
    super(root, style);
    this._internals = this.attachInternals();
  }
}