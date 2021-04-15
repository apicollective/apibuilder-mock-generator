import {
  ApiBuilderArray,
  ApiBuilderEnum,
  ApiBuilderMap,
  ApiBuilderModel,
  ApiBuilderPrimitiveType,
  ApiBuilderType,
  ApiBuilderUnion,
  Kind,
  isArrayType,
  isEnumType,
  isMapType,
  isModelType,
  isPrimitiveType,
  isUnionType,
} from 'apibuilder-js';

import faker from 'faker';

import {
  GeneratorContext,
} from './context';

export function mockPrimitive(
  type: ApiBuilderPrimitiveType,
): any {
  switch (type.fullName) {
    case Kind.STRING:
      return faker.random.word();
    case Kind.BOOLEAN:
      return faker.datatype.boolean();
    case Kind.DATE_ISO8601:
      return faker.date.future().toISOString().slice(0, 10);
    case Kind.DATE_TIME_ISO8601:
      return faker.date.future().toISOString();
    case Kind.DECIMAL:
    case Kind.DOUBLE:
      return faker.datatype.number({ precision: 0.01 });
    case Kind.INTEGER:
    case Kind.LONG:
      return faker.datatype.number({ precision: 1 });
    case Kind.JSON:
      return JSON.stringify({});
    case Kind.OBJECT:
      return {};
    case Kind.UNIT:
      return undefined;
    case Kind.UUID:
      return faker.datatype.uuid();
    default:
      return undefined;
  }
}

export interface ArrayGeneratorOptions {
  readonly minimum?: number;
  readonly maximum?: number;
}

export function mockArray(
  array: ApiBuilderArray,
  context: GeneratorContext,
  options: ArrayGeneratorOptions = {},
): any[] {
  const {
    minimum = 0,
    maximum = 3,
  } = options;

  const length = faker.datatype.number({
    min: minimum,
    max: Math.max(minimum, maximum),
  });

  return Array.from({ length }, () => mockType(array.ofType, context))
    .filter(type => type != null);
}

export function mockMap(
  map: ApiBuilderMap,
  context: GeneratorContext,
): any {
  return Array.from<Record<string, any>>({
    length: faker.datatype.number({ min: 1, max: 3 }),
  }).reduce(
    previousValue => ({
      ...previousValue,
      [faker.hacker.noun()]: mockType(map.ofType, context),
    }),
    {},
  );
}

export function mockEnum(
  enumeration: ApiBuilderEnum,
): any {
  const value = faker.random.arrayElement(enumeration.values);
  return (value != null) ? value.name : undefined;
}

export interface ModelGeneratorOptions {
  readonly onlyRequired?: boolean;
  readonly useDefault?: boolean;
  readonly useExample?: boolean;
  readonly properties?: Record<string, any>;
}

export function mockModel(
  model: ApiBuilderModel,
  context: GeneratorContext,
  options: ModelGeneratorOptions = {},
): any {
  const {
    onlyRequired = false,
    useDefault = false,
    useExample = false,
    properties = {},
  } = options;

  const initial: { [key: string]: any } = {};

  if (model.discriminator != null && model.discriminatorValue != null) {
    initial[model.discriminator] = model.discriminatorValue;
  }

  return model.fields.reduce(
    (previousValue, field) => {
      let value;

      const hasCircularReference = context.ancestors.includes(field.type.toString());
      const hasRange = field.minimum != null || field.maximum != null;
      const hasDefault = field.default != null;
      const hasExample = field.example != null;
      const hasOverride = properties.hasOwnProperty(field.name);

      if (onlyRequired && !field.isRequired && !hasOverride) {
        return previousValue;
      }

      if (hasCircularReference && !field.isRequired) {
        return previousValue;
      }

      if (hasOverride) {
        value = properties[field.name];
      } else if (hasExample && useExample) {
        value = field.example;
      } else if (!field.isRequired && hasDefault && useDefault) {
        value = field.default;
      } else if (isArrayType(field.type) && hasRange) {
        value = mockType(field.type, context, {
          maximum: field.maximum,
          minimum: field.minimum,
        });
      } else if (
        isPrimitiveType(field.type)
        && field.type.typeName === Kind.STRING
        && hasRange) {
        value = faker.random.alphaNumeric(faker.datatype.number({
          min: field.minimum,
          max: field.maximum,
        }));
      } else {
        value = mockType(field.type, context);
      }

      return {
        ...previousValue,
        [field.name]: value,
      };
    },
    initial,
  );
}

export interface UnionGeneratorOptions {
  readonly type?: string;
  readonly properties?: Record<string, any>;
}

export function mockUnion(
  union: ApiBuilderUnion,
  context: GeneratorContext,
  options: UnionGeneratorOptions = {},
): any {
  const {
    type,
    properties = {},
  } = options;

  const unionType = (type != null)
    ? union.types.find(unionType => unionType.typeName === type)
    : faker.random.arrayElement(union.types);

  if (unionType == null) {
    throw new Error(`${type} is not an union type in ${union} union.`);
  }

  const discriminatorKey = union.discriminator;
  const discriminatorValue = unionType.discriminatorValue;

  if (isPrimitiveType(unionType.type) || isEnumType(unionType.type)) {
    return {
      [discriminatorKey]: discriminatorValue,
      value: properties.hasOwnProperty('value')
        ? properties.value
        : mockType(unionType.type, context),
    };
  }

  if (isModelType(unionType.type)) {
    return {
      [discriminatorKey]: discriminatorValue,
      ...mockModel(unionType.type, context, {
        properties,
      }),
    };
  }

  return {
    [discriminatorKey]: discriminatorValue,
    ...mockType(unionType.type, context),
  };
}

export function mockType(
  type: ApiBuilderPrimitiveType,
  context: GeneratorContext,
): any;

export function mockType(
  type: ApiBuilderArray,
  context: GeneratorContext,
  options?: ArrayGeneratorOptions,
): any[];

export function mockType(
  type: ApiBuilderMap,
  context: GeneratorContext,
): any;

export function mockType(
  type: ApiBuilderModel,
  context: GeneratorContext,
  options?: ModelGeneratorOptions,
): any;

export function mockType(
  type: ApiBuilderEnum,
  context: GeneratorContext,
): any;

export function mockType(
  type: ApiBuilderUnion,
  context: GeneratorContext,
  options?: UnionGeneratorOptions,
): any;

export function mockType(
  type: ApiBuilderType,
  context: GeneratorContext,
): any;

export function mockType(
  type: ApiBuilderType,
  context: GeneratorContext,
  options?: any,
): any {
  context.ancestors.push(type.toString());
  if (isArrayType(type)) return mockArray(type, context, options);
  if (isMapType(type)) return mockMap(type, context);
  if (isUnionType(type)) return mockUnion(type, context, options);
  if (isModelType(type)) return mockModel(type, context, options);
  if (isEnumType(type)) return mockEnum(type);
  if (isPrimitiveType(type)) return mockPrimitive(type);
  throw new TypeError('Invalid type provided to generator');
}
