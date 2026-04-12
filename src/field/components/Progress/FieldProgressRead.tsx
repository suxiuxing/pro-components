import { Progress } from 'antd';
import type { Ref } from 'react';

import type { ProFieldFC } from '../../types';
import { getProgressStatus } from './utils';

type Props = Parameters<
  ProFieldFC<{
    text: number | string;
    placeholder?: string;
  }>
>[0] & {
  realValue: number | string;
};

export function FieldProgressRead(props: Props, ref?: Ref<unknown>) {
  const { mode, render, fieldProps, realValue } = props;
  const dom = (
    <Progress
      ref={ref as Ref<any>}
      size="small"
      style={{ minWidth: 100, maxWidth: 320 }}
      percent={realValue as number}
      steps={fieldProps?.steps}
      status={getProgressStatus(realValue as number)}
      {...fieldProps}
    />
  );
  if (render) {
    return render(realValue, { mode, ...fieldProps }, dom);
  }
  return dom;
}
