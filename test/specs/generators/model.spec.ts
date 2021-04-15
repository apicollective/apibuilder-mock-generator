import { createMockGenerator } from '../../../src/index';
import { createApiBuilderServiceConfig } from '../../helpers/apibuilder';

describe('model generator', () => {
  test('can mock model containing field of primitive type', () => {
    const schema = createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
        }, {
          name: 'age',
          type: 'integer',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet');
    expect(mock).toEqual({
      name: expect.any(String),
      age: expect.any(Number),
    });
  });

  test('can mock model containing field of enum type', () => {
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
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
        }, {
          name: 'breed',
          type: 'breed',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet');
    expect(mock).toEqual({
      name: expect.any(String),
      breed: expect.stringMatching(/^(russian_blue|persian|siamese|maine_coon)$/),
    });
  });

  test('can mock model containing field of model type', () => {
    const schema = createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        fields: [{
          name: 'name',
          type: 'name',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }, {
        name: 'name',
        plural: 'names',
        fields: [{
          name: 'first',
          type: 'string',
          attributes: [],
          required: true,
        }, {
          name: 'last',
          type: 'string',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet');
    expect(mock).toEqual({
      name: {
        first: expect.any(String),
        last: expect.any(String),
      },
    });
  });

  test('can disallow generation of optional fields', () => {
    const schema = createApiBuilderServiceConfig({
      enums: [{
        name: 'gender',
        plural: 'genders',
        values: [
          { name: 'male' },
          { name: 'female' },
        ],
        attributes: [],
      }],
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
          required: false,
        }, {
          name: 'gender',
          type: 'gender',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet', {
      onlyRequired: true,
    });
    expect(mock).not.toHaveProperty('name');
  });

  test('can allow generation of optional fields', () => {
    const schema = createApiBuilderServiceConfig({
      enums: [{
        name: 'gender',
        plural: 'genders',
        values: [
          { name: 'male' },
          { name: 'female' },
        ],
        attributes: [],
      }],
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
          required: false,
        }, {
          name: 'gender',
          type: 'gender',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet', {
      onlyRequired: false,
    });
    expect(mock).toHaveProperty('name');
  });

  test('can use default value for optional fields', () => {
    const schema = createApiBuilderServiceConfig({
      enums: [{
        name: 'gender',
        plural: 'genders',
        values: [
          { name: 'male' },
          { name: 'female' },
        ],
        attributes: [],
      }],
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
          default: 'anonymous',
          type: 'string',
          attributes: [],
          required: false,
        }, {
          name: 'gender',
          type: 'gender',
          attributes: [],
          required: true,
        }],
        attributes: [],
      }],
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet', {
      useDefault: true,
      onlyRequired: false,
    });
    expect(mock).toHaveProperty('name', 'anonymous');
  });

  test('can use field examples as generated value', () => {
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
          example: 'Lucy',
        }],
        attributes: [],
      }],
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet', {
      useExample: true,
    });
    expect(mock).toHaveProperty('name', 'Lucy');
  });

  test('does not use field example as generated value', () => {
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
          example: 'Lucy',
        }],
        attributes: [],
      }],
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet');
    expect(mock).not.toHaveProperty('name', 'Lucy');
  });

  test('can override field values', () => {
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
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet', {
      properties: {
        name: 'Pluto',
      },
    });
    expect(mock).toHaveProperty('name', 'Pluto');
  });

  test('can only override fields defined in the model specifications', () => {
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
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet', {
      properties: {
        notInSpec: 'someValue',
      },
    });
    expect(mock).toEqual({
      id: expect.any(String),
      name: expect.any(String),
    });
  });

  test('takes into consideration maximum value for field of type array', () => {
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
        }, {
          name: 'owners',
          type: '[owner]',
          attributes: [],
          maximum: 0,
          required: true,
        }],
        attributes: [],
      }, {
        name: 'owner',
        plural: 'owners',
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
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet');
    expect(mock).toHaveProperty('owners', expect.any(Array));
    expect(mock.owners).toHaveLength(0);
  });

  test('takes into consideration minimum value for field of type array', () => {
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
        }, {
          name: 'owners',
          type: '[owner]',
          attributes: [],
          minimum: 5,
          required: true,
        }],
        attributes: [],
      }, {
        name: 'owner',
        plural: 'owners',
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
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet');
    expect(mock).toHaveProperty('owners', expect.any(Array));
    expect(mock.owners.length).toBeGreaterThanOrEqual(5);
  });

  test('takes into consideration maximum value for field of type string', () => {
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
          maximum: 1,
          required: true,
        }],
        attributes: [],
      }],
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet');
    expect(mock).toHaveProperty('name', expect.any(String));
    expect(mock.name.length).toBeLessThanOrEqual(1);
  });

  test('takes into consideration minimum value for field of type string', () => {
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
          minimum: 10,
          required: true,
        }],
        attributes: [],
      }],
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet');
    expect(mock).toHaveProperty('name', expect.any(String));
    expect(mock.name.length).toBeGreaterThanOrEqual(10);
  });

  test('copies non-required properties when only required fields are generated', () => {
    const schema = createApiBuilderServiceConfig({
      enums: [{
        name: 'gender',
        plural: 'genders',
        values: [
          { name: 'male' },
          { name: 'female' },
        ],
        attributes: [],
      }],
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
          required: false,
        }, {
          name: 'gender',
          type: 'gender',
          attributes: [],
          required: false,
        }],
        attributes: [],
      }],
    });
    const generator = createMockGenerator(schema);
    const mock = generator.model('pet', {
      onlyRequired: true,
      properties: {
        name: 'Pluto',
      },
    });
    expect(mock).toEqual({
      id: expect.any(String),
      name: 'Pluto',
    });
  });

  test('adds discriminator to model present in union type', () => {
    const schema = createApiBuilderServiceConfig({
      models: [{
        attributes: [],
        name: 'bird',
        plural: 'birds',
        fields: [{
          attributes: [],
          name: 'name',
          required: true,
          type: 'string',
        }],
      }, {
        attributes: [],
        name: 'fish',
        plural: 'fishes',
        fields: [{
          attributes: [],
          name: 'name',
          required: true,
          type: 'string',
        }],
      }],
      unions: [{
        attributes: [],
        name: 'pet',
        plural: 'pets',
        types: [{
          attributes: [],
          type: 'bird',
        }, {
          attributes: [],
          type: 'fish',
        }],
      }],
    });
    const generator = createMockGenerator(schema);

    const fish = generator.model('fish', {
      properties: {
        name: 'Nemo',
      },
    });

    const bird = generator.model('bird', {
      properties: {
        name: 'Tweety',
      },
    });

    expect(fish).toEqual({
      discriminator: 'fish',
      name: 'Nemo',
    });

    expect(bird).toEqual({
      discriminator: 'bird',
      name: 'Tweety',
    });
  });

  test('omits optional field with circular references', () => {
    const schema = createApiBuilderServiceConfig({
      models: [{
        name: 'pet',
        plural: 'pets',
        attributes: [],
        fields: [{
          name: 'name',
          type: 'string',
          attributes: [],
          required: true,
        }, {
          name: 'parent',
          type: 'pet',
          attributes: [],
          required: false,
        }],
      }],
    });
    const generator = createMockGenerator(schema);
    const fish = generator.model('pet');
    expect(fish).toEqual({
      name: expect.any(String),
    });
  });
});

