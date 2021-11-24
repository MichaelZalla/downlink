import { Field, IComplexFieldExtras, JsonType } from './field';

function isObject(value: unknown): value is { [key: string]: unknown } {
	return Object(value) === value;
}

function getJsonType(value: unknown) {
	if (typeof value === 'undefined') {
		throw new Error(
			`Called isObject() on undefined! Undefined is not a valid JSON data-type.`
		);
	}

	if (typeof value === 'function') {
		throw new Error(
			`Called isObject() on a function! Function is not a valid JSON data-type.`
		);
	}

	if (value instanceof Date) {
		throw new Error(
			`Called isObject() on a Date! Date is not a valid JSON data-type.`
		);
	}

	return value === null ? (`null` as JsonType) : (typeof value as JsonType);
}

const buildField = (
	options: Partial<Field & IComplexFieldExtras> = {}
): Field => ({
	fieldName: 'root',
	fieldTypes: [`null`],
	isOptional: false,
	isArray: false,
	...options,
});

const capitalize = (str: string) => {
	if (!str) {
		return '';
	}

	return str[0].toUpperCase() + str.slice(1);
};

const singularize = (str: string) => {
	if (!str) {
		return '';
	}

	return str[str.length - 1] === 's' ? str.slice(0, str.length - 1) : str;
};

const pascal = (str: string) => {
	if (!str) {
		return '';
	}
	return str.split(/[\s_~@#$%^&\-=+|:;,]/).map(capitalize).join('');
};

export { isObject, getJsonType, buildField, capitalize, singularize, pascal };
