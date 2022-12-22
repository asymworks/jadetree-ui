// import { beforeEach, describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom';
import { screen, within } from '@testing-library/dom';
import { JSDOM } from 'jsdom';
import JtListBox, { JtListBoxOptions, JtListItem } from '../src/components/listbox';

beforeEach(() => {
    const dom = new JSDOM(
        `<html><head></head><body></body></html>`,
        { url: 'http://localhost' },
    );

    global.window = dom.window as unknown as Window & typeof globalThis;
    global.document = dom.window.document;
});

describe('List Box Component', () => {
    describe('Constructor', () => {
        it('Should accept an empty list as a constructor', () => {
            expect(() => new JtListBox('test', [])).not.toThrow();
        });
        it('Should accept a <select> element as a constructor', () => {
            document.body.innerHTML = 
                `<select>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                </select>`;
            const select = document.querySelector('select');
            expect(select).not.toBeNull();
            expect(select).toBeInstanceOf(HTMLElement);
            expect(() => new JtListBox('test', select as HTMLSelectElement)).not.toThrow();
        });
        it('Should accept a <datalist> element as a constructor', () => {
            document.body.innerHTML = 
                `<datalist>
                    <option value="Option 1"></option>
                    <option value="Option 2"></option>
                </datalist>`;
            const datalist = document.querySelector('datalist');
            expect(datalist).not.toBeNull();
            expect(() => new JtListBox('test', datalist as HTMLDataListElement)).not.toThrow();
        });
        it('Should accept a JtListItemData[] array as a constructor', () => {
            const items: JtListItem[] = [
                { label: 'Option 1' },
                { label: 'Option 2' },
            ];
            expect(() => new JtListBox('test', items)).not.toThrow();
        });
        it('Should accept a string[] array as a constructor', () => {
            const items: JtListItem[] = [
                'Option 1',
                'Option 2',
            ];
            expect(() => new JtListBox('test', items)).not.toThrow();
        });
        it('Should log an error if not provided an HTMLElement or JtListItemData[]', () => {
            const errSpy = jest.spyOn(console, 'error').mockImplementation((...args) => {});
            expect(() => new JtListBox('test', {} as HTMLElement)).not.toThrow();
            expect(errSpy).toHaveBeenCalledWith('Unexpected type "object" provided to _createDom', {});
        });
        it('Should log a warning if an unexpected element is passed', () => {
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation((...args) => {});
            document.body.innerHTML = 
                `<div>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <p>Should not be here</p>
                </div>`;
            const div = document.querySelector('div');
            expect(() => new JtListBox('test', div as HTMLElement)).not.toThrow();
            expect(warnSpy).toBeCalledWith('Unexpected element p in <div>');
        });
    });
    describe('ListBox DOM', () => {
        it('Should generate a <ul role=listbox> root element', () => {
            const box = new JtListBox('test-id', []);
            document.body.innerHTML = '';
            document.body.appendChild(box.root);

            const listbox = screen.getByRole('listbox');
            expect(listbox).toBe(box.root);
            expect(listbox.id).toEqual('test-id');
            expect(listbox.nodeName).toEqual('UL');
        });
        it('Should default to a single-select list type', () => {
            const box = new JtListBox('test-id', []);
            expect(box.root).not.toBeNull();
            expect(box.root.dataset.type).toEqual('single');
        });
        it('Should support a multiple-select list type', () => {
            const box = new JtListBox('test-id', [], { type: 'multiple' });
            expect(box.root).not.toBeNull();
            expect(box.root.dataset.type).toEqual('multiple');
        });
        it('Should set the jt-listbox CSS class on the listbox', () => {
            document.body.innerHTML = '';
            document.body.appendChild((new JtListBox('test-id', [])).root);

            const listbox = screen.getByRole('listbox');
            expect(listbox).toHaveClass('jt-listbox');
        });
        it('Should accept custom CSS classes for the listbox', () => {
            const options: JtListBoxOptions = {
                listClasses: [ 'test-class-1', 'test-class-2' ],
            };

            document.body.innerHTML = '';
            document.body.appendChild((new JtListBox('test-id', [], options)).root);

            const listbox = screen.getByRole('listbox');
            expect(listbox).toHaveClass('test-class-1');
            expect(listbox).toHaveClass('test-class-2');
        });
        it('Should accept a tabindex option', () => {
            const opts: JtListBoxOptions = { tabIndex: 0 };
            document.body.innerHTML = '';
            document.body.appendChild((new JtListBox('test-id', [], opts)).root);

            const listbox = screen.getByRole('listbox');
            expect(listbox).toHaveAttribute('tabindex', '0');
        });
    });
    describe('List Item DOM', () => {
        it('Should generate <li role=option> for selectable <option> elements', async () => {
            document.body.innerHTML = 
                `<select>
                    <option value="1">Option 1</option>
                    <option>Option 2</option>
                </select>`;
            const listData = [
                { value: '1', label: 'Option 1' },
                'Option 2',
            ]

            async function check(data: HTMLElement | JtListItem[]) {
                const box = new JtListBox('test-id', data);
                document.body.appendChild(box.root);

                const items = await within(box.root).findAllByRole('option');

                expect(items).toHaveLength(2);
                expect(items[0]).toHaveTextContent('Option 1');
                expect(items[0]).toHaveClass('jt-listbox__item');
                expect(items[0].dataset.label).toEqual('Option 1');
                expect(items[0].dataset.value).toEqual('1');
                expect(items[1]).toHaveTextContent('Option 2');
                expect(items[1]).toHaveClass('jt-listbox__item');
                expect(items[1].dataset.label).toEqual('Option 2');
                expect(items[1].dataset.value).toEqual('Option 2');
            }

            await check(document.querySelector('select') as HTMLSelectElement);
            await check(listData);
        });
        it('Should generate <li role=separator> for separator <option> elements', async () => {
            document.body.innerHTML = 
                `<select>
                    <option value="1">Option 1</option>
                    <option data-role="separator"></option>
                    <option>Option 2</option>
                </select>`;
            const listData = [
                { value: '1', label: 'Option 1' },
                { separator: true },
                'Option 2',
            ]

            async function check(data: HTMLElement | JtListItem[]) {
                const box = new JtListBox('test-id', data);
                document.body.appendChild(box.root);

                const items = await within(box.root).findAllByRole('option');
                expect(items).toHaveLength(2);
                expect(items[0]).toHaveTextContent('Option 1');
                expect(items[0]).toHaveClass('jt-listbox__item');
                expect(items[0].dataset.label).toEqual('Option 1');
                expect(items[0].dataset.value).toEqual('1');
                expect(items[1]).toHaveTextContent('Option 2');
                expect(items[1]).toHaveClass('jt-listbox__item');
                expect(items[1].dataset.label).toEqual('Option 2');
                expect(items[1].dataset.value).toEqual('Option 2');

                const seps = await within(box.root).findAllByRole('separator')
                expect(seps).toHaveLength(1);
                expect(seps[0]).toHaveClass('jt-listbox__item');
                expect(seps[0].dataset.label).toBeUndefined();
                expect(seps[0].dataset.value).toBeUndefined();
            }

            await check(document.querySelector('select') as HTMLSelectElement);
            await check(listData);
        });
        it('Should ignore <option data-role=placeholder> elements', async () => {
            document.body.innerHTML = 
                `<select>
                    <option data-role="placeholder" selected disabled hidden>Select an Option</option>
                    <option value="1">Option 1</option>
                    <option>Option 2</option>
                </select>`;

            const box = new JtListBox(
                'test-id',
                document.querySelector('select') as HTMLSelectElement,
            );
            document.body.appendChild(box.root);

            const items = await within(box.root).findAllByRole('option');
            expect(items).toHaveLength(2);
            expect(items[0]).toHaveTextContent('Option 1');
            expect(items[0]).toHaveClass('jt-listbox__item');
            expect(items[0].dataset.label).toEqual('Option 1');
            expect(items[0].dataset.value).toEqual('1');
            expect(items[1]).toHaveTextContent('Option 2');
            expect(items[1]).toHaveClass('jt-listbox__item');
            expect(items[1].dataset.label).toEqual('Option 2');
            expect(items[1].dataset.value).toEqual('Option 2');
        });
        it('Should auto-generate a "No Items Found" presentation element', async () => {
            document.body.innerHTML = 
                `<select>
                    <option value="1">Option 1</option>
                    <option>Option 2</option>
                </select>`;
            const listData = [
                { value: '1', label: 'Option 1' },
                'Option 2',
            ]

            async function check(data: HTMLElement | JtListItem[]) {
                const box = new JtListBox('test-id', data);
                document.body.appendChild(box.root);

                const emptyPh = box.root.lastElementChild;
                expect(emptyPh).not.toBeNull();
                expect(emptyPh).toHaveAttribute('role', 'presentation');
                expect(emptyPh).toHaveClass('jt-listbox__item');
                expect(emptyPh).toHaveTextContent('No Items');
            }

            await check(document.querySelector('select') as HTMLSelectElement);
            await check(listData);
        });
        it('Should auto-generate a "Create Item" option element when canCreate is true', async () => {
            document.body.innerHTML = 
                `<select>
                    <option value="1">Option 1</option>
                    <option>Option 2</option>
                </select>`;
            const listData = [
                { value: '1', label: 'Option 1' },
                'Option 2',
            ]

            async function check(data: HTMLElement | JtListItem[]) {
                const box = new JtListBox('test-id', data, { canCreate: true });
                document.body.appendChild(box.root);
                box.filter = 'New Item';

                const emptyPh = box.root.querySelector('#test-id-empty');
                expect(emptyPh).not.toBeNull();
                expect(emptyPh).toHaveAttribute('role', 'option');
                expect(emptyPh).toHaveClass('jt-listbox__item');
            }

            await check(document.querySelector('select') as HTMLSelectElement);
            await check(listData);
        });
        it('Should auto-generate unique option keys when not provided', async () => {
            document.body.innerHTML = 
                `<select>
                    <option value="1">Option 1</option>
                    <option>Option 2</option>
                </select>`;
            const listData = [
                { value: "Option 1", label: "Option 1" },
                'Option 2',
            ]

            async function check(data: HTMLElement | JtListItem[]) {
                const box = new JtListBox('test-id', data);
                document.body.appendChild(box.root);

                const items = await within(box.root).findAllByRole('option');
                expect(items).toHaveLength(2);
                expect(items[0].id.startsWith('test-id-')).toEqual(true);
                expect(items[1].id.startsWith('test-id-')).toEqual(true);
                expect(items[0].id).not.toEqual(items[1].id);
            }

            await check(document.querySelector('select') as HTMLSelectElement);
            await check(listData);
        });
        it('Should accept option keys provided in data-key', async () => {
            document.body.innerHTML = 
                `<select>
                    <option value="1" data-key="id1">Option 1</option>
                    <option value="2" data-key="id2">Option 2</option>
                </select>`;
            const listData = [
                { key: "id1", value: "Option 1", label: "Option 1" },
                { key: "id2", value: "Option 2", label: "Option 2" },
            ]

            async function check(data: HTMLElement | JtListItem[]) {
                const box = new JtListBox('test-id', data);
                document.body.appendChild(box.root);

                const items = await within(box.root).findAllByRole('option');
                expect(items).toHaveLength(2);
                expect(items[0].id).toEqual('id1');
                expect(items[1].id).toEqual('id2');
            }

            await check(document.querySelector('select') as HTMLSelectElement);
            await check(listData);
        });
        it('Should accept <option> elements with only value attributes', async () => {
            document.body.innerHTML = 
                `<select>
                    <option value="Option 1"></option>
                    <option value="Option 2"></option>
                </select>`;
            const listData = [
                { value: "Option 1" },
                { value: "Option 2" },
            ]

            async function check(data: HTMLElement | JtListItem[]) {
                const box = new JtListBox('test-id', data);
                document.body.appendChild(box.root);

                const items = await within(box.root).findAllByRole('option');

                expect(items).toHaveLength(2);
                expect(items[0]).toHaveTextContent('Option 1');
                expect(items[0]).toHaveClass('jt-listbox__item');
                expect(items[0].dataset.label).toEqual('Option 1');
                expect(items[0].dataset.value).toEqual('Option 1');
                expect(items[1]).toHaveTextContent('Option 2');
                expect(items[1]).toHaveClass('jt-listbox__item');
                expect(items[1].dataset.label).toEqual('Option 2');
                expect(items[1].dataset.value).toEqual('Option 2');
            }

            await check(document.querySelector('select') as HTMLSelectElement);
            await check(listData);
        });
        it('Should accept <option disabled> elements', async () => {
            document.body.innerHTML = 
                `<select>
                    <option value="1">Option 1</option>
                    <option value="2" disabled>Option 2</option>
                </select>`;
            const listData = [
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2", disabled: true },
            ]

            async function check(data: HTMLElement | JtListItem[]) {
                const box = new JtListBox('test-id', data);
                document.body.appendChild(box.root);

                const items = await within(box.root).findAllByRole('option');

                expect(items).toHaveLength(2);
                expect(items[0]).toHaveTextContent('Option 1');
                expect(items[0]).toHaveClass('jt-listbox__item');
                expect(items[0].dataset.label).toEqual('Option 1');
                expect(items[0].dataset.value).toEqual('1');
                expect(items[1]).toHaveTextContent('Option 2');
                expect(items[1]).toHaveClass('jt-listbox__item');
                expect(items[1]).toHaveAttribute('aria-disabled', 'true');
                expect(items[1].dataset.label).toEqual('Option 2');
                expect(items[1].dataset.value).toEqual('2');
            }

            await check(document.querySelector('select') as HTMLSelectElement);
            await check(listData);
        });
        it('Should accept a single <option selected> elements in single-select mode', async () => {
            document.body.innerHTML = 
                `<select>
                    <option value="1">Option 1</option>
                    <option value="2" selected>Option 2</option>
                    <option value="3">Option 3</option>
                </select>`;
            const listData = [
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2", selected: true },
                { value: "3", label: "Option 3" },
            ]

            async function check(data: HTMLElement | JtListItem[]) {
                const box = new JtListBox('test-id', data);
                document.body.appendChild(box.root);

                const items = await within(box.root).findAllByRole('option');
                expect(items).toHaveLength(3);
                expect(items[0]).not.toHaveAttribute('aria-checked');
                expect(items[1]).not.toHaveAttribute('aria-checked');
                expect(items[2]).not.toHaveAttribute('aria-checked');
                expect(items[0]).not.toHaveAttribute('aria-selected');
                expect(items[2]).not.toHaveAttribute('aria-selected');
                expect(items[1]).toHaveAttribute('aria-selected');

                expect(box.value).toEqual('2');
            }

            await check(document.querySelector('select') as HTMLSelectElement);
            await check(listData);
        });
        it('Should accept a single <option selected> elements in multiple-select mode', async () => {
            document.body.innerHTML = 
                `<select>
                    <option value="1">Option 1</option>
                    <option value="2" selected>Option 2</option>
                    <option value="3">Option 3</option>
                </select>`;
            const listData = [
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2", selected: true },
                { value: "3", label: "Option 3" },
            ]

            async function check(data: HTMLElement | JtListItem[]) {
                const box = new JtListBox('test-id', data, { type: 'multiple' });
                document.body.appendChild(box.root);

                const items = await within(box.root).findAllByRole('option');
                expect(items).toHaveLength(3);
                expect(items[0]).not.toHaveAttribute('aria-selected');
                expect(items[1]).not.toHaveAttribute('aria-selected');
                expect(items[2]).not.toHaveAttribute('aria-selected');
                expect(items[0]).not.toHaveAttribute('aria-checked');
                expect(items[2]).not.toHaveAttribute('aria-checked');
                expect(items[1]).toHaveAttribute('aria-checked');
                expect(box.value).toHaveLength(1);
                expect(box.value).toEqual(['2']);
            }

            await check(document.querySelector('select') as HTMLSelectElement);
            await check(listData);
        });
        it('Should log a warning for multiple <option selected> elements in single-select mode', async () => {
            document.body.innerHTML = 
                `<select>
                    <option value="1">Option 1</option>
                    <option value="2" selected>Option 2</option>
                    <option value="3" selected>Option 3</option>
                </select>`;
            const listData = [
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2", selected: true },
                { value: "3", label: "Option 3", selected: true },
            ]

            async function check(data: HTMLElement | JtListItem[]) {
                const warnSpy = jest.spyOn(console, 'warn').mockImplementation((...args) => {});

                const box = new JtListBox('test-id', data);
                document.body.appendChild(box.root);

                expect(warnSpy).toBeCalledWith(`Multiple selected options provided to ${box.root.id}`);

                const items = await within(box.root).findAllByRole('option');
                expect(items).toHaveLength(3);
                expect(items[0]).not.toHaveAttribute('aria-checked');
                expect(items[1]).not.toHaveAttribute('aria-checked');
                expect(items[2]).not.toHaveAttribute('aria-checked');
                expect(items[0]).not.toHaveAttribute('aria-selected');
                expect(items[1]).not.toHaveAttribute('aria-selected');
                expect(items[2]).toHaveAttribute('aria-selected');
                expect(box.value).toEqual('3');
            }

            await check(document.querySelector('select') as HTMLSelectElement);
            await check(listData);
        });
        it('Should accept multiple <option selected> elements in multiple-select mode', async () => {
            document.body.innerHTML = 
                `<select>
                    <option value="1">Option 1</option>
                    <option value="2" selected>Option 2</option>
                    <option value="3" selected>Option 3</option>
                </select>`;
            const listData = [
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2", selected: true },
                { value: "3", label: "Option 3", selected: true },
            ]

            async function check(data: HTMLElement | JtListItem[]) {
                const box = new JtListBox('test-id', data, { type: 'multiple' });
                document.body.appendChild(box.root);

                const items = await within(box.root).findAllByRole('option');
                expect(items).toHaveLength(3);
                expect(items[0]).not.toHaveAttribute('aria-selected');
                expect(items[1]).not.toHaveAttribute('aria-selected');
                expect(items[2]).not.toHaveAttribute('aria-selected');
                expect(items[0]).not.toHaveAttribute('aria-checked');
                expect(items[1]).toHaveAttribute('aria-checked');
                expect(items[2]).toHaveAttribute('aria-checked');
                expect(box.value).toHaveLength(2);
                expect(box.value).toEqual(['2', '3']);
            }

            await check(document.querySelector('select') as HTMLSelectElement);
            await check(listData);
        });
        it('Should create headers and sub-lists for <optgroup> items', async () => {
            document.body.innerHTML = 
                `<select>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <optgroup label="Group">
                        <option value="3">Option 3</option>
                        <option>Option 4</option>
                    </optgroup>
                </select>`;
            const listData = [
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { label: 'Group', group:
                    [
                        { 'value': '3', label: 'Option 3' },
                        { 'label': 'Option 4' },
                    ],
                },
            ];

            async function check(data: HTMLElement | JtListItem[]) {
                const box = new JtListBox('test-id', data, { type: 'multiple' });
                document.body.appendChild(box.root);

                const items = await within(box.root).findAllByRole('option');
                expect(items).toHaveLength(4);
                expect(items[0]).toHaveTextContent('Option 1');
                expect(items[0]).toHaveClass('jt-listbox__item');
                expect(items[0].dataset.label).toEqual('Option 1');
                expect(items[0].dataset.value).toEqual('1');
                expect(items[1]).toHaveTextContent('Option 2');
                expect(items[1]).toHaveClass('jt-listbox__item');
                expect(items[1].dataset.label).toEqual('Option 2');
                expect(items[1].dataset.value).toEqual('2');
                expect(items[2]).toHaveTextContent('Option 3');
                expect(items[2]).toHaveClass('jt-listbox__item');
                expect(items[2].dataset.label).toEqual('Option 3');
                expect(items[2].dataset.value).toEqual('3');
                expect(items[3]).toHaveTextContent('Option 4');
                expect(items[3]).toHaveClass('jt-listbox__item');
                expect(items[3].dataset.label).toEqual('Option 4');
                expect(items[3].dataset.value).toEqual('Option 4');

                const groups = await within(box.root).findAllByRole('group');
                expect(groups).toHaveLength(1);

                const grpHdr = await within(groups[0]).findByRole('presentation');
                expect(grpHdr).toHaveTextContent('Group');

                const grpItems = await within(groups[0]).findAllByRole('option');
                expect(grpItems).toHaveLength(2);
                expect(grpItems[0]).toBe(items[2]);
                expect(grpItems[1]).toBe(items[3]);
            }

            await check(document.querySelector('select') as HTMLSelectElement);
            await check(listData);
        });
    });
});