test('omits deep optional field with circular references', () => {
  const schema = createApiBuilderServiceConfig({
    models: [{
      name: 'bar',
      plural: 'bars',
      attributes: [],
      fields: [{
        name: 'baz',
        attributes: [],
        required: true,
        type: 'baz',
      }],
    }, {
      name: 'baz',
      plural: 'bazes',
      attributes: [],
      fields: [{
        name: 'foo',
        attributes: [],
        required: true,
        type: 'foo',
      }],
    }, {
      name: 'foo',
      plural: 'foos',
      attributes: [],
      fields: [{
        name: 'qux',
        attributes: [],
        required: true,
        type: 'qux',
      }],
    }, {
      name: 'qux',
      plural: 'quxes',
      attributes: [],
      fields: [{
        name: 'bar',
        attributes: [],
        required: false,
        type: 'bar',
      }],
    }],
  });
  const generator = createMockGenerator(schema);
  const bar = generator.model('bar');
  expect(bar).toEqual({
    baz: {
      foo: {
        qux: {},
      },
    },
  });
});

test('throws when required field has a circular reference', () => {
  const schema = createApiBuilderServiceConfig({
    models: [{
      name: 'pet',
      plural: 'pets',
      attributes: [],
      fields: [{
        name: 'name',
        type: 'string',
        attributes: [],
        required: true,
      }, {
        name: 'parent',
        type: 'pet',
        attributes: [],
        required: true,
      }],
    }],
  });
  const generator = createMockGenerator(schema);
  const subject = () => generator.model('pet');
  expect(subject).toThrow();
});
