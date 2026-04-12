import type { TreeSelectProps } from 'antd';
import type { RefSelectProps } from 'antd/es/select';
import type { FC, Ref } from 'react';

import { FieldTreeSelect } from '../../../field';
import { ProConfigProvider } from '../../../provider';
import type { ProFormFieldItemProps, ProFormFieldRemoteProps } from '../../typing';
import ProFormField from '../Field';

export type ProFormTreeSelectProps<T = any> = ProFormFieldItemProps<
  TreeSelectProps<T> & {
    /**
     * 当搜索关键词发生变化时是否请求远程数据
     *
     * @default true
     */
    fetchDataOnSearch?: boolean;
  },
  RefSelectProps
> &
  ProFormFieldRemoteProps;

/**
 * 树选择器
 *
 * @param
 */
const ProFormTreeSelect = ({
  fieldProps,
  request,
  params,
  proFieldProps,
  ref,
  ...rest
}: ProFormTreeSelectProps<any> & { ref?: Ref<any> }) => {
  return (
    <ProConfigProvider
      valueTypeMap={{
        treeSelect: {
          render: (text, props) => (
            <FieldTreeSelect
              {...props}
              text={text}
            />
          ),
          formItemRender: (text, props) => (
            <FieldTreeSelect
              {...props}
              text={text}
            />
          ),
        },
      }}
    >
      <ProFormField
        valueType="treeSelect"
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

const WarpProFormTreeSelect: FC<ProFormTreeSelectProps> = ProFormTreeSelect;

export default WarpProFormTreeSelect;
