import { CloseOutlined, SnippetsOutlined } from '@ant-design/icons';
import { useRef } from 'react';

import type { FormListActionType } from '@xxlabs/pro-components';
import { ProForm, ProFormList, ProFormText } from '@xxlabs/pro-components';

const Demo = () => {
  const actionRef = useRef<
    | FormListActionType<{
        name: string;
      }>
    | undefined
  >(undefined);
  return (
    <>
      <ProForm name="group-countlimit-demo">
        <ProFormList
          copyIconProps={{
            Icon: SnippetsOutlined,
          }}
          deleteIconProps={{
            Icon: CloseOutlined,
          }}
          min={1}
          max={4}
          actionRef={actionRef}
          actionGuard={{
            beforeAddRow: async () => {
              return new Promise((resolve) => {
                setTimeout(() => resolve(true), 1000);
              });
            },
            beforeRemoveRow: async (index) => {
              return new Promise((resolve) => {
                if (index === 0) {
                  resolve(false);
                  return;
                }
                setTimeout(() => resolve(true), 1000);
              });
            },
          }}
          name="users"
          label="用户信息"
          initialValue={[
            {
              name: '1111',
            },
          ]}
        >
          <ProFormText
            key="useMode"
            name="name"
            label="姓名"
          />
        </ProFormList>
      </ProForm>
    </>
  );
};

export default () => (
  <div style={{ padding: 24 }}>
    <Demo />
  </div>
);
