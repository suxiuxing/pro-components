import type { RangePickerProps } from 'antd/es/date-picker';
import type { FC, Ref } from 'react';

import { dateArrayFormatter } from '../../../utils';
import type { ProFormFieldItemProps } from '../../typing';
import { BaseDateRanger } from './BaseDateRanger';

const valueType = 'dateTimeRange' as const;

/**
 * 日期时间区间选择组件
 *
 * @param
 */
export const ProFormDateTimeRangePicker: FC<
  ProFormFieldItemProps<RangePickerProps> & { ref?: Ref<any> }
> = ({ fieldProps, proFieldProps, ref, ...rest }) => {
  return (
    <BaseDateRanger
      ref={ref}
      fieldProps={fieldProps}
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
