import { jsonToTs } from '../../convert';

const parcels: string = JSON.stringify(require('./parcels.json'));

console.log(jsonToTs(parcels));
