import { Field, FieldMap } from './field'

function renderFieldType(field: Field)
{
    let fieldTypes: string[] = field.fieldTypes
        .filter((t) => t !== `null`)
        .map((t) => t === `object` ? field.interfaceName! : t)

    let fieldTypesFlat = fieldTypes.length > 1 ?
        fieldTypes.join(`|`) :
        fieldTypes[0]

    if(fieldTypes.length > 1 && field.isArray)
    {
        fieldTypesFlat = `(${fieldTypesFlat})`
    }

    return `${fieldTypesFlat}${ field.isArray ? '[]' : ''}`;
}

function renderFields(
	renderQueue: Field[] = []): string
{

    let renderedInterfaces = []

    while(renderQueue.length)
    {

        const fieldMap = renderQueue.shift() as Field

        let serialiedFieldMap = `interface ${fieldMap?.interfaceName} {`

        for(const key in fieldMap.fields)
        {
            const field: Field|FieldMap = fieldMap.fields[key]

            const safeFieldName: string = field.fieldName.match(/([^a-zA-Z])/) ?
                `"${field.fieldName}"` :
                field.fieldName

            serialiedFieldMap += `\n    ${safeFieldName}${field.isOptional ?
                '?' : ''}: ${renderFieldType(field)};`

            // The render queue only produces `interface` declarations, so we only add complex fields to our queue / frontier

            field.interfaceName && renderQueue.push(field)
        }

        serialiedFieldMap += `\n}`

        renderedInterfaces.unshift(serialiedFieldMap)
    }

	return `${renderedInterfaces.join(`\n\n`)}\n\nexport {IRoot}`

}

export {renderFields}