import {
	getJsonType,
    buildField,
	pascal,
	singularize,
	isObject,
} from './utils'

type JsonType = 'string'|'number'|'boolean'|'undefined'|'object'|`null`

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

function hasInterfaceTypes(
    field: Field): field is Field&IComplexFieldExtras
{
    return field.fieldTypes.some(t => t === `object`)
}

type FieldMap = { [name: string]: Field }

function getFieldMap(
	data: { [key: string]: unknown },
    keychain: string[] = [`root`]): FieldMap
{

    const fieldKey = keychain[keychain.length - 1]

    if(getJsonType(data) !== `object`)
    {
        return {
            [fieldKey]: buildField({
                fieldName: fieldKey,
                fieldTypes: [
                    getJsonType(data)
                ],
            })
        }
    }

    const fieldEntry: Field&IComplexFieldExtras = buildField({
        fieldName: fieldKey,
        fieldTypes: [`object`],
        interfaceName: `I${keychain.map(k => pascal(singularize(k))).join('')}`,
        fields: {},
    }) as Field&IComplexFieldExtras

    const fieldMap: FieldMap = {
        [fieldKey]: fieldEntry,
    }

    const fields = fieldEntry.fields;

    for(const subFieldKey in data)
    {
        populateSubFieldMap(
            subFieldKey,
            data[subFieldKey],
            fields,
            [...keychain, subFieldKey]
        )
    }

    return fieldMap

}

function populateSubFieldMap(
    subFieldKey: string,
    subFieldValue: unknown,
    parentFieldMap: FieldMap,
    subKeychain: string[]): void
{

    const subFieldData = (subFieldValue instanceof Array) ?
        (subFieldValue.length) ?
            subFieldValue[0] :
            {}
            :
            subFieldValue;

    if(isObject(subFieldData))
    {
        Object.assign(parentFieldMap, getFieldMap(subFieldData, subKeychain))
    }
    else
    {
        // Primitive (base case)

        parentFieldMap[subFieldKey] = {
            fieldName: subFieldKey,
            fieldTypes: [getJsonType(subFieldData)],
            isOptional: false,
            isArray: false,
        }
    }

    const subfield = parentFieldMap[subFieldKey];

    // Reconcile union types and optional types

    if(subFieldValue instanceof Array) {

        subfield.isArray = true

        for(let index = 1; index < subFieldValue.length; index++) {

            // Reconcile sub-fields if `subFieldValue[index]` is a complex
            // value (object)

            if(
                isObject(subFieldValue[index]) &&
                hasInterfaceTypes(subfield)
            )
            {
                updateComplexField(subfield, subFieldValue[index], subKeychain)
            }
            else
            {
                updateSimpleField(subfield, subFieldValue[index])
            }

        }

    }

}

function updateSimpleField(
    field: Field,
    alternateFieldValue: unknown)
{

    // Add any type if we haven't seen it previously

    const jsonType = getJsonType(alternateFieldValue)

    if(field.fieldTypes.includes(jsonType) === false)
    {
        field.fieldTypes.push(jsonType)
    }

    // Null fields are considered optional

    if(alternateFieldValue === null)
    {
        field.isOptional = true
    }

}

function updateComplexField(
    field: Field&IComplexFieldExtras,
    alternateComplexFieldValue: {[key:string]:unknown},
    keychain: string[])
{

    for(const key in alternateComplexFieldValue)
    {

        const value: unknown = alternateComplexFieldValue[key]

        // Check for any fields not present in the first array item

        if(!(key in field.fields))
        {
            // Object.assign(field.fields, getFieldMap(value, [...keychain, key]))
            populateSubFieldMap(key, value, field.fields, [...keychain, key])

            field.fields[key].isOptional = true
        }

        const subField = field.fields[key]

        const subFieldType = getJsonType(alternateComplexFieldValue[key])

        // Add any type if we haven't seen it previously

        if(subField.fieldTypes.includes(subFieldType) === false)
        {
            subField.fieldTypes.push(subFieldType)

            if(value === null)
            {
                subField.isOptional = true
            }
        }

    }

}

export {
	JsonType,
	Field,
    IComplexFieldExtras,
	FieldMap,
    hasInterfaceTypes,
	getFieldMap,
}
