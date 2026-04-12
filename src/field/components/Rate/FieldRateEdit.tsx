import { Rate } from 'antd';
import type { Ref } from 'react';

import type { ProFieldFC } from '../../types';

export function FieldRateEdit(
  props: Parameters<ProFieldFC<{ text: string }>>[0],
  ref?: Ref<unknown>,
) {
  const { text, mode, formItemRender, fieldProps } = props;
  const dom = (
    <Rate
      allowHalf
      ref={ref as Ref<any>}
      {...fieldProps}
    />
  );
  if (formItemRender) {
    return formItemRender(text, { mode, ...fieldProps }, dom);
  }
  return dom;
}
