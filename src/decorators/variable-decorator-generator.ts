export function variableDecoratorGenerator(name: string, parameterName: string | null | undefined, castToType?: boolean, ...args: any[]) {
  return (target: any, key: string, index: number) => {
    const type = Reflect.getMetadata('design:paramtypes', target, key)[index];
    if (!(typeof target[key] === 'function')) {
      throw new Error(`${name} decorator must be used inside a function's parameters`);
    }
    const metadataKey = `__${name}Param_${key}_parameters`;
    const metadataExtra = `__${name}Param_${key}_meta`;

    if (!Array.isArray(target[metadataKey])) target[metadataKey] = [];
    target[metadataKey].push(index);
    if (!target['__metadata_key_types']) target['__metadata_key_types'] = new Set()
    target['__metadata_key_types'].add(name)
    if (!target[metadataExtra]) target[metadataExtra] = [];
    if (!target[metadataExtra][index]) target[metadataExtra][index] = {};
    target[metadataExtra][index] = { args, type, parameterName, castToType }
  };
}
