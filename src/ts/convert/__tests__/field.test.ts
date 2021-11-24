import {
	hasInterfaceTypes,
	getInterfaceName,
} from '../field';
import { buildField } from '../utils';

describe('hasInterfaceTypes', () => {
	test('returns `true` only if the given field has at least one fieldType of `object`', () => {
		expect(
			hasInterfaceTypes(
				buildField({
					fieldTypes: [`null`],
				})
			)
		).toBeFalsy();

		expect(
			hasInterfaceTypes(
				buildField({
					fieldTypes: [`number`],
				})
			)
		).toBeFalsy();

		expect(
			hasInterfaceTypes(
				buildField({
					fieldTypes: [`string`],
				})
			)
		).toBeFalsy();

		expect(
			hasInterfaceTypes(
				buildField({
					fieldTypes: [`object`],
				})
			)
		).toBeTruthy();

		expect(
			hasInterfaceTypes(
				buildField({
					fieldTypes: [`object`, `null`],
				})
			)
		).toBeTruthy();

		expect(
			hasInterfaceTypes(
				buildField({
					fieldTypes: [`object`, `number`],
				})
			)
		).toBeTruthy();
	});
});

describe('getInterfaceName', () => {
	test('automatically performs naive singularization of keys', () => {
		expect(getInterfaceName(['settings'])).toBe(`ISetting`);
	});

	test('combines all keys in the given keychain to generate the `interfaceName`', () => {
		expect(getInterfaceName(['user', 'account', 'preference'])).toBe(
			`IUserAccountPreference`
		);
	});

	test('handles whitespace in field keys (names)', () => {
		expect(getInterfaceName(['token pairs', 'records', 'meta data'])).toBe(
			`ITokenPairRecordMetaData`
		);
	});

	test('handles hyphens in field keys (names)', () => {
		expect(getInterfaceName(['token-pairs', 'records', 'meta-data'])).toBe(
			`ITokenPairRecordMetaData`
		);
	});

	test('handles underscores in field keys (names)', () => {
		expect(getInterfaceName(['records', '__timestamps'])).toBe(
			`IRecordTimestamp`
		);
	});
});
