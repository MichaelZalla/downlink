import { JsonType } from './field'

const isObject = (value: any) =>
    (typeof value === 'object' && value !== null)

const getJsonType = (value: any) => value === null ?
	`null` as JsonType :
	(typeof value) as JsonType

const capitalize = (str: string) =>
    str[0].toUpperCase() + str.slice(1)

const singular = (str: string) => {

    if(!str)
    {
        return ''
    }

    return (str[str.length-1] === 's') ?
        str.slice(0, str.length-1) :
        str

}

const keify = (str: string) => {
    let c = str.split(/[^a-zA-Z]/).map(capitalize).join('')
    return str[0] + c.slice(1)
}

export {
    isObject,
    getJsonType,
    capitalize,
    singular,
    keify,
}
