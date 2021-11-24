import {
    isObject,
    getJsonType,
    capitalize,
    singular,
    keify,
} from '../utils'

describe('isObject', () => {

    test('returns true for values `null` values', () => {
        expect(isObject({ one: 'two', three: 'four' })).toBe(true);
    });

    test('returns false for `null` values', () => {
        expect(isObject(null)).toBe(false);
    });

    test('returns false for `undefined`', () => {
        expect(isObject(undefined)).toBe(false);
    });

})
