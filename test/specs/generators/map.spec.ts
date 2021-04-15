import {
  ApiBuilderMap,
  ApiBuilderPrimitiveType,
  ApiBuilderService,
  FullyQualifiedName,
} from 'apibuilder-js';
import { createContext } from '../../../src/context';

import { mockMap } from '../../../src/generators';
import { createApiBuilderServiceConfig } from '../../helpers/apibuilder';

describe('map generator', () => {
  test('can mock map of string', () => {
    const context = createContext();
    const fqn = new FullyQualifiedName('string');
    const primitive = new ApiBuilderPrimitiveType(fqn);
    const map = new ApiBuilderMap(primitive);
    const mock = mockMap(map, context);
    expect(mock).toEqual(expect.any(Object));
    Object.keys(mock).forEach((key) => {
      const value = (mock as any)[key];
      expect(key).toEqual(expect.any(String));
      expect(value).toEqual(expect.any(String));
    });
  });

  test('can mock array of enum', () => {
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
      const context = createContext();
      const map = new ApiBuilderMap(enumeration);
      const mock = mockMap(map, context);
      expect(mock).toEqual(expect.any(Object));
      Object.keys(mock).forEach((key) => {
        const value = (mock as any)[key];
        expect(key).toEqual(expect.any(String));
        expect(enumeration.values.some((enumValue) => {
          return enumValue.name === value;
        })).toBe(true);
      });
    });
  });
});
