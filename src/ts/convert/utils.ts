import { JsonType } from './field'

function isObject(
    value: unknown): value is {[key:string]:unknown}
{
    return (Object(value) === value)
}

function getJsonType(
    value: unknown)
{

    if(typeof value === 'undefined')
    {
        throw new Error(`Called isObject() on undefined! Undefined is not a valid JSON data-type.`)
    }

    if(typeof value === 'function')
    {
        throw new Error(`Called isObject() on a function! Function is not a valid JSON data-type.`)
    }

    if(value instanceof Date)
    {
        throw new Error(`Called isObject() on a Date! Date is not a valid JSON data-type.`)
    }

    return value === null ?
        `null` as JsonType :
        (typeof value) as JsonType

}

const capitalize = (str: string) => {

    if(!str)
    {
        return ''
    }

    return str[0].toUpperCase() + str.slice(1)

}

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

    if(!str)
    {
        return ''
    }


    return str[0] + str.split(/[\s-]/).map(capitalize).join('').slice(1)

}

export {
    isObject,
    getJsonType,
    capitalize,
    singular,
    keify,
}
