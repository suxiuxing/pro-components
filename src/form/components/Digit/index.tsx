import type { InputNumberProps } from 'antd';
import type { Ref } from 'react';

import { FieldDigit } from '../../../field';
import { ProConfigProvider } from '../../../provider';
import type { ProFormFieldItemProps } from '../../typing';
import ProFormField from '../Field';

export type ProFormDigitProps = ProFormFieldItemProps<InputNumberProps<number>> & {
  min?: InputNumberProps['min'];
  max?: InputNumberProps['max'];
};
/**
 * 数字输入组件
 *
 * @param fieldProps
 * @param min
 * @param proFieldProps
 * @param max
 * @param rest
 * @param ref
 */
const ProFormDigit = ({
  fieldProps,
  min,
  proFieldProps,
  max,
  ref,
  ...rest
}: ProFormDigitProps & { ref?: Ref<any> }) => {
  return (
    <ProConfigProvider
      valueTypeMap={{
        digit: {
          render: (text, props) => (
            <FieldDigit
              {...props}
              text={text}
              placeholder={props.placeholder as string}
            />
          ),
          formItemRender: (text, props) => (
            <FieldDigit
              {...props}
              text={text}
              placeholder={props.placeholder as string}
            />
          ),
        },
      }}
    >
      <ProFormField
        valueType="digit"
        fieldProps={{
          min,
          max,
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
