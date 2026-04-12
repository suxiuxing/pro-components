import { Input } from 'antd';
import type { Ref } from 'react';

import type { ProFieldFC } from '../../types';

type FieldCodeEditProps = Parameters<
  ProFieldFC<{ text: string; language?: 'json' | 'text' }>
>[0] & {
  code: string;
};

export function FieldCodeEdit(props: FieldCodeEditProps, ref?: Ref<unknown>) {
  const { code, mode, formItemRender, fieldProps } = props;
  const fp = { ...fieldProps, value: code };
  const dom = (
    <Input.TextArea
      rows={5}
      {...fp}
      ref={ref as Ref<any>}
    />
  );
  if (formItemRender) {
    return formItemRender(code, { mode, ...fp, ref }, dom) ?? null;
  }
  return dom;
}
