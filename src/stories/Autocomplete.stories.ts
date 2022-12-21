import { Story, Meta } from '@storybook/html';
import JtAutocomplete from '../autocomplete';
import { JtListItem } from '../listbox';

if (!customElements.get('jt-autocomplete')) {
    customElements.define("jt-autocomplete", JtAutocomplete);
}

type AutocompleteProps = {
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
} as Meta;

const Template: Story<AutocompleteProps> = (args) => {
    return `
<jt-autocomplete${ args.clearable ? ' clearable' : ''}>
    <input 
        autocomplete="off"
        type="${ args.type }"
        id="example"
        name="example"
        list="example-list"
        ${ args.disabled ? ' disabled' : ''} 
        ${ args.readonly ? ' readonly' : '' }
        ${ args.placeholder ? ' placeholder="' + args.placeholder + '"' : '' }
        ${ args.value ? ' value="' + args.value + '"' : '' }
    />
    <datalist id="example-list">
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
    </datalist>
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

export const API = (args) => {
    return `
<jt-autocomplete${ args.clearable ? ' clearable' : ''} src="https://mock-api.jadetree.io/groceries">
    <input 
        autocomplete="off"
        type="${ args.type }"
        id="example"
        name="example"
        list="example-list"
        ${ args.disabled ? ' disabled' : ''} 
        ${ args.readonly ? ' readonly' : '' }
        ${ args.placeholder ? ' placeholder="' + args.placeholder + '"' : '' }
        ${ args.value ? ' value="' + args.value + '"' : '' }
    />
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