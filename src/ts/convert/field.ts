import {
	getJsonType,
	buildField,
	pascal,
	singularize,
	isObject,
} from './utils';

type JsonType =
	| 'string'
	| 'number'
	| 'boolean'
	| 'object'
	| `null`;

interface Field {
	fieldName: string;
	fieldTypes: JsonType[];
	isOptional: boolean;
	isArray: boolean;
}

interface IComplexFieldExtras {
	interfaceName: string;
	fields: FieldMap;
}

function hasInterfaceTypes(field: Field): field is Field & IComplexFieldExtras {
	return field.fieldTypes.some((t) => t === `object`);
}

type FieldMap = { [name: string]: Field };

function getInterfaceName(
	keychain: string[]): string
{
	return `I${keychain.map((k) => pascal(singularize(k))).join('')}`
}

function getFieldMap(
	data: unknown,
	keychain: string[] = [`root`]
): FieldMap {

	if(keychain.length === 0)
	{
		throw new Error('Called `getFieldMap` with an empty `keychain` array! A keychain must include at least one key!')
	}

	const fieldKey = keychain[keychain.length - 1];

	if (getJsonType(data) !== `object`) {
		return {
			[fieldKey]: buildField({
				fieldName: fieldKey,
				fieldTypes: [getJsonType(data)],
			}),
		};
	}

	const fieldEntry: Field & IComplexFieldExtras = buildField({
		fieldName: fieldKey,
		fieldTypes: [`object`],
		interfaceName: getInterfaceName(keychain),
		fields: {},
	}) as Field & IComplexFieldExtras;

	const fieldMap: FieldMap = {
		[fieldKey]: fieldEntry,
	};

	const fields = fieldEntry.fields;

	const dataAsMap = data as { [key: string]: unknown }

	for (const subFieldKey in dataAsMap) {
		populateSubFieldMap(subFieldKey, dataAsMap[subFieldKey], fields, [
			...keychain,
			subFieldKey,
		]);
	}

	return fieldMap;
}

function populateSubFieldMap(
	subFieldKey: string,
	subFieldValue: unknown,
	parentFieldMap: FieldMap,
	subKeychain: string[]
): void {
	const subFieldData =
		subFieldValue instanceof Array
			? subFieldValue.length
				? subFieldValue[0]
				: {}
			: subFieldValue;

	if (isObject(subFieldData)) {
		Object.assign(parentFieldMap, getFieldMap(subFieldData, subKeychain));
	} else {
		// Primitive (base case)

		parentFieldMap[subFieldKey] = {
			fieldName: subFieldKey,
			fieldTypes: [getJsonType(subFieldData)],
			isOptional: false,
			isArray: false,
		};
	}

	const subfield = parentFieldMap[subFieldKey];

	// Reconcile union types and optional types

	if (subFieldValue instanceof Array) {
		subfield.isArray = true;

		for (let index = 1; index < subFieldValue.length; index++) {
			// Reconcile sub-fields if `subFieldValue[index]` is a complex
			// value (object)

			if (isObject(subFieldValue[index]) && hasInterfaceTypes(subfield)) {
				updateComplexField(subfield, subFieldValue[index], subKeychain);
			} else {
				updateSimpleField(subfield, subFieldValue[index]);
			}
		}
	}
}

function updateSimpleField(field: Field, alternateFieldValue: unknown) {
	// Add any type if we haven't seen it previously

	const jsonType = getJsonType(alternateFieldValue);

	if (field.fieldTypes.includes(jsonType) === false) {
		field.fieldTypes.push(jsonType);
	}

	// Null fields are considered optional

	if (alternateFieldValue === null) {
		field.isOptional = true;
	}
}

function updateComplexField(
	field: Field & IComplexFieldExtras,
	alternateComplexFieldValue: { [key: string]: unknown },
	keychain: string[]
) {

	// Check for original subfields not present in this (array) record

	for(const key in field.fields)
	{
		if(
			!(key in alternateComplexFieldValue) ||
			alternateComplexFieldValue[key] === null
		)
		{
			field.fields[key].isOptional = true
		}
	}

	// Check for current subfields not present in the original (array) record

	for(const key in alternateComplexFieldValue)
	{
		const value: unknown = alternateComplexFieldValue[key];

		if(
			!(key in field.fields) ||
			field.fields[key] === null
		)
		{
			populateSubFieldMap(key, value, field.fields, [...keychain, key]);

			field.fields[key].isOptional = true
		}

		// Add the field type if we haven't seen it before

		const subField = field.fields[key];
		const subFieldType = getJsonType(alternateComplexFieldValue[key]);

		if (subField.fieldTypes.includes(subFieldType) === false) {
			subField.fieldTypes.push(subFieldType);
		}

	}

}

export {
	JsonType,
	Field,
	IComplexFieldExtras,
	FieldMap,
	hasInterfaceTypes,
	getInterfaceName,
	getFieldMap,
};
