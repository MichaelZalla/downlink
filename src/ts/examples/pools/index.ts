import { jsonToTs } from '../../convert'

const pools: string = JSON.stringify(require('./pools.json'));

console.clear()
console.log(jsonToTs(pools))
