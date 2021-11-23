import { Field, hasInterfaceTypes, FieldMap } from './field'

function renderFieldType(field: Field)
{
    const fieldTypes: string[] = field.fieldTypes
        .filter((t) => t !== `null`)
        .map((t) => hasInterfaceTypes(field) ? field.interfaceName : t)

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

    const renderedInterfaces = []

    while(renderQueue.length)
    {

        const fieldMap = renderQueue.shift() as Field

        if(!hasInterfaceTypes(fieldMap))
        {
            continue
        }

        let serialiedFieldMap = `interface ${hasInterfaceTypes(fieldMap) && fieldMap.interfaceName} {`

        for(const key in fieldMap.fields)
        {
            const field: Field|FieldMap = fieldMap.fields[key]

            const safeFieldName: string = field.fieldName.match(/[\s-]/) ?
                `"${field.fieldName}"` :
                field.fieldName

            serialiedFieldMap += `\n    ${safeFieldName}${field.isOptional ?
                '?' : ''}: ${renderFieldType(field)};`

            // The render queue only produces `interface` declarations, so we
            // only add complex fields to our queue / frontier

            if(hasInterfaceTypes(field))
            {
                renderQueue.push(field)
            }

        }

        serialiedFieldMap += `\n}`

        renderedInterfaces.unshift(serialiedFieldMap)
    }

	return `${renderedInterfaces.join(`\n\n`)}\n\nexport {IRoot}`

}

export {renderFields}