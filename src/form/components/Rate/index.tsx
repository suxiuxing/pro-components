import type { RateProps } from 'antd';
import type { Ref } from 'react';

import { FieldRate } from '../../../field';
import { ProConfigProvider } from '../../../provider';
import type { ProFormFieldItemProps } from '../../typing';
import ProField from '../Field';
/**
 * 评分组件
 *
 * @param
 */
const ProFormRate = ({
  fieldProps,
  proFieldProps,
  ref,
  ...rest
}: ProFormFieldItemProps<RateProps> & { ref?: Ref<any> }) => {
  return (
    <ProConfigProvider
      valueTypeMap={{
        rate: {
          render: (text, props) => (
            <FieldRate
              {...props}
              text={text}
            />
          ),
          formItemRender: (text, props) => (
            <FieldRate
              {...props}
              text={text}
            />
          ),
        },
      }}
    >
      <ProField
        valueType="rate"
        fieldProps={fieldProps}
        ref={ref}
        proFieldProps={proFieldProps}
        fieldConfig={{
          ignoreWidth: true,
        }}
        {...rest}
      />
    </ProConfigProvider>
  );
};

export default ProFormRate;
