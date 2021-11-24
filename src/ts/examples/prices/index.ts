import { jsonToTs } from '../../convert';

const prices: string = JSON.stringify(require('./prices.json'));

console.log(jsonToTs(prices));
