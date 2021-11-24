import {
	hasInterfaceTypes,
	getInterfaceName,
	getFieldMap,
	IComplexFieldExtras,
	Field,
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

describe('getFieldMap', () => {
	test('returns a FieldMap describing the given input (primitive or complex data)', () => {
		expect(getFieldMap(null)).toMatchObject({
			root: buildField({
				fieldName: `root`,
			}),
		});
	});

	test("infers the field map's root entry using the `keychain` argument passed in", () => {
		expect(getFieldMap(null, [`customRoot`])).toMatchObject({
			customRoot: buildField({
				fieldName: `customRoot`,
			}),
		});
	});

	test('accepts an arbitrary-length `keychain`; uses the last keychain item as the root key', () => {
		expect(getFieldMap(null, [`grandParent`, `parent`, `child`])).toMatchObject(
			{
				child: buildField({
					fieldName: 'child',
				}),
			}
		);
	});

	test('generates a `fieldName` based on the last key in the `keychain`', () => {
		expect(getFieldMap(null, [`grandParent`, `parent`, `child`])).toMatchObject(
			{
				child: buildField({
					fieldName: `child`,
				}),
			}
		);
	});

	test('throw if the caller passes an empty `keychain` parameter', () => {
		expect(() => getFieldMap(null, [])).toThrowErrorMatchingInlineSnapshot(
			`"Called \`getFieldMap\` with an empty \`keychain\` array! A keychain must include at least one key!"`
		);
	});

	test('returns a simple FieldMap for primitive-type inputs (boolean, number, string)', () => {
		expect(getFieldMap(true)).toMatchObject({
			root: buildField({
				fieldName: `root`,
				fieldTypes: [`boolean`],
			}),
		});

		expect(getFieldMap(3.14)).toMatchObject({
			root: buildField({
				fieldName: `root`,
				fieldTypes: [`number`],
			}),
		});

		expect(getFieldMap(`Hello, TypeScript`)).toMatchObject({
			root: buildField({
				fieldName: `root`,
				fieldTypes: [`string`],
			}),
		});
	});

	test('returns a simple FieldMap with a `fieldType` of [`null`] for null inputs', () => {
		expect(getFieldMap(null)).toMatchObject({
			root: buildField({
				fieldName: `root`,
				fieldTypes: [`null`],
			}),
		});
	});

	test('returns a complex FieldMap with a `fieldType` [`object`] for object inputs', () => {
		expect(getFieldMap({})).toMatchObject({
			root: buildField({
				fieldName: `root`,
				fieldTypes: [`object`],
			}),
		});
	});

	test('generates an `interfaceName` field property for complex object inputs', () => {
		const rootField = getFieldMap({}).root as Field & IComplexFieldExtras;
		expect(rootField.interfaceName).toBe(`IRoot`);
	});

	test('generates sub-fields as their own FieldMap under `fields`', () => {
		const data = { one: 'red', two: 'blue' };
		const fm = getFieldMap(data);

		expect(fm).toMatchObject({
			root: buildField({
				fieldTypes: [`object`],
				interfaceName: `IRoot`,
				fields: {
					one: buildField({
						fieldName: `one`,
						fieldTypes: [`string`],
					}),
					two: buildField({
						fieldName: `two`,
						fieldTypes: [`string`],
					}),
				},
			}),
		});
	});

	test('supports data with deeply nested sub-objects', () => {
		type Node = { data?: number; next?: Node };

		const buildNode = ({ data, next }: Partial<Node> = {}) =>
			next ? { data, next } : { data };

		const root: Node = buildNode({
			data: Math.random(),
			next: buildNode({
				data: Math.random(),
				next: buildNode({
					data: Math.random(),
					next: buildNode({
						data: Math.random(),
					}),
				}),
			}),
		});

		const fm = getFieldMap(root);

		expect(fm).toMatchInlineSnapshot(`
		Object {
		  "root": Object {
		    "fieldName": "root",
		    "fieldTypes": Array [
		      "object",
		    ],
		    "fields": Object {
		      "data": Object {
		        "fieldName": "data",
		        "fieldTypes": Array [
		          "number",
		        ],
		        "isArray": false,
		        "isOptional": false,
		      },
		      "next": Object {
		        "fieldName": "next",
		        "fieldTypes": Array [
		          "object",
		        ],
		        "fields": Object {
		          "data": Object {
		            "fieldName": "data",
		            "fieldTypes": Array [
		              "number",
		            ],
		            "isArray": false,
		            "isOptional": false,
		          },
		          "next": Object {
		            "fieldName": "next",
		            "fieldTypes": Array [
		              "object",
		            ],
		            "fields": Object {
		              "data": Object {
		                "fieldName": "data",
		                "fieldTypes": Array [
		                  "number",
		                ],
		                "isArray": false,
		                "isOptional": false,
		              },
		              "next": Object {
		                "fieldName": "next",
		                "fieldTypes": Array [
		                  "object",
		                ],
		                "fields": Object {
		                  "data": Object {
		                    "fieldName": "data",
		                    "fieldTypes": Array [
		                      "number",
		                    ],
		                    "isArray": false,
		                    "isOptional": false,
		                  },
		                },
		                "interfaceName": "IRootNextNextNext",
		                "isArray": false,
		                "isOptional": false,
		              },
		            },
		            "interfaceName": "IRootNextNext",
		            "isArray": false,
		            "isOptional": false,
		          },
		        },
		        "interfaceName": "IRootNext",
		        "isArray": false,
		        "isOptional": false,
		      },
		    },
		    "interfaceName": "IRoot",
		    "isArray": false,
		    "isOptional": false,
		  },
		}
	`);
	});
});
