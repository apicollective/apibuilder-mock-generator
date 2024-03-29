/* eslint-disable @typescript-eslint/no-use-before-define */
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
  ApiBuilderResponse,
} from 'apibuilder-js';

import faker from 'faker';

export function mockPrimitive(type: ApiBuilderPrimitiveType): any {
  switch (type.fullName) {
    case Kind.STRING:
      return faker.random.word();
    case Kind.BOOLEAN:
      return faker.random.boolean();
    case Kind.DATE_ISO8601:
      return faker.date.future().toISOString().slice(0, 10);
    case Kind.DATE_TIME_ISO8601:
      return faker.date.future().toISOString();
    case Kind.DECIMAL:
    case Kind.DOUBLE:
      return faker.random.number({ precision: 0.01 });
    case Kind.INTEGER:
    case Kind.LONG:
      return faker.random.number({ precision: 1 });
    case Kind.JSON:
      return JSON.stringify({});
    case Kind.OBJECT:
      return {};
    case Kind.UNIT:
      return undefined;
    case Kind.UUID:
      return faker.random.uuid();
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
  options: ArrayGeneratorOptions = {},
): any[] {
  const {
    minimum = 0,
    maximum = 3,
  } = options;

  const length = faker.random.number({
    min: minimum,
    max: Math.max(minimum, maximum),
  });

  return Array.from({ length }, () => mock(array.ofType))
    .filter((type) => type != null);
}

export function mockMap(map: ApiBuilderMap): any {
  return Array.from<Record<string, any>>({
    length: faker.random.number({ min: 1, max: 3 }),
  }).reduce(
    (previousValue) => ({
      ...previousValue,
      [faker.hacker.noun()]: mock(map.ofType),
    }),
    {},
  );
}

export function mockEnum(enumeration: ApiBuilderEnum): any {
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

      const hasRange = field.minimum != null || field.maximum != null;
      const hasDefault = field.default != null;
      const hasExample = field.example != null;
      const hasOverride = Object.prototype.hasOwnProperty.call(properties, field.name);

      if (onlyRequired && !field.isRequired && !hasOverride) {
        return previousValue;
      }

      if (hasOverride) {
        value = properties[field.name];
      } else if (hasExample && useExample) {
        value = field.example;
      } else if (!field.isRequired && hasDefault && useDefault) {
        value = field.default;
      } else if (isArrayType(field.type) && hasRange) {
        value = mock(field.type, {
          maximum: field.maximum,
          minimum: field.minimum,
        });
      } else if (
        isPrimitiveType(field.type)
        && field.type.typeName === Kind.STRING
        && hasRange) {
        value = faker.random.alphaNumeric(faker.random.number({
          min: field.minimum,
          max: field.maximum,
        }));
      } else {
        value = mock(field.type);
      }

      return { ...previousValue, [field.name]: value };
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
  options: UnionGeneratorOptions = {},
): any {
  const {
    type,
    properties = {},
  } = options;

  const unionType = (type != null)
    ? union.types.find((ut) => ut.typeName === type)
    : faker.random.arrayElement(union.types);

  if (unionType == null) {
    throw new Error(`${type} is not an union type in ${union} union.`);
  }

  const discriminatorKey = union.discriminator;
  const { discriminatorValue } = unionType;

  if (isPrimitiveType(unionType.type) || isEnumType(unionType.type)) {
    return {
      [discriminatorKey]: discriminatorValue,
      value: Object.prototype.hasOwnProperty.call(properties, 'value') ? properties.value : mock(unionType.type),
    };
  }

  if (isModelType(unionType.type)) {
    return {
      [discriminatorKey]: discriminatorValue,
      ...mockModel(unionType.type, {
        properties,
      }),
    };
  }

  return {
    [discriminatorKey]: discriminatorValue,
    ...mock(unionType.type),
  };
}

export function mockResponse(response: ApiBuilderResponse) {
  return mock(response.type);
}

export function mock(type: ApiBuilderPrimitiveType): any;
export function mock(type: ApiBuilderArray, options?: ArrayGeneratorOptions): any[];
export function mock(type: ApiBuilderMap): any;
export function mock(type: ApiBuilderModel, options?: ModelGeneratorOptions): any;
export function mock(type: ApiBuilderEnum): any;
export function mock(type: ApiBuilderUnion): any;
export function mock(type: ApiBuilderType): any;
export function mock(type: any, options?: any): any {
  let mck;

  if (isArrayType(type)) {
    mck = mockArray(type, options);
  } else if (isMapType(type)) {
    mck = mockMap(type);
  } else if (isUnionType(type)) {
    mck = mockUnion(type);
  } else if (isModelType(type)) {
    mck = mockModel(type, options);
  } else if (isEnumType(type)) {
    mck = mockEnum(type);
  } else if (isPrimitiveType(type)) {
    mck = mockPrimitive(type);
  }

  return mck;
}
