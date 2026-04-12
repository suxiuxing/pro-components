import { omitBy } from 'es-toolkit/object';
import { isUndefined } from 'es-toolkit/predicate';

type OmitUndefined<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export const omitUndefined = <T extends Record<string, any>>(obj: T): OmitUndefined<T> => {
  const newObj = omitBy(obj ?? {}, isUndefined);
  if (Object.keys(newObj as Record<string, any>).length < 1) {
    return undefined as any;
  }
  return newObj as OmitUndefined<T>;
};
