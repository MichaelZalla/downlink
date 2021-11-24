import { jsonToTs } from '../../convert'

const pools: string = JSON.stringify(require('./pools.json'));

console.log(jsonToTs(pools))
