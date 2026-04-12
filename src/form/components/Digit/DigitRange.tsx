import type { InputNumberProps } from 'antd';
import type { Ref } from 'react';

import { FieldDigitRange } from '../../../field';
import { ProConfigProvider } from '../../../provider';
import type { ProFormFieldItemProps } from '../../typing';
import ProFormField from '../Field';

export type Value = string | number | undefined;

export type ValuePair = Value[];

export type RangeInputNumberProps = Omit<
  InputNumberProps<number>,
  'value' | 'defaultValue' | 'onChange' | 'placeholder'
> & {
  value?: ValuePair;
  defaultValue?: ValuePair;
  onChange?: (value?: ValuePair) => void;
};

export type ProFormDigitRangeProps = ProFormFieldItemProps<RangeInputNumberProps> & {
  separator?: string;
  separatorWidth?: number;
};
/**
 * 数字范围输入组件
 *
 * @param fieldProps
 * @param proFieldProps
 * @param rest
 * @param ref
 */
const ProFormDigit = ({
  fieldProps,
  proFieldProps,
  ref,
  ...rest
}: ProFormDigitRangeProps & { ref?: Ref<any> }) => {
  return (
    <ProConfigProvider
      valueTypeMap={{
        digitRange: {
          render: (text, props) => (
            <FieldDigitRange
              {...props}
              text={text}
              placeholder={props.placeholder as string}
            />
          ),
          formItemRender: (text, props) => (
            <FieldDigitRange
              {...props}
              text={text}
              placeholder={props.placeholder as string}
            />
          ),
        },
      }}
    >
      <ProFormField
        valueType="digitRange"
        fieldProps={{
          ...fieldProps,
        }}
        ref={ref}
        fieldConfig={{
          defaultProps: {
            width: '100%',
          },
        }}
        proFieldProps={proFieldProps}
        {...rest}
      />
    </ProConfigProvider>
  );
};

export default ProFormDigit;
