import { Badge, Space } from 'antd';
import type { CSSProperties, FC, ReactNode } from 'react';
import { Fragment } from 'react';

import { ProFieldValueEnumType, ProSchemaValueEnumMap } from '../typing';

/**
 * 获取类型的 type
 *
 * @param obj
 */
function getType(obj: any) {
  // @ts-ignore
  const type = Object.prototype.toString
    .call(obj)
    .match(/^\[object (.*)\]$/)[1]
    .toLowerCase();
  if (type === 'string' && typeof obj === 'object') return 'object'; // Let "new String('')" return 'object'
  if (obj === null) return 'null'; // PhantomJS has type "DOMWindow" for null
  if (obj === undefined) return 'undefined'; // PhantomJS has type "DOMWindow" for undefined
  return type;
}

type StatusProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export const ProFieldBadgeColor: FC<StatusProps & { color: string }> = ({ color, children }) => (
  <Badge
    color={color}
    text={children}
  />
);

export const objectToMap = (value: ProFieldValueEnumType | undefined): ProSchemaValueEnumMap => {
  if (getType(value) === 'map') {
    return value as ProSchemaValueEnumMap;
  }
  return new Map(Object.entries(value || {}));
};

const TableStatus: {
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

type ProFieldStatusType =
  | 'success'
  | 'warning'
  | 'error'
  | 'default'
  | 'processing'
  | 'Success'
  | 'Error'
  | 'Processing'
  | 'Default'
  | 'Warning';

/**
 * 转化 text 和 valueEnum 通过 type 来添加 Status
 *
 * @param text
 * @param valueEnumParams
 * @param key
 */
export const proFieldParsingText = (
  text: string | number | (string | number)[],
  valueEnumParams: ProFieldValueEnumType,
  key?: number | string,
): ReactNode => {
  if (Array.isArray(text)) {
    return (
      <Space
        key={key}
        separator=","
        size={2}
        wrap
      >
        {text.map((value, index) => proFieldParsingText(value, valueEnumParams, index))}
      </Space>
    );
  }

  const valueEnum = objectToMap(valueEnumParams);

  if (!valueEnum.has(text) && !valueEnum.has(`${text}`)) {
    // @ts-ignore
    return text?.label || text;
  }

  const domText = (valueEnum.get(text) || valueEnum.get(`${text}`)) as {
    text: ReactNode;
    status: ProFieldStatusType;
    color?: string;
  };

  if (!domText) {
    // @ts-ignore
    return <Fragment key={key}>{text?.label || text}</Fragment>;
  }

  const { status, color } = domText;

  const Status = TableStatus[status || 'Init'];

  // 如果类型存在优先使用类型
  if (Status) {
    return <Status key={key}>{domText.text}</Status>;
  }

  // 如果不存在使用颜色
  if (color) {
    return (
      <ProFieldBadgeColor
        key={key}
        color={color}
      >
        {domText.text}
      </ProFieldBadgeColor>
    );
  }
  // 什么都没有使用 text
  return <Fragment key={key}>{domText.text || (domText as any as ReactNode)}</Fragment>;
};
