import { DefaultFooter, PageContainer, ProLayout } from '@xxlabs/pro-components';

import defaultProps from './_defaultProps';

const Demo = () => (
  <ProLayout
    {...defaultProps}
    style={{
      height: '100vh',
    }}
    breakpoint={false}
    collapsed
    location={{
      pathname: '/welcome',
    }}
    footerRender={() => (
      <DefaultFooter
        links={[
          {
            key: 'procomponents',
            title: 'ProComponents',
            href: 'https://suxiuxing.github.io/pro-components/',
          },
          {
            key: 'antd',
            title: 'Ant Design',
            href: 'https://ant.design/',
          },
        ]}
        copyright="ProComponents 页脚示例"
      />
    )}
  >
    <PageContainer content="欢迎使用">Hello World</PageContainer>
  </ProLayout>
);

export default () => (
  <div style={{ padding: 24 }}>
    <Demo />
  </div>
);
