import { omit } from '@rc-component/util';
import type { Ref } from 'react';

import type { ProFieldFC } from '../../types';
import FieldTextAreaReadonly from './readonly';

type Props = Parameters<ProFieldFC<{ text: string }>>[0];

export function FieldTextAreaRead(props: Props, ref?: Ref<unknown>) {
  const { text, mode, render, fieldProps } = props;
  const dom = (
    <FieldTextAreaReadonly
      {...props}
      ref={ref}
    />
  );
  if (render) {
    return render(
      text,
      {
        text,
        mode,
        ...(omit(fieldProps, ['showCount']) as object),
      },
      dom,
    );
  }
  return dom;
}
