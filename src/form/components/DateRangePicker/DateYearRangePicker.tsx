import type { RangePickerProps } from 'antd/es/date-picker';
import React from 'react';

import { dateArrayFormatter } from '../../../utils';
import type { ProFormFieldItemProps } from '../../typing';
import { BaseDateRanger } from './BaseDateRanger';

const valueType = 'dateYearRange' as const;

/**
 * 季度份区间选择组件
 *
 * @param
 */
export const ProFormDateYearRangePicker: React.FC<
  ProFormFieldItemProps<RangePickerProps> & { ref?: React.Ref<any> }
> = ({ fieldProps, proFieldProps, ref, ...rest }) => {
  return (
    <BaseDateRanger
      ref={ref}
      fieldProps={{
        ...fieldProps,
      }}
      valueType={valueType}
      proFieldProps={proFieldProps}
      fieldConfig={{
        valueType,
        customLightMode: true,
        lightFilterLabelFormatter: (value) =>
          dateArrayFormatter(value, fieldProps?.format || 'YYYY-MM-DD'),
      }}
      {...rest}
    />
  );
};
