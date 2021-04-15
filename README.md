[![Build Status](https://travis-ci.org/apicollective/apibuilder-mock-generator.svg?branch=main)](https://travis-ci.org/apicollective/apibuilder-mock-generator)

# apibuilder-mock-generator

A mock data generator based on API Builder specifications for JavaScript

## Install

```
npm install apibuilder-mock-generator
```

## Usage

The following example assumes the `service.json` file refers to the [apibuilder specs](https://app.apibuilder.io/apicollective/apibuilder-spec/latest/service.json), which can be downloaded using the apibuilder CLI with the following command:

```bash
apibuilder download apicollective apibuilder-spec latest service > service.json
```

```javascript
import { createMockGenerator } from 'apibuilder-mock-generator';
import serviceJson from './service.json';

const generator = createMockGenerator(serviceJson);

generator.model('model');
// =>
// {
//   "name": "dolorum",
//   "plural": "nam",
//   "description": "eveniet",
//   "deprecation": {
//     "description": "id"
//   },
//   "fields": [
//     {
//       "name": "eaque",
//       "type": "ad",
//       "description": "consequuntur",
//       "deprecation": {
//         "description": "vel"
//       },
//       "default": "laboriosam",
//       "required": false,
//       "minimum": 38729,
//       "maximum": 49706,
//       "example": "numquam",
//       "attributes": [
//         {
//           "name": "totam",
//           "value": {},
//           "description": "dolores",
//           "deprecation": {
//             "description": "in"
//           }
//         }
//       ],
//       "annotations": [
//         "ducimus"
//       ]
//     }
//   ],
//   "attributes": [
//     {
//       "name": "voluptatum",
//       "value": {},
//       "description": "est",
//       "deprecation": {
//         "description": "non"
//       }
//     }
//   ]
// }
```

Check the [API reference](./docs/api-reference/README.md) for more details on mock generators.

## License

MIT
