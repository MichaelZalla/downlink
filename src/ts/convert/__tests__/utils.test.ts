import {JsonType} from '../field'

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

describe('getJsonType', () => {

    test('returns `null` for null values', () => {
        expect(getJsonType(null)).toBe('null')
    })

    test('returns `typoeof ${value}` for non-null values', () => {

        expect(getJsonType(true)).toBe('boolean')

        expect(getJsonType(3.14)).toBe('number')

        expect(getJsonType('Hello TypeScript')).toBe('string')

        expect(getJsonType(['one', 'two', 'three'])).toBe('object')

        expect(getJsonType({ one: 'red', two: 'blue'})).toBe('object')

    })

    test('throw for `undefined` and `function` types', () => {

        expect(() => getJsonType(undefined)).
            toThrowErrorMatchingInlineSnapshot(`"Called isObject() on undefined! Undefined is not a valid JSON data-type."`)

        expect(() => getJsonType(() => {})).
            toThrowErrorMatchingInlineSnapshot(`"Called isObject() on a function! Function is not a valid JSON data-type."`)

    })

    test('throw for `Date` instances', () => {

        expect(() => getJsonType(new Date())).
            toThrowErrorMatchingInlineSnapshot(`"Called isObject() on a Date! Date is not a valid JSON data-type."`)

    })

})
