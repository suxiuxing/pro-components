import type { CheckboxGroupProps } from 'antd/es/checkbox';

import type { FieldSelectProps } from '../Select';

export type GroupProps = {
  layout?: 'horizontal' | 'vertical';
  options?: CheckboxGroupProps['options'];
} & FieldSelectProps;
