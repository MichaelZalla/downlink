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
            data,
            fields,
            subFieldKey,
            keychain
        )
    }

    return fieldMap

}

function populateSubFieldMap(
    parentData: {[key: string]: unknown},
    parentFieldMap: FieldMap,
    subFieldKey: string,
    keychain: string[]): void
{

    const isArray = parentData[subFieldKey] instanceof Array;

    const subFieldData = isArray ?
        (parentData[subFieldKey].length) ?
            parentData[subFieldKey][0] :
            {}
            :
            parentData[subFieldKey];

    if(isObject(subFieldData))
    {
        const subKeychain: string[] = [...keychain, subFieldKey]

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

    const field = parentFieldMap[subFieldKey];

    field.isArray = isArray

    // Reconcile union types and optional types

    if(isArray) {

        for(let index = 1; index < parentData[subFieldKey].length; index++) {

            const primitiveOrObject = parentData[subFieldKey][index];
            const primitiveOrObjectType = getJsonType(primitiveOrObject)

            // Reconcile sub-fields if `data[subFieldKey][index]` is a complex
            // value (object)

            if(isObject(primitiveOrObject))
            {

                const obj = primitiveOrObject

                for(const key in obj)
                {

                    // Check for any fields not present in the first array item

                    if(!(key in field.fields!))
                    {
                        const subKeychain: string[] = [...keychain, subFieldKey, key]

                        Object.assign(field.fields!, getFieldMap(obj[key], subKeychain))
                        field.fields![key].isOptional = true
                    }

                    const subSubField = field.fields![key]

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

                if(field.fieldTypes.includes(primitiveOrObjectType) === false)
                {
                    field.fieldTypes.push(primitiveOrObjectType)
                }

                // Null fields are considered optional

                if(primitiveOrObject === null)
                {
                    field.isOptional = true
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
