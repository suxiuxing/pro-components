/**
 * 内部 List 容器与 List.Item / List.Item.Meta 实现，用于替代 antd List（antd List 已停止维护）
 * 保持与 antd List 相同的 DOM 结构及类名，以便复用 antd 的 list 样式
 */
import { ConfigProvider, Empty, Grid, Pagination, Spin } from 'antd';
import type { PaginationConfig } from 'antd/es/pagination';
import { clsx } from 'clsx';
import type {
  CSSProperties,
  FC,
  HTMLAttributes,
  JSX,
  Key,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createContext, Fragment, useContext, useMemo, useState } from 'react';

export type ColumnCount = number;
export type ColumnType = 'gutter' | 'column' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export interface ListGridType {
  gutter?: number | [number, number];
  column?: ColumnCount;
  xs?: ColumnCount;
  sm?: ColumnCount;
  md?: ColumnCount;
  lg?: ColumnCount;
  xl?: ColumnCount;
  xxl?: ColumnCount;
}
export type ListSize = 'small' | 'default' | 'large';
export type ListItemLayout = 'horizontal' | 'vertical';
export interface ListLocale {
  emptyText?: ReactNode;
}
export interface ListProps<T = any> {
  variant?: 'outlined' | 'borderless' | 'filled';
  className?: string;
  rootClassName?: string;
  style?: CSSProperties;
  children?: ReactNode;
  dataSource?: T[];
  extra?: ReactNode;
  grid?: ListGridType;
  id?: string;
  itemLayout?: ListItemLayout;
  loading?: boolean | { spinning?: boolean };
  loadMore?: ReactNode;
  pagination?: PaginationConfig | false;
  prefixCls?: string;
  rowKey?: ((item: T) => Key) | keyof T;
  renderItem?: (item: T, index: number, defaultDom: JSX.Element | null) => ReactNode;
  size?: ListSize;
  split?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  locale?: ListLocale;
  hashId?: string;
}

export const ProListContext = createContext<{
  grid?: ListGridType;
  itemLayout?: ListItemLayout;
}>({});

export interface ListItemMetaProps {
  avatar?: ReactNode;
  className?: string;
  children?: ReactNode;
  description?: ReactNode;
  prefixCls?: string;
  style?: CSSProperties;
  title?: ReactNode;
}

export const ProListItemMeta: FC<ListItemMetaProps> = ({
  prefixCls: customizePrefixCls,
  className,
  avatar,
  title,
  description,
  ...rest
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('pro-list', customizePrefixCls);
  const classString = clsx(`${prefixCls}-item-meta`, className);
  const content =
    title || description ? (
      <div className={`${prefixCls}-item-meta-content`}>
        {title && <h4 className={`${prefixCls}-item-meta-title`}>{title}</h4>}
        {description && <div className={`${prefixCls}-item-meta-description`}>{description}</div>}
      </div>
    ) : null;
  return (
    <div
      {...rest}
      className={classString}
    >
      {avatar && <div className={`${prefixCls}-item-meta-avatar`}>{avatar}</div>}
      {content}
    </div>
  );
};

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
  prefixCls?: string;
  style?: CSSProperties;
  extra?: ReactNode;
  actions?: ReactNode[];
}

const InternalProListItem = ({ ref, ...props }: ListItemProps & { ref?: Ref<HTMLDivElement> }) => {
  const { prefixCls: customizePrefixCls, children, actions, extra, className, ...rest } = props;
  const { grid, itemLayout } = useContext(ProListContext);
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('pro-list', customizePrefixCls);

  const actionsContent =
    actions && actions.length > 0 ? (
      <div
        key="actions"
        className={`${prefixCls}-item-action`}
        onClick={(e) => e.stopPropagation()}
      >
        {actions.map((action, i) => (
          <div
            key={i}
            className={`${prefixCls}-item-action-item`}
          >
            {action}
          </div>
        ))}
      </div>
    ) : null;

  const isVerticalWithExtra = itemLayout === 'vertical' && extra != null;

  const extraContent =
    extra != null ? (
      <div
        className={`${prefixCls}-item-extra`}
        key="extra"
      >
        {extra}
      </div>
    ) : null;

  const mainContent = (
    <div
      className={`${prefixCls}-item-main`}
      key="main"
    >
      {children}
      {actionsContent}
      {!isVerticalWithExtra && extraContent}
    </div>
  );

  const itemChildren = (
    <div
      ref={ref}
      {...(rest as HTMLAttributes<HTMLElement>)}
      className={clsx(`${prefixCls}-item`, className)}
    >
      {mainContent}
      {isVerticalWithExtra && extraContent}
    </div>
  );

  if (grid) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>{itemChildren}</div>
    );
  }
  return itemChildren as ReactElement;
};
InternalProListItem.displayName = 'ProListItem';

