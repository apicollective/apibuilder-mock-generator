import {
  ApiBuilderMethod,
  ApiBuilderService,
  ApiBuilderServiceConfig,
  isEnumType,
  isModelType,
  isUnionType,
  ApiBuilderOperation,
} from 'apibuilder-js';

import {
  mockEnum,
  mockModel,
  mockUnion,
  mockResponse,
  ModelGeneratorOptions,
  UnionGeneratorOptions,
} from './generators';

export interface ResponseGeneratorParameters {
  readonly path: string;
  readonly operation: ApiBuilderMethod;
  readonly response: number;
}

export class Generator {
  service: ApiBuilderService;

  constructor(service: ApiBuilderService) {
    this.service = service;
  }

  public enum(name: string) {
    const type = this.service.findTypeByName(name);

    if (!isEnumType(type)) {
      throw new Error(`'${name}' did not match an enum in '${this.service}' service`);
    }

    return mockEnum(type);
  }

  public model(name: string, options?: ModelGeneratorOptions) {
    const type = this.service.findTypeByName(name);

    if (!isModelType(type)) {
      throw new Error(`'${name}' did not match a model in '${this.service}' service`);
    }

    return mockModel(type, options);
  }

  public union(name: string, options?: UnionGeneratorOptions) {
    const type = this.service.findTypeByName(name);

    if (!isUnionType(type)) {
      throw new Error(`'${name}' did not match an union in '${this.service}' service`);
    }

    return mockUnion(type, options);
  }

  public response(params: ResponseGeneratorParameters) {
    const operation = this.service.resources
      .reduce(
        (operations: ApiBuilderOperation[], resource) => operations.concat(resource.operations),
        [],
      )
      .find((op: ApiBuilderOperation) => op.path === params.path
          && op.method === params.operation);

    if (operation == null) {
      throw new Error(
        `'${params.operation} ${params.path}' did not match an operation `
        + `in '${this.service}' service.`,
      );
    }

    const response = operation.getResponseByCode(params.response);

    if (response == null) {
      throw new Error(
        `A ${params.response} response for '${params.operation} ${params.path}' operation`
        + `is not available in '${this.service}' service`,
      );
    }

    return mockResponse(response);
  }
}

export function createMockGenerator(schema: ApiBuilderServiceConfig) {
  const service = new ApiBuilderService(schema);
  return new Generator(service);
}
