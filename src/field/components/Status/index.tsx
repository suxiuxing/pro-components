import { Badge } from 'antd';
import type { CSSProperties, FC, ReactNode } from 'react';

type StatusProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/** 快捷操作，用于快速的展示一个状态 */
export const StatusComponents: {
  Success: FC<StatusProps>;
  Error: FC<StatusProps>;
  Processing: FC<StatusProps>;
  Default: FC<StatusProps>;
  Warning: FC<StatusProps>;
  success: FC<StatusProps>;
  error: FC<StatusProps>;
  processing: FC<StatusProps>;
  default: FC<StatusProps>;
  warning: FC<StatusProps>;
} = {
  Success: ({ children }) => (
    <Badge
      status="success"
      text={children}
    />
  ),
  Error: ({ children }) => (
    <Badge
      status="error"
      text={children}
    />
  ),
  Default: ({ children }) => (
    <Badge
      status="default"
      text={children}
    />
  ),
  Processing: ({ children }) => (
    <Badge
      status="processing"
      text={children}
    />
  ),
  Warning: ({ children }) => (
    <Badge
      status="warning"
      text={children}
    />
  ),
  success: ({ children }) => (
    <Badge
      status="success"
      text={children}
    />
  ),
  error: ({ children }) => (
    <Badge
      status="error"
      text={children}
    />
  ),
  default: ({ children }) => (
    <Badge
      status="default"
      text={children}
    />
  ),
  processing: ({ children }) => (
    <Badge
      status="processing"
      text={children}
    />
  ),
  warning: ({ children }) => (
    <Badge
      status="warning"
      text={children}
    />
  ),
};

export type ProFieldStatusType = keyof typeof StatusComponents;

export const ProFieldBadgeColor: FC<StatusProps & { color: string }> = ({ color, children }) => (
  <Badge
    color={color}
    text={children}
  />
);

export default StatusComponents;
