import type { FC } from 'react';

import { PageHeader } from '@xxlabs/pro-components';

const items = [
  {
    path: 'index',
    title: 'First-level Menu',
  },
  {
    path: 'first',
    title: 'Second-level Menu',
  },
  {
    path: 'second',
    title: 'Third-level Menu',
  },
];

const App: FC = () => (
  <PageHeader
    className="site-page-header"
    title="Title"
    breadcrumb={{ items }}
    subTitle="This is a subtitle"
  />
);

export default () => (
  <div style={{ padding: 24 }}>
    <App />
  </div>
);
