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

export function FieldTimeRangePickerRead(props: Props, ref?: Ref<HTMLDivElement>) {
  const { text, mode, render, fieldProps, parsedStartText, parsedEndText } = props;
  const separator = fieldProps?.separator ?? '~';
  const dom = (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        alignItems: 'center',
      }}
    >
      {parsedStartText || parsedEndText ? (
        <>
          <div>{parsedStartText || '-'}</div>
          <div>{separator}</div>
          <div>{parsedEndText || '-'}</div>
        </>
      ) : (
        '-'
      )}
    </div>
  );
  if (render) {
    return render(text, { mode, ...fieldProps }, <span>{dom}</span>);
  }
  return dom;
}
