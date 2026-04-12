import { InputNumber } from 'antd';
import type { Ref } from 'react';

import type { ProFieldFC } from '../../types';

type Props = Parameters<
  ProFieldFC<{
    text: number | string;
    placeholder?: string;
  }>
>[0] & {
  placeholderValue: string;
};

export function FieldProgressEdit(props: Props, ref?: Ref<unknown>) {
  const { text, mode, formItemRender, fieldProps, placeholderValue } = props;
  const dom = (
    <InputNumber
      ref={ref as Ref<any>}
      placeholder={placeholderValue}
      {...fieldProps}
    />
  );
  if (formItemRender) {
    return formItemRender(text, { mode, ...fieldProps }, dom);
  }
  return dom;
}
