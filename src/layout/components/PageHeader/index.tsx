import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import ResizeObserver from '@rc-component/resize-observer';
import type { AvatarProps, BreadcrumbProps, TagType } from 'antd';
import { Avatar, Breadcrumb, ConfigProvider, Space } from 'antd';
import type { DirectionType } from 'antd/es/config-provider';
import { clsx } from 'clsx';
import type { CSSProperties, FC, MouseEvent, ReactElement, ReactNode } from 'react';
import { useContext, useState } from 'react';

import type { ContentWidth } from '../../defaultSettings';
import useStyle from './style';

export interface PageHeaderProps {
  backIcon?: ReactNode;
  prefixCls?: string;
  title?: ReactNode;
  subTitle?: ReactNode;
  style?: CSSProperties;
  childrenContentStyle?: CSSProperties;
  breadcrumb?: Partial<BreadcrumbProps> | ReactElement<typeof Breadcrumb>;
  breadcrumbRender?: (props: PageHeaderProps, defaultDom: ReactNode) => ReactNode;
  tags?: ReactElement<TagType> | ReactElement<TagType>[];
  footer?: ReactNode;
  extra?: ReactNode;
  avatar?: AvatarProps;
  onBack?: (e?: MouseEvent<HTMLElement>) => void;
  className?: string;
  contentWidth?: ContentWidth;
  layout?: string;
  ghost?: boolean;
  children?: ReactNode;
}

const renderBack = (
  prefixCls: string,
  hashId: string,
  backIcon?: ReactNode,
  onBack?: (e?: MouseEvent<HTMLElement>) => void,
) => {
  if (!backIcon || !onBack) {
    return null;
  }
  return (
    <div className={clsx(`${prefixCls}-back`, hashId)}>
      <div
        role="button"
        onClick={(e) => {
          onBack?.(e);
        }}
        className={clsx(`${prefixCls}-back-button`, hashId)}
        aria-label="back"
      >
        {backIcon}
      </div>
    </div>
  );
};

const renderBreadcrumb = (breadcrumb: BreadcrumbProps, prefixCls: string) => {
  if (!breadcrumb.items?.length) return null;
  return (
    <Breadcrumb
      {...breadcrumb}
      className={clsx(`${prefixCls}-breadcrumb`, breadcrumb.className)}
    />
  );
};

const getBackIcon = (props: PageHeaderProps, direction: DirectionType = 'ltr') => {
  if (props.backIcon !== undefined) {
    return props.backIcon;
  }
  return direction === 'rtl' ? <ArrowRightOutlined /> : <ArrowLeftOutlined />;
};

const renderTitle = (
  prefixCls: string,
  props: PageHeaderProps,
  direction: DirectionType = 'ltr',
  hashId: string,
) => {
  const { title, avatar, subTitle, tags, extra, onBack } = props;
  const headingPrefixCls = `${prefixCls}-heading`;
  const hasHeading = title || subTitle || tags || extra;
  // If there is nothing, return a null
  if (!hasHeading) {
    return null;
  }
  const backIcon = getBackIcon(props, direction);
  const backIconDom = renderBack(prefixCls, hashId, backIcon, onBack);
  const hasTitle = backIconDom || avatar || hasHeading;
  return (
    <div className={clsx(headingPrefixCls, hashId)}>
      {hasTitle && (
        <div className={clsx(`${headingPrefixCls}-left`, hashId)}>
          {backIconDom}
          {avatar && (
            <Avatar
              className={clsx(`${headingPrefixCls}-avatar`, hashId, avatar.className)}
              {...avatar}
            />
          )}
          {title && (
            <span
              className={clsx(`${headingPrefixCls}-title`, hashId)}
              title={typeof title === 'string' ? title : undefined}
            >
              {title}
            </span>
          )}
          {subTitle && (
            <span
              className={clsx(`${headingPrefixCls}-sub-title`, hashId)}
              title={typeof subTitle === 'string' ? subTitle : undefined}
            >
              {subTitle}
            </span>
          )}
          {tags && <span className={clsx(`${headingPrefixCls}-tags`, hashId)}>{tags}</span>}
        </div>
      )}
      {extra && (
        <span className={clsx(`${headingPrefixCls}-extra`, hashId)}>
          <Space>{extra}</Space>
        </span>
      )}
    </div>
  );
};

const renderFooter = (prefixCls: string, footer: ReactNode, hashId: string) => {
  if (footer) {
    return <div className={clsx(`${prefixCls}-footer`, hashId)}>{footer}</div>;
  }
  return null;
};

const renderChildren = (prefixCls: string, children: ReactNode, hashId: string) => (
  <div className={clsx(`${prefixCls}-content`, hashId)}>{children}</div>
);

const PageHeader: FC<PageHeaderProps> = (props) => {
  const [compact, updateCompact] = useState<boolean>(false);

  const onResize = ({ width }: { width: number }) => updateCompact(width < 768);

  const { getPrefixCls, direction } = useContext(ConfigProvider.ConfigContext);

  const {
    prefixCls: customizePrefixCls,
    style,
    footer,
    children,
    breadcrumb,
    breadcrumbRender,
    className: customizeClassName,
    contentWidth,
    layout,
    ghost = true,
  } = props;

  const prefixCls = getPrefixCls('page-header', customizePrefixCls);
  const { wrapSSR, hashId } = useStyle(prefixCls);

  const getDefaultBreadcrumbDom = () => {
    if ((breadcrumb as BreadcrumbProps)?.items) {
      return renderBreadcrumb(breadcrumb as BreadcrumbProps, prefixCls);
    }
    return null;
  };

  const defaultBreadcrumbDom = getDefaultBreadcrumbDom();

  const isBreadcrumbComponent = breadcrumb && 'props' in breadcrumb;

  // support breadcrumbRender function
  const breadcrumbRenderDomFromProps =
    breadcrumbRender?.({ ...props, prefixCls }, defaultBreadcrumbDom) ?? defaultBreadcrumbDom;

  // 如果 breadcrumbRender 返回的是数组，需要转换为 Breadcrumb 组件
  // 如果返回的是 React.ReactNode，直接使用
  const breadcrumbDom = isBreadcrumbComponent
    ? breadcrumb
    : Array.isArray(breadcrumbRenderDomFromProps)
      ? renderBreadcrumb({ items: breadcrumbRenderDomFromProps }, prefixCls)
      : breadcrumbRenderDomFromProps;

  const className = clsx(prefixCls, hashId, customizeClassName, {
    [`${prefixCls}-has-breadcrumb`]: !!breadcrumbDom,
    [`${prefixCls}-has-footer`]: !!footer,
    [`${prefixCls}-rtl`]: direction === 'rtl',
    [`${prefixCls}-compact`]: compact,
    [`${prefixCls}-wide`]: contentWidth === 'Fixed' && layout == 'top',
    [`${prefixCls}-ghost`]: ghost,
  });
  const title = renderTitle(prefixCls, props, direction, hashId);
  const childDom = children && renderChildren(prefixCls, children, hashId);
  const footerDom = renderFooter(prefixCls, footer, hashId);

  if (!breadcrumbDom && !title && !footerDom && !childDom) {
    return <div className={clsx(hashId, [`${prefixCls}-no-children`])} />;
  }

  return wrapSSR(
    <ResizeObserver onResize={onResize}>
      {(ref) => (
        <div
          ref={ref}
          className={className}
          style={style}
          data-testid="pro-page-header"
        >
          {breadcrumbDom}
          {title}
          {childDom}
          {footerDom}
        </div>
      )}
    </ResizeObserver>,
  );
};

export { PageHeader };
