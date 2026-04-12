import type { DatePickerProps } from 'antd';
import React from 'react';

import type { ProFormFieldItemProps } from '../../typing';
import { BaseDatePicker } from './BaseDatePicker';

const valueType = 'dateTime' as const;

/**
 * 时间日期选择组件
 *
 * @param
 */
const ProFormDateTimePicker: React.FC<
  ProFormFieldItemProps<DatePickerProps> & { ref?: React.Ref<any> }
> = ({ fieldProps, proFieldProps, ref, ...rest }) => {
  return (
    <BaseDatePicker
      ref={ref}
      valueType={valueType}
      proFieldProps={proFieldProps}
      fieldConfig={{
        valueType,
        customLightMode: true,
      }}
      fieldProps={fieldProps}
      {...rest}
    />
  );
};

export default ProFormDateTimePicker;
