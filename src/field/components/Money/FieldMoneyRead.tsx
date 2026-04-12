import type { Ref } from 'react';

import type { ProFieldFC } from '../../types';
import { getTextByLocale } from './moneyFormat';
import type { FieldMoneyProps } from './types';

type Props = Omit<Parameters<ProFieldFC<FieldMoneyProps>>[0], 'moneySymbol'> & {
  precision: number;
  moneySymbol: string | undefined;
};

export function FieldMoneyRead(props: Props, ref?: Ref<unknown>) {
  const {
    text,
    mode: type,
    render,
    fieldProps,
    locale,
    precision,
    numberFormatOptions,
    moneySymbol,
  } = props;
  const dom = (
    <span ref={ref as Ref<HTMLSpanElement>}>
      {getTextByLocale(
        locale || false,
        text,
        precision,
        numberFormatOptions ?? fieldProps.numberFormatOptions,
        moneySymbol,
      )}
    </span>
  );
  if (render) {
    return render(text, { mode: type, ...fieldProps }, dom);
  }
  return dom;
}
