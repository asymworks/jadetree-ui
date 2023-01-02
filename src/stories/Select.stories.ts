import '../scss/select.scss';

import { useEffect } from '@storybook/addons';
import { Story, Meta } from '@storybook/html';

import JtSelect from '../components/select';
import { JtListItem } from '../components/listbox';

if (!customElements.get('jt-select')) {
    customElements.define("jt-select", JtSelect);
}

type SelectProps = {
    clearable?: boolean;
    disabled?: boolean;
    placeholder?: string;
    readonly?: boolean;
    searchable?: boolean;
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
    title: 'Jade Tree/Select',
    argTypes: {
        clearable: { control: 'boolean' },
        disabled: { control: 'boolean' },
        readonly: { control: 'boolean' },
        searchable: { control: 'boolean' },
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

const InputElement: (args: SelectProps, id: string) => string = (args, id) => {
    return `<select 
        id="${id}"
        name="${id}"
        ${ args.disabled ? ' disabled' : ''} 
        ${ args.readonly ? ' readonly' : '' }
    >
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
    </select>`.replace(/\s\s+/g, ' ');
};

const Template: Story<SelectProps> = (args) => {
    return `
<label for="jt__default">Select an Item</label>
<jt-select${ args.clearable ? ' clearable' : ''}${ args.searchable ? ' searchable' : ''}${ args.placeholder ? ' placeholder="' + args.placeholder + '"' : '' }>
    ${InputElement(args, 'jt__default')}
</jt-autocomplete>
`;
}

export const Default = Template.bind({});
Default.args = {
    clearable: false,
    disabled: false,
    placeholder: '',
    readonly: false,
    searchable: false,
};

export const Searchable = Template.bind({});
Searchable.args = {
    clearable: false,
    disabled: false,
    placeholder: '',
    readonly: false,
    searchable: true,
};
