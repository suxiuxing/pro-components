import type { DatePickerProps } from 'antd';
import React from 'react';

import type { ProFormFieldItemProps } from '../../typing';
import { BaseDatePicker } from './BaseDatePicker';

const valueType = 'dateQuarter' as const;
/**
 * 周选择组件
 *
 * @param
 */
const ProFormDatePickerQuarter: React.FC<
  ProFormFieldItemProps<DatePickerProps> & { ref?: React.Ref<any> }
> = ({ proFieldProps, fieldProps, ref, ...rest }) => {
  return (
    <BaseDatePicker
      valueType={valueType}
      ref={ref as any}
      fieldProps={{
        ...fieldProps,
      }}
      proFieldProps={proFieldProps}
      fieldConfig={{
        valueType,
        customLightMode: true,
      }}
      {...rest}
    />
  );
};

export default ProFormDatePickerQuarter;
