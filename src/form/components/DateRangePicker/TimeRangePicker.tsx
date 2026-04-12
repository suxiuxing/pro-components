import type { RangePickerProps } from 'antd/es/date-picker';
import type { FC, Ref } from 'react';
import { useContext } from 'react';

import { FieldTimeRangePicker } from '../../../field';
import { ProConfigProvider } from '../../../provider';
import { dateArrayFormatter } from '../../../utils';
import FieldContext from '../../FieldContext';
import type { ProFormFieldItemProps } from '../../typing';
import ProField from '../Field';

const valueType = 'timeRange' as const;

/** 时间区间选择器 */
export const ProFormTimeRangePicker: FC<
  ProFormFieldItemProps<RangePickerProps> & { ref?: Ref<any> }
> = ({ fieldProps, proFieldProps, ref, ...rest }: any) => {
  const context = useContext(FieldContext);
  return (
    <ProConfigProvider
      valueTypeMap={{
        [valueType]: {
          render: (text, props) => (
            <FieldTimeRangePicker
              {...props}
              text={text}
            />
          ),
          formItemRender: (text, props) => (
            <FieldTimeRangePicker
              {...props}
              text={text}
            />
          ),
        },
      }}
    >
      <ProField
        ref={ref}
        fieldProps={{
          getPopupContainer: context.getPopupContainer,
          ...fieldProps,
        }}
        valueType={valueType}
        proFieldProps={proFieldProps}
        fieldConfig={
          {
            valueType,
            customLightMode: true,
            lightFilterLabelFormatter: (value) => dateArrayFormatter(value, 'HH:mm:ss'),
          } as const
        }
        {...rest}
      />
    </ProConfigProvider>
  );
};
