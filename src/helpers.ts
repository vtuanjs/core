/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ValidationError } from './errors';

export function isStringAndNotEmpty(entity: unknown): boolean {
  return typeof entity === 'string' && entity.trim() !== '';
}

export function isUndefinedOrNull(entity: unknown): boolean {
  return entity === undefined || entity === null;
}

export function waitByPromise(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateTimestamp(): number {
  return Date.now();
}

export function isObjectHasOwnOneOfValues<T = { [key: string]: string }>(
  object: T,
  values: (keyof T)[]
): boolean {
  for (const value of values) {
    if (!isUndefinedOrNull(object[value])) return true;
  }
  return false;
}

export function isChanged(source: unknown, dest: unknown): boolean {
  if (typeof source != 'string') source = JSON.stringify(source);
  if (typeof dest != 'string') dest = JSON.stringify(dest);

  return source != dest;
}

export function isObject(entity: any): boolean {
  return typeof entity === 'object' && entity != null;
}

/**
 * Return all changed value of destination object
 */
export function findChangedValue(source: any, dest: any): any {
  if (!isObject(source) || !isObject(dest)) return {};
  const result: any = {};

  for (const key of Object.keys(source)) {
    if (
      !isUndefinedOrNull(source[key]) &&
      !isUndefinedOrNull(dest[key]) &&
      isChanged(source[key], dest[key])
    ) {
      result[key] = dest[key];
    }
  }

  return result;
}

export function validateRequiredField<T>(fields: (keyof T)[], source: any) {
  const errors: string[] = [];
  for (const field of fields) {
    if (!source[field]) {
      errors.push(field as string);
    }
  }

  if (errors.length)
    throw new ValidationError(undefined, {
      fields: errors
    });

  return true;
}
