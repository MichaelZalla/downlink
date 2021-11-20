import { getFieldMap } from './field'
import { renderFields } from './render'

function jsonToTs(
	json: string): string
{
	const fieldMap = getFieldMap(JSON.parse(json))

    if('root' in fieldMap)
    {
        return renderFields([fieldMap.root])
    }

	return ``
}

export {jsonToTs}
