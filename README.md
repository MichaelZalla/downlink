![Line coverage](./badges/badge-lines.svg)
![Function coverage](./badges/badge-functions.svg)
![Branch coverage](./badges/badge-branches.svg)
![Statement coverage](./badges/badge-statements.svg)

# json-to-ts (v0.0.1)

A TypeScript module for converting JSON data (strings) into TypeScript interfaces.

## Example

```ts
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
`

console.log(jsonToTs(someJson))
```

### Output

```ts
interface IRootClientContactInfo {
    phone: string;
    email: string;
}

interface IRootClient {
    id: number;
    name?: string;
    "contact-info": IRootClientContactInfo;
    isAdmin?: boolean;
}

interface IRoot {
    foo: boolean;
    bar: number;
    hype: string;
    favorites: string[];
    clients: IRootClient[];
    yikes: (boolean|number|string)[];
}

export {IRoot}
```
