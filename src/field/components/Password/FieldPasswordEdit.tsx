import { Input } from 'antd';
import type { Ref } from 'react';

import type { IntlType } from '../../../provider';
import type { ProFieldFC } from '../../types';

type Props = Parameters<
  ProFieldFC<{
    text: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }>
>[0] & {
  intl: IntlType;
};

export function FieldPasswordEdit(props: Props, ref?: Ref<unknown>) {
  const { text, mode, formItemRender, fieldProps, intl } = props;
  const dom = (
    <Input.Password
      placeholder={intl.getMessage('tableForm.inputPlaceholder', '请输入')}
      ref={ref as Ref<any>}
      {...fieldProps}
    />
  );
  if (formItemRender) {
    return formItemRender(text, { mode, ...fieldProps }, dom);
  }
  return dom;
}
