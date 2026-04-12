# @xxlabs/pro-components

本项目基于 [ant-design/pro-components](https://github.com/ant-design/pro-components) 实现，在继承其企业级组件能力的基础上，面向当前前端开发环境进行持续整理、重构与演进。

## 项目定位

- 以原项目能力为基础，延续其在企业级组件领域的成熟设计与使用经验。
- 相比原项目，本项目会主动抛弃历史负债，不再以兼容历史包袱为首要目标。
- 在技术选型上，本项目将优先选择更前沿、也更符合当前主流开发环境的技术栈与工程方案，以提升开发效率、可维护性和后续演进空间。

## 与原项目的差异

- 本项目基于上游仓库继续演进，但不以保留所有历史设计和兼容策略为目标。
- 在必要场景下，会为了简化实现和提升可维护性，对部分 API、内部结构或默认行为进行调整。
- 迁移成本会被纳入考虑，但不会为了兼容历史包袱而牺牲整体工程质量。

## 安装

```bash
pnpm add @xxlabs/pro-components antd react react-dom
```

## 快速开始

```tsx
import { ProTable } from '@xxlabs/pro-components';
import { Tag } from 'antd';

const dataSource = [{ id: 1, name: '示例记录', status: 'online' }];

export default function Demo() {
  return (
    <ProTable
      rowKey="id"
      search={false}
      options={false}
      pagination={false}
      dataSource={dataSource}
      columns={[
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: '状态',
          dataIndex: 'status',
          render: (_, record) => <Tag color="success">{record.status}</Tag>,
        },
      ]}
    />
  );
}
```

## 演进方向

- 持续清理历史兼容层与冗余实现，降低维护成本。
- 优先推进构建、测试、文档和类型系统的现代化。
- 在保证核心组件能力的前提下，逐步收敛 API 和内部实现复杂度。
- 让组件库能力、文档站点和开发体验保持同步演进。

## 相关链接

- 原项目仓库：[ant-design/pro-components](https://github.com/ant-design/pro-components)
- 当前项目仓库：[suxiuxing/pro-components](https://github.com/suxiuxing/pro-components)
- 文档地址：[https://suxiuxing.github.io/pro-components/](https://suxiuxing.github.io/pro-components/)

## 许可证

本项目采用 [MIT](./LICENSE.md) 协议。
