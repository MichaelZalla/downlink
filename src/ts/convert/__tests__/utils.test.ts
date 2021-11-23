import {
    isObject,
    getJsonType,
    capitalize,
    singular,
    keify,
} from '../utils'

test('isObject returns false for `null` values', () => {

	expect(isObject(null)).toBe(false);

});
