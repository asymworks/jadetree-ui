import './base.css';
import '../scss/autocomplete.scss';

import { useEffect } from '@storybook/addons';
import { Story, Meta } from '@storybook/html';

import JtAutocomplete from '../components/autocomplete';
import { JtListItem } from '../components/listbox';

if (!customElements.get('jt-autocomplete')) {
    customElements.define("jt-autocomplete", JtAutocomplete);
}

type AutocompleteProps = {
    accentColor?: string;
    clearable?: boolean;
    disabled?: boolean;
    placeholder?: string;
    readonly?: boolean;
    type?: 'text' | 'search' | 'email' | 'tel' | 'url';
    value?: string;
};

const MOCK_DATA: JtListItem[] = [
    'Apples',
    'Asparagus',
    { label: 'Bananas', disabled: true },
    'Bread',
    { separator: true },
    'Cereal',
    'Cheese',
    'Cream',
    'Eggs',
];

export default {
    title: 'Jade Tree/Autocomplete',
    argTypes: {
        accentColor: { control: 'color' },
        clearable: { control: 'boolean' },
        disabled: { control: 'boolean' },
        readonly: { control: 'boolean' },
        type: {
            control: 'select',
            options: [ 'text', 'search', 'email', 'tel', 'url' ],
        }
    },
    parameters: {
        mockData: [
            {
                url: 'https://mock-api.jadetree.io/groceries',
                method: 'GET',
                status: 200,
                response: MOCK_DATA,
            },
        ],
    },
    decorators: [
        (storyFn) => {
            useEffect(() => {
                // strangely a fixed height is generated only in Firefox, so 
                // unset it and add a min-height to show the whole drop-down
                // list in the page
                document.querySelectorAll('.innerZoomElementWrapper').forEach((el) => {
                    const ctnr = el.parentElement;
                    if (ctnr instanceof HTMLElement) {
                        ctnr.style.height = 'unset';
                        ctnr.style.minHeight = '12em';
                    }
                });
            }, []);
            return storyFn();
        }
    ],
} as Meta;

const InputElement: (args: AutocompleteProps, id: string) => string = (args, id) => {
    return `<input 
        autocomplete="off"
        type="${ args.type }"
        id="${id}"
        name="${id}"
        list="example-list"
        ${ args.disabled ? ' disabled' : ''} 
        ${ args.readonly ? ' readonly' : '' }
        ${ args.placeholder ? ' placeholder="' + args.placeholder + '"' : '' }
        ${ args.value ? ' value="' + args.value + '"' : '' }
    />`.replace(/\s\s+/g, ' ');
};

const DataList = `<datalist id="example-list">
        <option>Apples</option>
        <option>Asparagus</option>
        <option disabled>Bananas</option>
        <option>Bread</option>
        <option data-role="separator"></option>
        <option>Cereal</option>
        <option>Cheese</option>
        <option>Cream</option>
        <option>Eggs</option>
        <optgroup label="Meat">
            <option>Beef</option>
            <option>Chicken</option>
            <option>Lamb</option>
            <option>Pork</option>
        </optgroup>
        <option>Flour</option>
        <option>Granola</option>
        <option>Ham</option>
        <option>Ice Cream</option>
        <option>Jam</option>
        <option>KitKat</option>
        <option>Lemons</option>
        <option>Limes</option>
    </datalist>`;

const Template: Story<AutocompleteProps> = (args) => {
    return `
<label for="jt__default">Select an Item</label>
<jt-autocomplete${ args.clearable ? ' clearable' : ''}${ args.accentColor ? ' style="--jt-accent-color:' + args.accentColor + ';"' : ''}>
    ${InputElement(args, 'jt__default')}
    ${DataList}
</jt-autocomplete>
`;
}

export const Default = Template.bind({});
Default.args = {
    clearable: false,
    disabled: false,
    placeholder: '',
    readonly: false,
    type: 'text',
    value: '',
};

export const API: Story<AutocompleteProps> = (args) => {
    return `
<label for="jt__api">Select an Item</label>
<jt-autocomplete${ args.clearable ? ' clearable' : ''}${ args.accentColor ? ' style="--jt-accent-color:' + args.accentColor + ';"' : ''} src="https://mock-api.jadetree.io/groceries">
    ${InputElement(args, 'jt__api')}
</jt-autocomplete>
`;
}
API.args = {
    clearable: false,
    disabled: false,
    placeholder: '',
    readonly: false,
    type: 'text',
    value: '',
};

export const UserTemplate: Story<AutocompleteProps> = (args) => {
    return `
<label for="jt__tmpl">
<jt-autocomplete${ args.clearable ? ' clearable' : ''}${ args.accentColor ? ' style="--jt-accent-color:' + args.accentColor + ';"' : ''} headerTemplate="header-tmpl" itemTemplate="item-tmpl">
    ${InputElement(args, 'jt__tmpl')}
    ${DataList}
</jt-autocomplete>
<template id="header-tmpl"><span style="font-weight:bold">Group: </span>\${ item.label }</template>
<template id="item-tmpl"><span style="font-weight:bold">Item: </span>\${ item.label }</template>
`;
}
UserTemplate.args = {
    clearable: false,
    disabled: false,
    placeholder: '',
    readonly: false,
    type: 'text',
    value: '',
};
