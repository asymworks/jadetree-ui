export declare class BaseComponent extends HTMLElement {
    _root?: Element;
    get root(): Element | null;
    loadTemplate(id: string): string | null;
    promoteStyles(element: any): void;
    constructor(root?: string, style?: string);
}
export declare class FormComponent extends BaseComponent {
    static formAssociated: boolean;
    _internals: ElementInternals;
    _value?: string | File | FormData;
    get form(): HTMLFormElement;
    get name(): string;
    get type(): string;
    get value(): string | File | FormData;
    set value(value: string | File | FormData);
    constructor(root?: string, style?: string);
}