export const ProListItem = InternalProListItem as typeof InternalProListItem & {
  Meta: typeof ProListItemMeta;
};
ProListItem.Meta = ProListItemMeta;

function getRowKey<T>(item: T, index: number, rowKey?: ListProps<T>['rowKey']): Key {
  if (typeof rowKey === 'function') {
    return rowKey(item);
  }
  if (rowKey && typeof item === 'object' && item !== null && rowKey in item) {
    return (item as Record<string, unknown>)[rowKey as string] as Key;
  }
  if (typeof item === 'object' && item !== null && 'key' in item) {
    return (item as { key?: Key }).key as Key;
  }
  return `list-item-${index}`;
}

const defaultPaginationProps = {
  current: 1,
  total: 0,
  position: 'bottom' as const,
};

const DEFAULT_SCREENS = {
  xs: true,
  sm: true,
  md: true,
  lg: false,
  xl: false,
  xxl: false,
} as const;

const ProListContainerInner = function ProListContainerInner(
  props: ListProps & { ref?: Ref<HTMLDivElement> },
) {
  const { ref } = props;
  const {
    pagination = false,
    prefixCls: customizePrefixCls,
    variant = 'borderless',
    split = true,
    className,
    rootClassName,
    style,
    children,
    itemLayout,
    loadMore,
    grid,
    dataSource = [],
    size: customizeSize = 'default',
    header,
    footer,
    loading = false,
    rowKey,
    renderItem,
    locale,
    hashId: propHashId,
    ...rest
  } = props;

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('pro-list', customizePrefixCls);

  const paginationObj = pagination && typeof pagination === 'object' ? pagination : {};
  const [paginationCurrent, setPaginationCurrent] = useState(paginationObj.defaultCurrent ?? 1);
  const [paginationSize, setPaginationSize] = useState(paginationObj.defaultPageSize ?? 10);

  const sizeCls = customizeSize === 'large' ? 'lg' : customizeSize === 'small' ? 'sm' : '';
  const isSomethingAfterLastItem = !!(loadMore || pagination || footer);

  const paginationProps = useMemo(
    () => ({
      ...defaultPaginationProps,
      total: dataSource.length,
      current: paginationCurrent,
      pageSize: paginationSize,
      ...(pagination && typeof pagination === 'object' ? pagination : {}),
    }),
    [dataSource.length, pagination, paginationCurrent, paginationSize],
  );
  const largestPage = Math.ceil(paginationProps.total / (paginationProps.pageSize || 10));
  const currentPage = Math.min(paginationProps.current ?? 1, Math.max(1, largestPage));

  const splitDataSource = useMemo(() => {
    if (!pagination || !dataSource.length) {
      return dataSource;
    }
    const pageSize = paginationProps.pageSize ?? 10;
    const total = paginationProps.total ?? 0;
    // 父组件已分页（如 ListView 传入 pageData）时不再二次 slice
    if (total > 0 && dataSource.length <= pageSize && total > dataSource.length) {
      return dataSource;
    }
    const start = (currentPage - 1) * pageSize;
    return dataSource.slice(start, start + pageSize);
  }, [dataSource, pagination, currentPage, paginationProps.pageSize, paginationProps.total]);

  const renderInternalItem = (item: any, index: number) => {
    if (!renderItem) return null;
    const key = getRowKey(item, index, rowKey);
    return <Fragment key={key}>{renderItem(item, index, null)}</Fragment>;
  };

  const rawScreens = Grid.useBreakpoint();
  const screens = useMemo(() => {
    if (rawScreens == null) return DEFAULT_SCREENS;
    return {
      xxl: rawScreens.xxl ?? DEFAULT_SCREENS.xxl,
      xl: rawScreens.xl ?? DEFAULT_SCREENS.xl,
      lg: rawScreens.lg ?? DEFAULT_SCREENS.lg,
      md: rawScreens.md ?? DEFAULT_SCREENS.md,
      sm: rawScreens.sm ?? DEFAULT_SCREENS.sm,
      xs: rawScreens.xs ?? DEFAULT_SCREENS.xs,
    };
  }, [rawScreens]);

  /**
   * 根据当前断点获取列数，与 antd Grid/Card 响应式逻辑一致
   */
  const getResponsiveColumn = useMemo((): number => {
    if (!grid) return 1;

    const responsiveArray: Array<'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'> = [
      'xxl',
      'xl',
      'lg',
      'md',
      'sm',
      'xs',
    ];

    for (let i = 0; i < responsiveArray.length; i += 1) {
      const breakpoint = responsiveArray[i];
      if (screens[breakpoint] && grid[breakpoint] !== undefined) {
        return grid[breakpoint] as number;
      }
    }

    return (grid.column as number) || 1;
  }, [grid, screens]);

  /**
   * 计算 grid 容器样式（flex 布局）
   */
  const gridContainerStyle = useMemo(() => {
    if (!grid) return undefined;

    const style: CSSProperties = {
      display: 'flex',
      flexWrap: 'wrap',
    };

    if (grid.gutter) {
      const [horizontal, vertical] = Array.isArray(grid.gutter)
        ? grid.gutter
        : [grid.gutter, grid.gutter];
      const h = Number(horizontal) || 0;
      const v = Number(vertical) || 0;

      style.marginInline = `${-h / 2}px`;
      style.marginBlock = `${-v / 2}px`;
    }

    return style;
  }, [grid?.gutter]);

  /**
   * 计算每个 item 的样式（flex 子项）
   */
  const colStyle = useMemo(() => {
    if (!grid) return undefined;

    const { gutter } = grid;
    const column = getResponsiveColumn;

    const style: CSSProperties = {
      display: 'flex',
    };

    if (gutter) {
      const [horizontal, vertical] = Array.isArray(gutter) ? gutter : [gutter, gutter];
      const h = Number(horizontal) || 0;
      const v = Number(vertical) || 0;

      style.paddingInline = `${h / 2}px`;
      style.paddingBlock = `${v / 2}px`;
    }

    // 计算每列的宽度（确保 column 有效，避免除以零）
    if (column > 0) {
      // 使用 flex-basis 和 max-width 确保准确的宽度
      const percentage = 100 / column;
      style.flexBasis = `${percentage}%`;
      style.maxWidth = `${percentage}%`;
    }

    return style;
  }, [grid?.gutter, getResponsiveColumn]);

  const { renderEmpty } = useContext(ConfigProvider.ConfigContext);
  let childrenContent: ReactNode;
  const isLoading = typeof loading === 'boolean' ? loading : !!loading?.spinning;

  if (splitDataSource.length > 0) {
    const items = splitDataSource.map((item, idx) => renderInternalItem(item, idx));
    childrenContent = grid ? (
      <div
        className={`${prefixCls}-grid-container`}
        style={gridContainerStyle}
      >
        {items.map((child, idx) => (
          <div
            key={child?.key ?? idx}
            className={`${prefixCls}-grid-col`}
            style={colStyle}
          >
            {child}
          </div>
        ))}
      </div>
    ) : (
      items
    );
  } else if (!children) {
    const emptyContent = locale?.emptyText ??
      (typeof renderEmpty === 'function' ? renderEmpty('List') : null) ?? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      );
    childrenContent = <div className={`${prefixCls}-empty-text`}>{emptyContent}</div>;
  } else {
    childrenContent = children;
  }

  const paginationPosition = paginationProps.position ?? 'bottom';
  const showPaginationTop =
    pagination && (paginationPosition === 'top' || paginationPosition === 'both');
  const showPaginationBottom =
    pagination && (paginationPosition === 'bottom' || paginationPosition === 'both');

  const paginationNode = pagination && (
    <div className={`${prefixCls}-pagination`}>
      <Pagination
        align="end"
        {...paginationProps}
        current={currentPage}
        onChange={(page, pageSize) => {
          setPaginationCurrent(page);
          setPaginationSize(pageSize ?? 10);
          pagination?.onChange?.(page, pageSize ?? 10);
        }}
        onShowSizeChange={(current, size) => {
          setPaginationCurrent(current);
          setPaginationSize(size);
          pagination?.onShowSizeChange?.(current, size);
        }}
      />
    </div>
  );

  const contextValue = useMemo(() => ({ grid, itemLayout }), [JSON.stringify(grid), itemLayout]);

  const classString = clsx(
    prefixCls,
    {
      [`${prefixCls}-vertical`]: itemLayout === 'vertical',
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-split`]: split,
      [`${prefixCls}-${variant}`]: variant,
      [`${prefixCls}-loading`]: isLoading,
      [`${prefixCls}-grid`]: !!grid,
      [`${prefixCls}-something-after-last-item`]: isSomethingAfterLastItem,
    },
    propHashId,
    className,
    rootClassName,
  );
  return (
    <ProListContext.Provider value={contextValue}>
      <div
        ref={ref}
        style={style}
        className={classString}
        data-testid="pro-list-view"
        {...rest}
      >
        <Spin spinning={isLoading}>
          {showPaginationTop && paginationNode}
          {header && <div className={`${prefixCls}-header`}>{header}</div>}
          {childrenContent}
          {footer && <div className={`${prefixCls}-footer`}>{footer}</div>}
          {loadMore}
          {showPaginationBottom && paginationNode}
        </Spin>
      </div>
    </ProListContext.Provider>
  );
} as <T>(props: ListProps<T> & { ref?: Ref<HTMLDivElement> }) => ReactElement;

(ProListContainerInner as FC<unknown> & { displayName?: string }).displayName = 'ProListContainer';

export const ProListContainer = ProListContainerInner;
