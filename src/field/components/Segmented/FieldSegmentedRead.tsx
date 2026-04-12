import type { ReactNode } from 'react';

import { objectToMap, proFieldParsingText } from '../../../utils';
import type { ProFieldFC } from '../../types';
import type { FieldSelectProps } from '../Select';

type Props = Parameters<
  ProFieldFC<
    {
      text: string;
      emptyText?: ReactNode;
    } & FieldSelectProps
  >
>[0] & {
  optionsValueEnum: Record<string, any> | undefined;
  emptyText: ReactNode;
};

export function FieldSegmentedRead(props: Props) {
  const { text, mode, render, fieldProps, emptyText, optionsValueEnum, valueEnum } = props;
  const dom = <>{proFieldParsingText(text, objectToMap(valueEnum || optionsValueEnum))}</>;

  if (render) {
    return render(text, { mode, ...fieldProps }, <>{dom}</>) ?? emptyText;
  }
  return dom;
}
