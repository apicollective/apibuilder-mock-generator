/* eslint-disable import/prefer-default-export */
import { ApiBuilderServiceConfig } from 'apibuilder-js';

const defaultServiceConfig: ApiBuilderServiceConfig = {
  apidoc: {
    version: '1.0.0',
  },
  name: 'petstore',
  organization: {
    key: 'petstore',
  },
  application: {
    key: 'petstore',
  },
  namespace: 'com.petstore.api.v1',
  version: '1.0.0',
  base_url: 'http://api.petstore.com',
  info: {},
  headers: [],
  imports: [],
  enums: [],
  unions: [],
  models: [],
  resources: [],
  attributes: [],
  annotations: [],
};

export function createApiBuilderServiceConfig(
  config: Partial<ApiBuilderServiceConfig>,
): ApiBuilderServiceConfig {
  return { ...defaultServiceConfig, ...config };
}
