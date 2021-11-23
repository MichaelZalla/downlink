import {
	getJsonType,
	capitalize,
	keify,
	singular,
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

    const safeKeyChainKeys = keychain
        .map(k => capitalize(singular(keify(k))))

    const dataJsonType = getJsonType(data)

    if(getJsonType(data) !== `object`)
    {
        return {
            [fieldKey]: {
                fieldName: fieldKey,
                fieldTypes: [dataJsonType],
                isOptional: false,
                isArray: false,
            }
        }
    }

    const fieldEntry: Field&IComplexFieldExtras = {
        fieldName: fieldKey,
        fieldTypes: [`object`],
        isOptional: false,
        isArray: false,
        interfaceName: `I${safeKeyChainKeys.join('')}`,
        fields: {},
    }

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

            const primitiveOrObject = subFieldValue[index];
            const primitiveOrObjectType = getJsonType(primitiveOrObject)

            // Reconcile sub-fields if `subFieldValue[index]` is a complex
            // value (object)

            if(
                isObject(primitiveOrObject) &&
                hasInterfaceTypes(subfield)
            )
            {

                const obj: {[key:string]:unknown} = primitiveOrObject

                for(const key in obj)
                {

                    const value: unknown = obj[key]

                    // Check for any fields not present in the first array item

                    if(!(key in subfield.fields))
                    {
                        Object.assign(subfield.fields, getFieldMap(value, [...subKeychain, key]))

                        subfield.fields[key].isOptional = true
                    }

                    const subSubField = subfield.fields[key]

                    const subSubFieldType = getJsonType(obj[key])

                    // Add any type if we haven't seen it previously

                    if(subSubField.fieldTypes.includes(subSubFieldType) === false)
                    {
                        subSubField.fieldTypes.push(subSubFieldType)

                        if(obj[key] === null)
                        {
                            subSubField.isOptional = true
                        }
                    }

                }
            }
            else
            {

                // Add any type if we haven't seen it previously

                if(subfield.fieldTypes.includes(primitiveOrObjectType) === false)
                {
                    subfield.fieldTypes.push(primitiveOrObjectType)
                }

                // Null fields are considered optional

                if(primitiveOrObject === null)
                {
                    subfield.isOptional = true
                }

            }

        }

    }

}

export {
	JsonType,
	Field,
    hasInterfaceTypes,
	FieldMap,
	getFieldMap,
}
