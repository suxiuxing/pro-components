import type { SegmentedProps } from 'antd';
import React from 'react';

import { FieldSegmented } from '../../../field';
import { ProConfigProvider } from '../../../provider';
import type { ProFormFieldItemProps, ProFormFieldRemoteProps } from '../../typing';
import ProFormField from '../Field';

/**
 * 分段控制器
 *
 * @param
 */
const ProFormSegmented = ({
  fieldProps,
  request,
  params,
  proFieldProps,
  ref,
  ...rest
}: ProFormFieldItemProps<SegmentedProps> & ProFormFieldRemoteProps & { ref?: React.Ref<any> }) => {
  return (
    <ProConfigProvider
      valueTypeMap={{
        segmented: {
          render: (text, props) => (
            <FieldSegmented
              {...props}
              text={text}
            />
          ),
          formItemRender: (text, props) => (
            <FieldSegmented
              {...props}
              text={text}
            />
          ),
        },
      }}
    >
      <ProFormField
        valueType="segmented"
        fieldProps={fieldProps}
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

const WarpProFormSegmented: React.FC<
  ProFormFieldItemProps<SegmentedProps> & ProFormFieldRemoteProps
> = ProFormSegmented;

export default WarpProFormSegmented;
