// import { beforeEach, describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom';
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { JSDOM } from 'jsdom';
import JtSelect from '../src/components/select';
import { waitForAttr, waitForRemovedAttr, waitForSelector } from './util/test-util';

const waitForJtSelect = () => waitForSelector('jt-select > .jt-control');

beforeAll(() => {
    customElements.define('jt-select', JtSelect);
});

describe('Select Component', () => {
    beforeEach(() => {
        const dom = new JSDOM(
            `<html><head></head><body></body></html>`,
            { url: 'http://localhost' },
        );

        global.window = dom.window as unknown as Window & typeof globalThis;
        global.document = dom.window.document;
    });
    describe('Basic Functionality', () => {
        it('should accept an empty child list', () => {
            document.body.innerHTML = `<jt-select></jt-select>`;
            const el = document.querySelector('jt-select') as JtSelect;
            expect(el).toBeDefined();
            expect(el).toBeInstanceOf(JtSelect);
            expect(within(el).queryByRole('combobox')).toBeNull();
        });
        it('should accept an <select> child', async () => {
            document.body.innerHTML = `<jt-select><select /></jt-select>`;
            const el = document.querySelector('jt-select') as JtSelect;
            await waitForJtSelect().then(() => {
                expect(el).toBeDefined();
                expect(el).toBeInstanceOf(JtSelect);
                expect(within(el).queryByRole('combobox')).not.toBeNull();
            });
        });
        it('should default to the enabled state', async () => {
            document.body.innerHTML = `<jt-select><select /></jt-select>`;
            await waitForJtSelect().then(() => {
                const el = document.querySelector('jt-select') as JtSelect;
                const input = within(el).getByRole('combobox') as HTMLDivElement;

                expect(el).toBeDefined();
                expect(el.disabled).toEqual(false);
                expect(el).not.toBeDisabled();
                expect(el).not.toHaveAttribute('aria-disabled');
                expect(input).not.toBeDisabled();
            });
        });
        it('should set the aria-disabled state from the child <select>', async () => {
            document.body.innerHTML = `<jt-select><select disabled /></jt-select>`;
            await waitForJtSelect().then(() => {
                const el = document.querySelector('jt-select') as JtSelect;
                const input = within(el).getByRole('combobox') as HTMLDivElement;

                expect(el).toBeDefined();
                expect(el.isConnected).toEqual(true);
                expect(el.disabled).toEqual(true);
                expect(el).toHaveAttribute('aria-disabled');
                expect(el).toBeDisabled();
                expect(input).toHaveAttribute('aria-disabled');
            });
        });
        it('should set the aria-disabled state from changing select.disabled', async () => {
            document.body.innerHTML = `<jt-select><select /></jt-select>`;
            const el = document.querySelector('jt-select') as JtSelect;

            await waitForJtSelect().then(() => {
                expect(el).toBeDefined();
                expect(el.disabled).toBe(false);
                expect(el.hasAttribute('aria-disabled')).toBeFalsy();
            });

            const input = el.querySelector('select') as HTMLSelectElement;
            expect(input.hasAttribute('disabled')).toBeFalsy();
            expect(input.disabled).toBeFalsy();

            input.disabled = true;
            await waitForAttr(el, 'disabled').then(() => {
                expect(el.disabled).toBe(true);
                expect(el.hasAttribute('aria-disabled')).toBeTruthy();
                expect(input.hasAttribute('disabled')).toBeTruthy();
                expect(input.disabled).toBeTruthy();
            });

            input.disabled = false;
            await waitForRemovedAttr(el, 'disabled').then(() => {
                expect(el.disabled).toBe(false);
                expect(el.hasAttribute('aria-disabled')).toBeFalsy();
                expect(input.hasAttribute('disabled')).toBeFalsy();
                expect(input.disabled).toBeFalsy();
            });
        });it('should set the aria-disabled state from changing selext[disabled]', async () => {
            document.body.innerHTML = `<jt-select><select /></jt-select>`;
            const el = document.querySelector('jt-select') as JtSelect;
            await waitForJtSelect();

            expect(el).toBeDefined();
            expect(el.disabled).toBe(false);
            expect(el.hasAttribute('aria-disabled')).toBeFalsy();
            const input = el.querySelector('select') as HTMLSelectElement;
            expect(input.hasAttribute('disabled')).toBeFalsy();
            expect(input.disabled).toBeFalsy();

            input.setAttribute('disabled', '');
            await waitForAttr(el, 'disabled').then(() => {
                expect(el.disabled).toBe(true);
                expect(el.hasAttribute('aria-disabled')).toBeTruthy();
                expect(input.hasAttribute('disabled')).toBeTruthy();
                expect(input.disabled).toBeTruthy();
            });

            input.removeAttribute('disabled');
            await waitForRemovedAttr(el, 'disabled').then(() => {
                expect(el.disabled).toBe(false);
                expect(el.hasAttribute('aria-disabled')).toBeFalsy();
                expect(input.hasAttribute('disabled')).toBeFalsy();
                expect(input.disabled).toBeFalsy();
            });
        });
        it('should set the aria-disabled state from setting the disabled property', async () => {
            document.body.innerHTML = `<jt-select><select /></jt-select>`;
            const el = document.querySelector('jt-select') as JtSelect;
            await waitForJtSelect();

            expect(el).toBeDefined();
            expect(el.disabled).toBe(false);
            expect(el.hasAttribute('aria-disabled')).toBeFalsy();
            const input = el.querySelector('select') as HTMLSelectElement;
            expect(input.hasAttribute('disabled')).toBeFalsy();
            expect(input.disabled).toBeFalsy();

            el.disabled = true;
            await waitForAttr(el, 'disabled').then(() => {
                expect(el.disabled).toBe(true);
                expect(el.hasAttribute('aria-disabled')).toBeTruthy();
                expect(input.hasAttribute('disabled')).toBeTruthy();
                expect(input.disabled).toBeTruthy();
            });

            el.disabled = false;
            await waitForRemovedAttr(el, 'disabled').then(() => {
                expect(el.disabled).toBe(false);
                expect(el.hasAttribute('aria-disabled')).toBeFalsy();
                expect(input.hasAttribute('disabled')).toBeFalsy();
                expect(input.disabled).toBeFalsy();
            });
        });
        it('should default to the editable state', async () => {
            document.body.innerHTML = `<jt-select><select /></jt-select>`;
            const el = document.querySelector('jt-select') as JtSelect;
            await waitForJtSelect();

            expect(el).toBeDefined();
            expect(el.readOnly).toBe(false);
            expect(el.hasAttribute('aria-readonly')).toBeFalsy();
        });
        it('should set the aria-readonly state from setting the readOnly property', async () => {
            document.body.innerHTML = `<jt-select><select /></jt-select>`;
            const el = document.querySelector('jt-select') as JtSelect;
            await waitForJtSelect();

            expect(el).toBeDefined();
            expect(el.readOnly).toBe(false);
            expect(el.hasAttribute('aria-readonly')).toBeFalsy();

            el.readOnly = true;
            await waitForAttr(el, 'readonly').then(() => {
                expect(el.readOnly).toBe(true);
                expect(el.hasAttribute('aria-readonly')).toBeTruthy();
            });

            el.readOnly = false;
            await waitForRemovedAttr(el, 'readonly').then(() => {
                expect(el.readOnly).toBe(false);
                expect(el.hasAttribute('aria-readonly')).toBeFalsy();
            });
        });
    });
    describe('Label Function', () => {
        it('should maintain <label> relationships using for', async () => {
            const user = userEvent.setup();
            document.body.innerHTML = `<label for="jt-test">Test</label><jt-select><select id="jt-test" /></jt-select>`;
            const el = document.querySelector('jt-select') as JtSelect;
            await waitForJtSelect();

            const select = el.querySelector('input') as HTMLInputElement;
            const input = within(el).getByRole('combobox') as HTMLDivElement;

            expect(within(document.body).getByLabelText('Test')).not.toEqual(select);
            expect(within(document.body).getByLabelText('Test')).toEqual(input);
        });
    });
});