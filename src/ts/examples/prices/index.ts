import { jsonToTs } from '../../convert'

const prices: string = JSON.stringify(require('./prices.json'));

console.clear()
console.log(jsonToTs(prices))
