// import { beforeEach, describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom';
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { JSDOM } from 'jsdom';
import JtAutocomplete from '../src/components/autocomplete';
import { waitForAttr, waitForRemovedAttr } from './util/test-util';

beforeAll(() => {
    customElements.define('jt-autocomplete', JtAutocomplete);
});

describe('Autocomplete Component', () => {
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
            document.body.innerHTML = `<jt-autocomplete></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            expect(el).toBeDefined();
            expect(el).toBeInstanceOf(JtAutocomplete);
            expect(within(el).queryByRole('combobox')).toBeNull();
        });
        it('should accept an <input> child', () => {
            document.body.innerHTML = `<jt-autocomplete><input type="text" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            expect(el).toBeDefined();
            expect(el).toBeInstanceOf(JtAutocomplete);
            expect(within(el).queryByRole('combobox')).not.toBeNull();
        });
        it('should disable autocomplete on the form if it is unset', () => {
            document.body.innerHTML = `<jt-autocomplete><input type="text" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            expect(el).toBeDefined();
            expect(el).toBeInstanceOf(JtAutocomplete);
            expect(within(el).queryByRole('combobox')).toHaveAttribute('autocomplete', 'off');
        });
        it('should honor an existing autocomplete attribute', () => {
            document.body.innerHTML = `<jt-autocomplete><input type="text" autocomplete="chrome-off" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            expect(el).toBeDefined();
            expect(el).toBeInstanceOf(JtAutocomplete);
            expect(within(el).queryByRole('combobox')).toHaveAttribute('autocomplete', 'chrome-off');
        });
        it('should default to the enabled state', () => {
            document.body.innerHTML = `<jt-autocomplete><input type="text" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            const input = within(el).getByRole('combobox') as HTMLInputElement;

            expect(el).toBeDefined();
            expect(el.disabled).toEqual(false);
            expect(el).not.toBeDisabled();
            expect(el).not.toHaveAttribute('aria-disabled');
            expect(input).not.toBeDisabled();
        });
        it('should set the aria-disabled state from the child <input>', () => {
            document.body.innerHTML = `<jt-autocomplete><input type="text" disabled /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            const input = within(el).getByRole('combobox') as HTMLInputElement;

            expect(el).toBeDefined();
            expect(el.disabled).toEqual(true);
            expect(el).toHaveAttribute('aria-disabled');
            expect(el).toBeDisabled();
            expect(input).toBeDisabled();
        });
        it('should set the aria-disabled state from changing input.disabled', async () => {
            document.body.innerHTML = `<jt-autocomplete><input type="text" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            expect(el).toBeDefined();
            expect(el.disabled).toBe(false);
            expect(el.hasAttribute('aria-disabled')).toBeFalsy();
            const input = el.querySelector('input') as HTMLInputElement;
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
        });
        it('should set the aria-disabled state from changing input[disabled]', async () => {
            document.body.innerHTML = `<jt-autocomplete><input type="text" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            expect(el).toBeDefined();
            expect(el.disabled).toBe(false);
            expect(el.hasAttribute('aria-disabled')).toBeFalsy();
            const input = el.querySelector('input') as HTMLInputElement;
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
            document.body.innerHTML = `<jt-autocomplete><input type="text" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            expect(el).toBeDefined();
            expect(el.disabled).toBe(false);
            expect(el.hasAttribute('aria-disabled')).toBeFalsy();
            const input = el.querySelector('input') as HTMLInputElement;
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
        it('should default to the editable state', () => {
            document.body.innerHTML = `<jt-autocomplete><input type="text" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            expect(el).toBeDefined();
            expect(el.readOnly).toBe(false);
            expect(el.hasAttribute('aria-readonly')).toBeFalsy();
            const input = el.querySelector('input') as HTMLInputElement;
            expect(input.readOnly).toBeFalsy();
        });
        it('should set the aria-readonly state from the child <input>', () => {
            document.body.innerHTML = `<jt-autocomplete><input type="text" readonly /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            expect(el).toBeDefined();
            expect(el.readOnly).toBe(true);
            expect(el.hasAttribute('aria-readonly')).toBeTruthy();
        });
        it('should set the aria-readonly state from changing input.readonly', async () => {
            document.body.innerHTML = `<jt-autocomplete><input type="text" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            expect(el).toBeDefined();
            expect(el.readOnly).toBe(false);
            expect(el.hasAttribute('aria-readonly')).toBeFalsy();
            const input = el.querySelector('input') as HTMLInputElement;
            expect(input.hasAttribute('readonly')).toBeFalsy();
            expect(input.readOnly).toBeFalsy();

            input.readOnly = true;
            await waitForAttr(el, 'readonly').then(() => {
                expect(el.readOnly).toBe(true);
                expect(el.hasAttribute('aria-readonly')).toBeTruthy();
                expect(input.hasAttribute('readonly')).toBeTruthy();
                expect(input.readOnly).toBeTruthy();
            });

            input.readOnly = false;
            await waitForRemovedAttr(el, 'readonly').then(() => {
                expect(el.readOnly).toBe(false);
                expect(el.hasAttribute('aria-readonly')).toBeFalsy();
                expect(input.hasAttribute('readonly')).toBeFalsy();
                expect(input.readOnly).toBeFalsy();
            });
        });
        it('should set the aria-readonly state from changing input[readonly]', async () => {
            document.body.innerHTML = `<jt-autocomplete><input type="text" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            expect(el).toBeDefined();
            expect(el.readOnly).toBe(false);
            expect(el.hasAttribute('aria-readonly')).toBeFalsy();
            const input = el.querySelector('input') as HTMLInputElement;
            expect(input.hasAttribute('readonly')).toBeFalsy();
            expect(input.readOnly).toBeFalsy();

            input.setAttribute('readonly', '');
            await waitForAttr(el, 'readonly').then(() => {
                expect(el.readOnly).toBe(true);
                expect(el.hasAttribute('aria-readonly')).toBeTruthy();
                expect(input.hasAttribute('readonly')).toBeTruthy();
                expect(input.readOnly).toBeTruthy();
            });

            input.removeAttribute('readonly');
            await waitForRemovedAttr(el, 'readonly').then(() => {
                expect(el.readOnly).toBe(false);
                expect(el.hasAttribute('aria-readonly')).toBeFalsy();
                expect(input.hasAttribute('readonly')).toBeFalsy();
                expect(input.readOnly).toBeFalsy();
            });
        });
        it('should set the aria-readonly state from setting the readOnly property', async () => {
            document.body.innerHTML = `<jt-autocomplete><input type="text" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            expect(el).toBeDefined();
            expect(el.readOnly).toBe(false);
            expect(el.hasAttribute('aria-readonly')).toBeFalsy();
            const input = el.querySelector('input') as HTMLInputElement;
            expect(input.hasAttribute('readonly')).toBeFalsy();
            expect(input.readOnly).toBeFalsy();

            el.readOnly = true;
            await waitForAttr(el, 'readonly').then(() => {
                expect(el.readOnly).toBe(true);
                expect(el.hasAttribute('aria-readonly')).toBeTruthy();
                expect(input.hasAttribute('readonly')).toBeTruthy();
                expect(input.readOnly).toBeTruthy();
            });

            el.readOnly = false;
            await waitForRemovedAttr(el, 'readonly').then(() => {
                expect(el.readOnly).toBe(false);
                expect(el.hasAttribute('aria-readonly')).toBeFalsy();
                expect(input.hasAttribute('readonly')).toBeFalsy();
                expect(input.readOnly).toBeFalsy();
            });
        });
        it('should set the .jt-placeholder-shown on initialization for an empty <input>', () => {
            document.body.innerHTML = `<jt-autocomplete><input type="text" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            const input = el.querySelector('input') as HTMLInputElement;

            expect(el.classList.contains('jt-placeholder-shown')).toBeTruthy();
        });
        it('should set the .jt-placeholder-shown on initialization when the <input> changes', async () => {
            const user = userEvent.setup();
            document.body.innerHTML = `<jt-autocomplete><input type="text" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            const input = el.querySelector('input') as HTMLInputElement;

            expect(el.classList.contains('jt-placeholder-shown')).toBeTruthy();
            expect(input.value).toEqual('');
            await user.tab();
            await user.keyboard('test');
            expect(el.classList.contains('jt-placeholder-shown')).toBeFalsy();
            expect(input.value).toEqual('test');
        });
        it('should clear the .jt-placeholder-shown on initialization for a non-empty <input>', () => {
            document.body.innerHTML = `<jt-autocomplete><input type="text" value="test" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            const input = el.querySelector('input') as HTMLInputElement;

            expect(el.classList.contains('jt-placeholder-shown')).toBeFalsy();
        });
        it('should clear the .jt-placeholder-shown on initialization when the <input> becomes empty', async () => {
            const user = userEvent.setup();
            document.body.innerHTML = `<jt-autocomplete><input type="text" value="test" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            const input = el.querySelector('input') as HTMLInputElement;

            expect(el.classList.contains('jt-placeholder-shown')).toBeFalsy();
            expect(input.value).toEqual('test');
            await user.tab();
            await user.clear(input);
            expect(el.classList.contains('jt-placeholder-shown')).toBeTruthy();
            expect(input.value).toEqual('');
        });
    });
    describe('Label Function', () => {
        it('should maintain <label> relationships using for', async() => {
            const user = userEvent.setup();
            document.body.innerHTML = `<label for="jt-test">Test</label><jt-autocomplete><input type="text" id="jt-test" /></jt-autocomplete>`;
            const el = document.querySelector('jt-autocomplete') as JtAutocomplete;
            const input = el.querySelector('input') as HTMLInputElement;

            expect(within(el).getByLabelText('Test')).toEqual(input);
        });
    });
});