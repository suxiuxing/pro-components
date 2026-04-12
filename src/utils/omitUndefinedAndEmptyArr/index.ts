import { omitBy } from 'es-toolkit/object';

export const omitUndefinedAndEmptyArr = <T extends Record<string, any>>(obj: T): T => {
  const newObj = omitBy(
    obj ?? {},
    (value) => value === undefined || (Array.isArray(value) && value.length === 0),
  );
  return newObj as T;
};
