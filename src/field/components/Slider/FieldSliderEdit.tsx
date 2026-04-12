import { Slider } from 'antd';
import type { Ref } from 'react';

import type { ProFieldFC } from '../../types';

export function FieldSliderEdit(
  props: Parameters<ProFieldFC<{ text: string }>>[0],
  ref?: Ref<unknown>,
) {
  const { text, mode, formItemRender, fieldProps } = props;
  const dom = (
    <Slider
      ref={ref as Ref<any>}
      {...fieldProps}
      style={{
        minWidth: 120,
        ...fieldProps?.style,
      }}
    />
  );
  if (formItemRender) {
    return formItemRender(text, { mode, ...fieldProps }, dom);
  }
  return dom;
}
