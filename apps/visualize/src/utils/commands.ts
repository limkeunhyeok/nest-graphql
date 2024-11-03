import { AppModule as HexaModule } from 'apps/hexagonal/src/app.module';
import { AppModule as LayeredModule } from 'apps/layered/src/app.module';

export function isValidType(type: string) {
  const validTypes = ['app'];
  return validTypes.includes(type);
}

export function isValidProjectName(name: string) {
  const validNames = ['hexagonal', 'layered'];
  return validNames.includes(name);
}

export function getAppModule(type: string, target: string) {
  if (!isValidType(type)) {
    throw Error('Invalid type.');
  }

  if (!isValidProjectName(target)) {
    throw Error('Invalid proejct name.');
  }
  if (target === 'hexagonal') {
    return HexaModule;
  }

  if (target === 'layered') {
    return LayeredModule;
  }
}
