export interface GeneratorContext {
  ancestors: string[];
}

export function createContext(): GeneratorContext {
  return {
    ancestors: [],
  };
}
