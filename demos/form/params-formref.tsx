import { useEffect, useRef, useState } from 'react';

import { BetaSchemaForm } from '@xxlabs/pro-components';

const Demo = () => {
  const targetRef = useRef();

  const [requestLibData, setRequestLibData] = useState(0);
  useEffect(() => {
    // 更新requestLibData，并引发reRender
    setTimeout(() => {
      setRequestLibData(1);
    });
  }, []);
  return (
    <BetaSchemaForm
      name="params-formref-demo"
      request={async () => ({})}
      params={{ requestLibData }}
      columns={[
        {
          title: 'money',
          dataIndex: 'money',
          valueType: 'money',
        },
      ]}
      formRef={targetRef}
    />
  );
};

export default () => (
  <div style={{ padding: 24 }}>
    <Demo />
  </div>
);
