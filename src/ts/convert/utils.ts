import { JsonType } from './field'

function isObject(
    value: unknown): value is {[key:string]:unknown}
{
    return (Object(value) === value)
}

const getJsonType = (value: unknown) => value === null ?
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

const keify = (str: string) =>
    str[0] + str.split(/[\s-]/).map(capitalize).join('').slice(1)

export {
    isObject,
    getJsonType,
    capitalize,
    singular,
    keify,
}
