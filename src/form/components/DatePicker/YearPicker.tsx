import type { DatePickerProps } from 'antd';
import type { FC, Ref } from 'react';

import type { ProFormFieldItemProps } from '../../typing';
import { BaseDatePicker } from './BaseDatePicker';

const valueType = 'dateYear' as const;
/**
 * 周选择组件
 *
 * @param
 */
const ProFormDatePickerYear: FC<ProFormFieldItemProps<DatePickerProps> & { ref?: Ref<any> }> = ({
  proFieldProps,
  fieldProps,
  ref,
  ...rest
}) => {
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

export default ProFormDatePickerYear;
