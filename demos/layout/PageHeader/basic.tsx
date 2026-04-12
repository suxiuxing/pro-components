import React from 'react';

import { PageHeader } from '@xxlabs/pro-components';

const App: React.FC = () => (
  <PageHeader
    className="site-page-header"
    onBack={() => null}
    title="Title"
    subTitle="This is a subtitle"
  />
);

export default () => (
  <div style={{ padding: 24 }}>
    <App />
  </div>
);
