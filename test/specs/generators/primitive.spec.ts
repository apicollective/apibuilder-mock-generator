import { ApiBuilderPrimitiveType, FullyQualifiedName } from 'apibuilder-js';
import { mockPrimitive } from '../../../src/generators';
import {
  isJson, isUuid, isDateIso8601, isDateTimeIso8601,
} from '../../helpers/predicates';

describe('mockPrimitive', () => {
  test('can mock a primitive string', () => {
    const fqn = new FullyQualifiedName('string');
    const primitive = new ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toEqual(expect.any(String));
  });

  test('can mock a primitive boolean', () => {
    const fqn = new FullyQualifiedName('boolean');
    const primitive = new ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toEqual(expect.any(Boolean));
  });

  test('can mock a primitive date iso string', () => {
    const fqn = new FullyQualifiedName('date-iso8601');
    const primitive = new ApiBuilderPrimitiveType(fqn);
    expect(isDateIso8601(mockPrimitive(primitive))).toBe(true);
  });

  test('can mock a primitive date time iso string', () => {
    const fqn = new FullyQualifiedName('date-time-iso8601');
    const primitive = new ApiBuilderPrimitiveType(fqn);
    expect(isDateTimeIso8601(mockPrimitive(primitive))).toBe(true);
  });

  test('can mock a primitive decimal', () => {
    const fqn = new FullyQualifiedName('decimal');
    const primitive = new ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toEqual(expect.any(Number));
  });

  test('can mock a primitive double', () => {
    const fqn = new FullyQualifiedName('double');
    const primitive = new ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toEqual(expect.any(Number));
  });

  test('can mock a primitive integer', () => {
    const fqn = new FullyQualifiedName('integer');
    const primitive = new ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toEqual(expect.any(Number));
  });

  test('can mock a primitive long', () => {
    const fqn = new FullyQualifiedName('long');
    const primitive = new ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toEqual(expect.any(Number));
  });

  test('can mock a primitive json string', () => {
    const fqn = new FullyQualifiedName('json');
    const primitive = new ApiBuilderPrimitiveType(fqn);
    expect(isJson(mockPrimitive(primitive))).toBe(true);
  });

  test('can mock a primitive object', () => {
    const fqn = new FullyQualifiedName('object');
    const primitive = new ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toEqual(expect.any(Object));
  });

  test('can mock a primitive unit', () => {
    const fqn = new FullyQualifiedName('unit');
    const primitive = new ApiBuilderPrimitiveType(fqn);
    expect(mockPrimitive(primitive)).toBeUndefined();
  });

  test('can mock a primitive uuid', () => {
    const fqn = new FullyQualifiedName('uuid');
    const primitive = new ApiBuilderPrimitiveType(fqn);
    expect(isUuid(mockPrimitive(primitive))).toBe(true);
  });
});
