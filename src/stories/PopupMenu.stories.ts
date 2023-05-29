import './base.css';
import './PopupMenu.scss';
import '../scss/popup.scss';

import { useEffect } from '@storybook/addons';
import { StoryObj, Meta } from '@storybook/html';

import JtPopupMenu from '../components/popupMenu';

if (!customElements.get('jt-popup-menu')) {
    customElements.define("jt-popup-menu", JtPopupMenu);
}

type PopupMenuProps = {
    alignment?: 'center' | 'start' | 'end';
    placement?: 'top' | 'right' | 'bottom' | 'left';
    offset?: number;
};

export default {
    title: 'Jade Tree/Popup Menu',
    argTypes: {
        alignment: {
            options: [ 'center', 'start', 'end' ],
            control: { type: 'select' },
        },
        placement: {
            options: [ 'top', 'right', 'bottom', 'left' ],
            control: { type: 'select' },
        },
        offset: {
            control: { type: 'range', min: 0, max: 48 },
        }
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

type Story = StoryObj<PopupMenuProps>;

export const Default: Story = {
    render: (args: PopupMenuProps) => {
        return `
            <jt-popup-menu${ args.alignment ? ' alignment="' + args.alignment + '"' : ''}${ args.placement ? ' placement="' + args.placement + '"' : ''}${ (args.offset || 0) > 0 ? ' offset="' + args.offset + '"' : ''}>
                <span slot="trigger">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                    </svg>              
                </span>
                <ul slot="target">
                    <li><button>Option 1</button></li>
                    <li><button>Option 2</button></li>
                    <li><button>Option 3</button></li>
                </ul>
            </jt-popup-menu>
        `;
    }
}
