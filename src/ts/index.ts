import { jsonToTs } from './convert'

// const pools: string = JSON.stringify(require('../../data/pools.json'));
// const parcels: string = JSON.stringify(require('../../data/parcels.json'));
// const prices: string = JSON.stringify(require('../../data/prices.json'));

console.clear()

// console.log(jsonToTs(`true`))
// console.log(jsonToTs(`{ "foo": true }`))
// console.log(jsonToTs(`[{ "foo": true }]`))
// console.log(jsonToTs(`[{ "foo": true },{ "foo": true },{ "foo": true }]`))
// console.log(jsonToTs(pools))
// console.log(jsonToTs(parcels))
// console.log(jsonToTs(prices))

const myData: string = JSON.stringify(
	{
		foo: true,
		bar: 3.14,
		hype: 'beast',
		favorites: ['breakfast','lunch','dinner'],
		clients: [
			{
				id: 1,
				name: 'Stan',
				'contact-info': {
					phone: '+1 (111) 111-1111',
					email: 'stan@company.com',
				},
			},
			{
				id: 2,
				name: 'Beth',
				'contact-info': {
					phone: '+1 (222) 222-2222',
					email: 'bethany@company.com',
				},
			},
			{
				id: 3,
				name: null,
				'contact-info': {
					phone: '+1 (333) 333-3333',
					email: 'admin@company.com',
				},
				isAdmin: true,
			}
		],
		yikes: [true, 2, 'three']
	}
)

console.log(jsonToTs(myData))