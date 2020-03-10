import { ApiBuilderMethod } from 'apibuilder-js';
import { createApiBuilderServiceConfig } from '../../helpers/apibuilder';
import { createMockGenerator } from '../../../src/index';

describe('response generator', () => {
  test('can generate response model for specified path, status, and operation', () => {
    const schema = createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'id',
          type: 'uuid',
          attributes: [],
          required: true,
        }, {
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
      resources: [{
        path: '/pets/:id',
        plural: 'pets',
        type: 'pet',
        attributes: [],
        operations: [{
          path: '/pets/:id',
          method: 'GET',
          responses: [{
            code: {
              integer: {
                value: 200,
              },
            },
            type: 'pet',
            attributes: [],
          }],
          parameters: [],
          attributes: [],
        }],
      }],
    });
    const generator = createMockGenerator(schema);
    const mock = generator.response({
      path: '/pets/:id',
      operation: 'GET',
      response: 200,
    });
    expect(mock).toEqual({
      id: expect.any(String),
      name: expect.any(String),
    });
  });
});
