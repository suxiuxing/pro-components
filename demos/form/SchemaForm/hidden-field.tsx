import type { ProFormColumnsType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { useState } from 'react';

type DataItem = {
  name: string;
  company: string;
  phone: string;
};

const Demo = () => {
  const [hidden, setHidden] = useState(true);

  const columns: ProFormColumnsType<DataItem>[] = [
    {
      title: '隐藏「公司名称」字段',
      dataIndex: 'hiddenSwitch',
      valueType: 'switch',
      colProps: { span: 24 },
      fieldProps: {
        checked: hidden,
        onChange: setHidden,
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      colProps: { md: 12 },
    },
    {
      title: '公司名称',
      dataIndex: 'company',
      colProps: { md: 12 },
      formItemProps: {
        hidden,
      },
    },
    {
      title: '电话',
      dataIndex: 'phone',
      colProps: { md: 12 },
    },
  ];

  return (
    <BetaSchemaForm<DataItem>
      grid
      rowProps={{ gutter: [16, 0] }}
      columns={columns}
      onFinish={async (values) => {
        console.log('values:', values);
      }}
    />
  );
};

export default Demo;
