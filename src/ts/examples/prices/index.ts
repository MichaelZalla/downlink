import downlink from '../../convert';

const prices: string = JSON.stringify(require('./prices.json'));

console.log(downlink(prices));
