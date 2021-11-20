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
	interfaceName?: string;
	fields?: FieldMap;
}

type FieldMap = { [name: string]: Field }

function getFieldMap(
	data: { [key: string]: any },
    keychain: string[] = [`root`]): FieldMap
{

    const fieldKey = keychain[keychain.length - 1]

    const safeKeyChainKeys = keychain
        .map(keify)
        .map(singular)
        .map(capitalize)

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

    const interfaceName = `I${safeKeyChainKeys.join('')}`

    const fieldMap: FieldMap = {
        [fieldKey]: {
            fieldName: fieldKey,
            interfaceName: interfaceName,
            fieldTypes: [`object`],
            isOptional: false,
            isArray: false,
            fields: {},
        }
    }

    const fields = fieldMap[fieldKey].fields;

    for(const subFieldKey in data)
    {

        const isArray = data[subFieldKey] instanceof Array;

        const subFieldData = isArray ?
            (data[subFieldKey].length) ?
                data[subFieldKey][0] :
                {}
                :
                data[subFieldKey];

        if(isObject(subFieldData))
        {
            const subKeychain: string[] = [...keychain, subFieldKey]

            Object.assign(fields, getFieldMap(subFieldData, subKeychain))
        }
        else
        {
            // Primitive (base case)

            fields![subFieldKey] = {
                fieldName: subFieldKey,
                fieldTypes: [getJsonType(subFieldData)],
                isOptional: false,
                isArray: false,
            }
        }

        const field = fields![subFieldKey];

        field.isArray = isArray

        // Reconcile union types and optional types

        if(isArray) {

            for(let index = 1; index < data[subFieldKey].length; index++) {

                let primitiveOrObject = data[subFieldKey][index];
                let primitiveOrObjectType = getJsonType(primitiveOrObject)

                // Reconcile sub-fields if `data[subFieldKey][index]` is a complex value (object)

                if(isObject(primitiveOrObject))
                {

                    let obj = primitiveOrObject

                    for(const key in obj)
                    {

                        // Check for any field(s) not present in the first array item

                        if(!(key in field.fields!))
                        {
                            const subKeychain: string[] = [...keychain, subFieldKey, key]

                            Object.assign(field.fields!, getFieldMap(obj[key], subKeychain))
                            field.fields![key].isOptional = true
                        }

                        let subSubField = field.fields![key]

                        let subSubFieldType = getJsonType(obj[key])

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

    return fieldMap

}

export {
	JsonType,
	Field,
	FieldMap,
	getFieldMap,
}
