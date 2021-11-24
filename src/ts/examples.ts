import { jsonToTs } from './convert';

// import './examples/parcels'
// import './examples/pools'
// import './examples/prices'

const someJson: string = `
{
    "foo": true,
    "bar": 3.14,
    "hype": "beast",
    "favorites": [
        "breakfast",
        "lunch",
        "dinner"
    ],
    "clients": [
        {
            "id": 1,
            "name": "Stan",
            "contact-info": {
                "phone": "+1 (111) 111-1111",
                "email": "stan@company.com"
            }
        },
        {
            "id": 2,
            "name": "Beth",
            "contact-info": {
                "phone": "+1 (222) 222-2222",
                "email": "bethany@company.com"
            }
        },
        {
            "id": 3,
            "name": null,
            "contact-info": {
                "phone": "+1 (333) 333-3333",
                "email": "admin@company.com"
            },
            "isAdmin": true
        }
    ],
    "yikes": [
        true,
        2,
        "three"
    ]
}
`;
console.log(jsonToTs(someJson));
