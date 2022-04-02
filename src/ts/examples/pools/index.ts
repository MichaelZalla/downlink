import downlink from '../../convert';

const pools: string = JSON.stringify(require('./pools.json'));

console.log(downlink(pools));
