import type { Ref } from 'react';

import type { ProFieldFC, ProFieldLightProps } from '../../types';

type Props = Parameters<
  ProFieldFC<
    {
      text: string[] | number[];
      format?: string;
      variant?: 'outlined' | 'borderless' | 'filled' | 'underlined';
    } & ProFieldLightProps
  >
>[0] & {
  parsedStartText: string;
  parsedEndText: string;
};

export function FieldTimeRangePickerRead(props: Props, ref?: Ref<unknown>) {
  const { text, mode, render, fieldProps, parsedStartText, parsedEndText } = props;
  const dom = (
    <div ref={ref as Ref<HTMLDivElement>}>
      <div>{parsedStartText || '-'}</div>
      <div>{parsedEndText || '-'}</div>
    </div>
  );
  if (render) {
    return render(text, { mode, ...fieldProps }, <span>{dom}</span>);
  }
  return dom;
}
