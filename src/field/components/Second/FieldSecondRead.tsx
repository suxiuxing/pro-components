import type { Ref } from 'react';

import type { ProFieldFC } from '../../types';
import type { FieldSecondProps } from './types';
import { formatSecond } from './utils';

export function FieldSecondRead(
  props: Parameters<ProFieldFC<FieldSecondProps>>[0],
  ref?: Ref<unknown>,
) {
  const { text, mode: type, render, fieldProps } = props;
  const secondText = formatSecond(Number(text) as number);
  const dom = <span ref={ref as Ref<HTMLSpanElement>}>{secondText}</span>;
  if (render) {
    return render(text, { mode: type, ...fieldProps }, dom);
  }
  return dom;
}
