import type { CascaderProps } from 'antd';
import React, { useContext } from 'react';

import { FieldCascader } from '../../../field';
import { ProConfigProvider } from '../../../provider';
import FieldContext from '../../FieldContext';
import type { ProFormFieldItemProps, ProFormFieldRemoteProps } from '../../typing';
import ProField from '../Field';
/**
 * 级联选择框
 *
 * @param
 */
const ProFormCascader = ({
  fieldProps,
  request,
  params,
  proFieldProps,
  ref,
  ...rest
}: ProFormFieldItemProps<CascaderProps<any>> &
  ProFormFieldRemoteProps & { ref?: React.Ref<any> }) => {
  const context = useContext(FieldContext);
  return (
    <ProConfigProvider
      valueTypeMap={{
        cascader: {
          render: (text, props) => (
            <FieldCascader
              {...props}
              text={text}
              placeholder={props.placeholder as string}
            />
          ),
          formItemRender: (text, props) => (
            <FieldCascader
              {...props}
              text={text}
              placeholder={props.placeholder as string}
            />
          ),
        },
      }}
    >
      <ProField
        valueType="cascader"
        fieldProps={{
          getPopupContainer: context.getPopupContainer,
          ...fieldProps,
        }}
        ref={ref}
        request={request}
        params={params}
        fieldConfig={{ customLightMode: true }}
        proFieldProps={proFieldProps}
        {...rest}
      />
    </ProConfigProvider>
  );
};

export default ProFormCascader;
