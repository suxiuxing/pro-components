import dayjs from 'dayjs';
import type { Ref } from 'react';

import type { ProFieldFC, ProFieldLightProps } from '../../types';

type Props = Parameters<
  ProFieldFC<
    {
      text: string | number;
      format?: string;
      variant?: 'outlined' | 'borderless' | 'filled' | 'underlined';
    } & ProFieldLightProps
  >
>[0] & {
  finalFormat: string;
};

export function FieldTimePickerRead(props: Props, ref?: Ref<unknown>) {
  const { text, mode, render, fieldProps, finalFormat } = props;
  const isNumberOrMoment = dayjs.isDayjs(text) || typeof text === 'number';
  const dom = (
    <span ref={ref as Ref<HTMLSpanElement>}>
      {text ? dayjs(text, isNumberOrMoment ? undefined : finalFormat).format(finalFormat) : '-'}
    </span>
  );
  if (render) {
    return render(text, { mode, ...fieldProps }, <span>{dom}</span>);
  }
  return dom;
}
