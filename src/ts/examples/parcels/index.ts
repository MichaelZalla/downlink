import { jsonToTs } from '../../convert'

const parcels: string = JSON.stringify(require('./parcels.json'));

console.clear()
console.log(jsonToTs(parcels))
