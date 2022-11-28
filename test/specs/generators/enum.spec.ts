import { createApiBuilderServiceConfig } from '../../helpers/apibuilder';
import { createMockGenerator } from '../../../src/index';

describe('enum generator', () => {
  test('can mock enum value', () => {
    const values = [
      { name: 'russian_blue' },
      { name: 'persian' },
      { name: 'siamese' },
      { name: 'maine_coon' },
    ];
    const generator = createMockGenerator(createApiBuilderServiceConfig({
      enums: [{
        values,
        attributes: [],
        name: 'breed',
        plural: 'breeds',
      }],
    }));
    const mock = generator.enum('breed');
    expect(values.map((value) => value.name)).toContain(mock);
  });
});
