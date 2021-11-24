import { Field } from '../field';

import {
	isObject,
	getJsonType,
	buildField,
	capitalize,
	singularize,
	pascal,
} from '../utils';

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
});

describe('getJsonType', () => {
	test('returns `null` for null values', () => {
		expect(getJsonType(null)).toBe('null');
	});

	test('returns `typoeof ${value}` for non-null values', () => {
		expect(getJsonType(true)).toBe('boolean');
		expect(getJsonType(3.14)).toBe('number');
		expect(getJsonType('Hello TypeScript')).toBe('string');
		expect(getJsonType(['one', 'two', 'three'])).toBe('object');
		expect(getJsonType({ one: 'red', two: 'blue' })).toBe('object');
	});

	test('throw for `undefined` and `function` types', () => {
		expect(() => getJsonType(undefined)).toThrowErrorMatchingInlineSnapshot(
			`"Called isObject() on undefined! Undefined is not a valid JSON data-type."`
		);

		expect(() => getJsonType(() => {})).toThrowErrorMatchingInlineSnapshot(
			`"Called isObject() on a function! Function is not a valid JSON data-type."`
		);
	});

	test('throw for `Date` instances', () => {
		expect(() => getJsonType(new Date())).toThrowErrorMatchingInlineSnapshot(
			`"Called isObject() on a Date! Date is not a valid JSON data-type."`
		);
	});
});

describe('buildField', () => {
	test('returns a Field object with default parameters', () => {
		expect(buildField()).toMatchInlineSnapshot(`
		Object {
		  "fieldName": "",
		  "fieldTypes": Array [
		    "null",
		  ],
		  "isArray": false,
		  "isOptional": false,
		}
	`);
	});

	test('assigns the field an empty fieldName if no `fieldName` option is given', () => {
		expect(buildField().fieldName).toBe('');
	});

	test('defaults to a field with a `null` fieldType if no `fieldTypes` are given', () => {
		expect(buildField().fieldTypes).toMatchObject([`null`]);
	});

	test('follows sensible defaults', () => {
		expect(buildField().isOptional).toBeFalsy();
		expect(buildField().isArray).toBeFalsy();
	});

	test('allows the caller to override parameters', () => {
		const options: Partial<Field> = {
			fieldName: `myField`,
			fieldTypes: [`number`],
		};

		expect(buildField(options)).toMatchObject(options)
	});
});

describe('capitalize', () => {
	test('converts the first letter of a string to uppercase', () => {
		expect(capitalize('a')).toBe('A');
		expect(capitalize('aa')).toBe('Aa');
		expect(capitalize('aaa')).toBe('Aaa');
		expect(capitalize('A')).toBe('A');
		expect(capitalize('AA')).toBe('AA');
	});

	test('is a no-op for strings that start with whitespace', () => {
		expect(capitalize(' trim me ')).toBe(' trim me ');
	});

	test('ignores empty strings', () => {
		expect(capitalize('')).toBe('');
	});
});

describe('singularize', () => {
	test('removes any trailing `s` character from the string', () => {
		expect(singularize('pants')).toBe('pant');
		expect(singularize('pantss')).toBe('pants');
		expect(singularize('spant')).toBe('spant');
	});

	test('ignores empty strings', () => {
		expect(singularize('')).toBe('');
	});
});

describe('pascal', () => {
	test('converts a string with spaces or hyphens into a pascal-case format', () => {
		expect(pascal('this-not-that')).toBe('ThisNotThat');
		expect(pascal('-this-not-that-')).toBe('ThisNotThat');
		expect(pascal('this---not---that')).toBe('ThisNotThat');
		expect(pascal('this not that')).toBe('ThisNotThat');
		expect(pascal('this - not - that')).toBe('ThisNotThat');
		expect(pascal('ThisNotThat')).toBe('ThisNotThat');
	});

	test('preserves decimal characters', () => {
		expect(pascal('token-pool-0')).toBe('TokenPool0');
		expect(pascal('token-pool-1')).toBe('TokenPool1');
	});

	test('ignores empty strings', () => {
		expect(pascal('')).toBe('');
	});
});
