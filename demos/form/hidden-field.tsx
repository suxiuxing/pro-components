import {
  ProForm,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { useState } from 'react';

const Demo = () => {
  const [hidden, setHidden] = useState(true);

  return (
    <ProForm
      grid
      rowProps={{ gutter: [16, 0] }}
      onFinish={async (values) => {
        console.log('values:', values);
      }}
    >
      <ProFormSwitch
        colProps={{ span: 24 }}
        label="隐藏「公司名称」字段"
        fieldProps={{
          checked: hidden,
          onChange: setHidden,
        }}
      />
      <ProFormText
        colProps={{ md: 12 }}
        name="name"
        label="姓名"
        placeholder="请输入姓名"
      />
      <ProFormText
        colProps={{ md: 12 }}
        name="company"
        label="公司名称"
        placeholder="请输入公司名称"
        hidden={hidden}
      />
      <ProFormText
        colProps={{ md: 12 }}
        name="phone"
        label="电话"
        placeholder="请输入电话"
      />
    </ProForm>
  );
};

export default Demo;
