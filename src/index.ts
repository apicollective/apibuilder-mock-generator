import { ApiBuilderService, isEnumType, isModelType, isUnionType } from 'apibuilder-js';
import type { ApiBuilderMethod, ApiBuilderServiceConfig, ApiBuilderOperation } from 'apibuilder-js';
import { mockType } from './generators';
import { createContext } from './context';
import type { ModelGeneratorOptions, UnionGeneratorOptions } from './generators';

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
    const context = createContext();

    if (!isEnumType(type)) {
      throw new Error(`'${name}' did not match an enum in '${this.service}' service`);
    }

    return mockType(type, context);
  }

  public model(name: string, options?: ModelGeneratorOptions) {
    const type = this.service.findTypeByName(name);
    const context = createContext();

    if (!isModelType(type)) {
      throw new Error(`'${name}' did not match a model in '${this.service}' service`);
    }

    return mockType(type, context, options);
  }

  public union(name: string, options?: UnionGeneratorOptions) {
    const type = this.service.findTypeByName(name);
    const context = createContext();

    if (!isUnionType(type)) {
      throw new Error(`'${name}' did not match an union in '${this.service}' service`);
    }

    return mockType(type, context, options);
  }

  public response(params: ResponseGeneratorParameters) {
    const context = createContext();
    const operation = this.service.resources
      .reduce(
        (operations: ApiBuilderOperation[], resource) => operations.concat(resource.operations),
        [],
      )
      .find((operation: ApiBuilderOperation) => {
        return operation.path === params.path
          && operation.method === params.operation;
      });

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

    return mockType(response.type, context);
  }
}

export function createMockGenerator(schema: ApiBuilderServiceConfig) {
  const service = new ApiBuilderService(schema);
  return new Generator(service);
}
