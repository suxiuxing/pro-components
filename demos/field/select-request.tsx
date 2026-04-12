import { ProForm, ProFormSelect } from '@xxlabs/pro-components';

function App() {
  return (
    <div className="App">
      <ProForm>
        <ProFormSelect
          showSearch
          name="select"
          request={async () => [{ label: '选项1', value: '1' }]}
        />
      </ProForm>
      <ProForm>
        <ProFormSelect
          showSearch
          name="select"
          request={async () => [{ label: '选项2', value: '2' }]}
        />
      </ProForm>
    </div>
  );
}

export default () => (
  <div style={{ padding: 24 }}>
    <App />
  </div>
);
