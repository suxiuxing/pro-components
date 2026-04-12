import { Button } from 'antd';
import { useRef, useState } from 'react';

import type { ProColumns, ProFormInstance } from '@xxlabs/pro-components';
import { ProTable } from '@xxlabs/pro-components';

export type TableListItem = {
  key: number;
  name: string;
};

const columns: ProColumns<TableListItem>[] = [
  {
    title: '应用名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '部署时间',
    key: 'since',
    dataIndex: 'createdAt',
    valueType: 'date',
  },
];

const Demo = () => {
  const ref = useRef<ProFormInstance | undefined>(undefined);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ProTable<TableListItem>
      columns={columns}
      request={() =>
        Promise.resolve({
          data: [
            {
              key: 1,
              name: '用户认证服务',
              createdAt: 1705286400000,
            },
          ],
          total: 1,
          success: true,
        })
      }
      rowKey="key"
      pagination={{
        showSizeChanger: true,
      }}
      search={{
        collapsed,
        onCollapse: setCollapsed,
      }}
      formRef={ref}
      toolBarRender={() => [
        <Button
          key="set"
          onClick={() => {
            if (ref.current) {
              ref.current.setFieldsValue({
                name: '支付网关',
              });
            }
          }}
        >
          赋值
        </Button>,
        <Button
          key="submit"
          onClick={() => {
            if (ref.current) {
              ref.current.submit();
            }
          }}
        >
          提交
        </Button>,
      ]}
      options={false}
      dateFormatter="string"
      headerTitle="表单赋值"
    />
  );
};

export default () => (
  <div style={{ padding: 24 }}>
    <Demo />
  </div>
);
