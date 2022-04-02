import downlink from '../../convert';

const parcels: string = JSON.stringify(require('./parcels.json'));

console.log(downlink(parcels));
