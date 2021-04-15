import {
  ApiBuilderPrimitiveType,
  ApiBuilderArray,
  ApiBuilderService,
  FullyQualifiedName,
} from 'apibuilder-js';
import { createContext } from '../../../src/context';
import { mockArray } from '../../../src/generators';
import { createApiBuilderServiceConfig } from '../../helpers/apibuilder';

describe('array generator', () => {
  test('can mock array of string', () => {
    const fqn = new FullyQualifiedName('string');
    const context = createContext();
    const primitive = new ApiBuilderPrimitiveType(fqn);
    const array = new ApiBuilderArray(primitive);
    const mock = mockArray(array, context);
    expect(mock).toEqual(expect.any(Array));
    mock.forEach((element) => {
      expect(element).toEqual(expect.any(String));
    });
  });

  test('can mock array of enum', () => {
    const context = createContext();
    const schema = createApiBuilderServiceConfig({
      enums: [{
        attributes: [],
        name: 'breed',
        plural: 'breeds',
        values: [
          { name: 'russian_blue' },
          { name: 'persian' },
          { name: 'siamese' },
          { name: 'maine_coon' },
        ],
      }],
    });
    const service = new ApiBuilderService(schema);
    service.enums.forEach((enumeration) => {
      const array = new ApiBuilderArray(enumeration);
      const mock = mockArray(array, context);
      expect(mock).toEqual(expect.any(Array));
      mock.forEach((value) => {
        expect(enumeration.values.some((enumValue) => {
          return enumValue.name === value;
        })).toBe(true);
      });
    });
  });

  test('can mock array of model', () => {
    const context = createContext();
    const schema = createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    });
    const service = new ApiBuilderService(schema);
    service.models.forEach((model) => {
      const array = new ApiBuilderArray(model);
      const mock = mockArray(array, context);
      expect(mock).toEqual(expect.any(Array));
      mock.forEach((value) => {
        expect(value).toEqual(expect.objectContaining({
          name: expect.any(String),
        }));
      });
    });
  });

  test('does not generate nil values for array of enums without values', () => {
    const context = createContext();
    const schema = createApiBuilderServiceConfig({
      enums: [{
        name: 'breed',
        plural: 'breeds',
        values: [],
        attributes: [],
      }],
    });
    const service = new ApiBuilderService(schema);
    service.enums.forEach((enumeration) => {
      const array = new ApiBuilderArray(enumeration);
      const mock = mockArray(array, context, { minimum: 1 });
      expect(mock).toEqual([]);
    });
  });
});
