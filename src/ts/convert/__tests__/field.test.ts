import { JsonType, Field, hasInterfaceTypes } from '../field';
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
