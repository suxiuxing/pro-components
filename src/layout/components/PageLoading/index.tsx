import type { SpinProps } from 'antd';
import { Spin } from 'antd';
import type { FC } from 'react';

const PageLoading: FC<SpinProps & any> = ({
  isLoading,
  pastDelay,
  timedOut,
  error,
  retry,
  ...reset
}) => (
  <div style={{ paddingBlockStart: 100, textAlign: 'center' }}>
    <Spin
      size="large"
      {...reset}
    />
  </div>
);

export { PageLoading };
