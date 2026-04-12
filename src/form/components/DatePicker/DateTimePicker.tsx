import type { DatePickerProps } from 'antd';
import type { FC, Ref } from 'react';

import type { ProFormFieldItemProps } from '../../typing';
import { BaseDatePicker } from './BaseDatePicker';

const valueType = 'dateTime' as const;

/**
 * 时间日期选择组件
 *
 * @param
 */
const ProFormDateTimePicker: FC<ProFormFieldItemProps<DatePickerProps> & { ref?: Ref<any> }> = ({
  fieldProps,
  proFieldProps,
  ref,
  ...rest
}) => {
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
