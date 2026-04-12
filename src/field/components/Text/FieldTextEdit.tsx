import { Input } from 'antd';
import type { ReactNode, RefObject } from 'react';

import type { IntlType } from '../../../provider';
import type { ProFieldFC } from '../../types';

type FieldTextEditProps = Parameters<ProFieldFC<{ text: string; emptyText?: ReactNode }>>[0] & {
  inputRef: RefObject<HTMLInputElement | null>;
  intl: IntlType;
};

export function FieldTextEdit(props: FieldTextEditProps) {
  const { text, mode, formItemRender, fieldProps, inputRef, intl } = props;
  const placeholder = intl.getMessage('tableForm.inputPlaceholder', '请输入');
  const dom = (
    <Input
      ref={inputRef}
      placeholder={placeholder}
      allowClear
      {...fieldProps}
    />
  );

  if (formItemRender) {
    return formItemRender(text, { mode, ...fieldProps }, dom);
  }
  return dom;
}
