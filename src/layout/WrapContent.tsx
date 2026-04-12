import { Layout } from 'antd';
import { clsx } from 'clsx';
import type { CSSProperties, FC, ReactNode } from 'react';
import { useContext } from 'react';

import { ProProvider } from '../provider';
import { ErrorBoundary } from '../utils';

const WrapContent: FC<{
  hasPageContainer?: number;
  isChildrenLayout?: boolean;
  prefixCls?: string;
  style?: CSSProperties;
  location?: any;
  contentHeight?: number | string;
  ErrorBoundary?: any;
  children?: ReactNode;
  hasHeader: boolean;
}> = (props) => {
  const { hashId } = useContext(ProProvider);
  const { style, prefixCls, children, hasPageContainer = 0 } = props;

  const contentClassName = clsx(`${prefixCls}-content`, hashId, {
    [`${prefixCls}-has-header`]: props.hasHeader,
    [`${prefixCls}-content-has-page-container`]: hasPageContainer > 0,
  });

  const ErrorComponent = props.ErrorBoundary || ErrorBoundary;
  return props.ErrorBoundary === false ? (
    <Layout.Content
      className={contentClassName}
      style={style}
      data-testid="pro-layout-content"
    >
      {children}
    </Layout.Content>
  ) : (
    <ErrorComponent>
      <Layout.Content
        className={contentClassName}
        style={style}
        data-testid="pro-layout-content"
      >
        {children}
      </Layout.Content>
    </ErrorComponent>
  );
};

export { WrapContent };
