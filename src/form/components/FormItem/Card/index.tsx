import { ConfigProvider, Space } from 'antd';
import classNames from 'classnames';
import React, { useCallback, useContext, useMemo } from 'react';
import { useMountMergeState } from '../../../../utils';
import FieldContext from '../../../FieldContext';
import { useGridHelpers } from '../../../helpers/grid';
import type { ProFormGroupProps } from '../../../typing';
import { useStyle } from './style';

const Card: React.FC<
  ProFormGroupProps & {
    ref?: React.Ref<any>;
  }
> = ({ ref, ...props }) => {
  const { groupProps } = React.useContext(FieldContext);
  const {
    children,
    collapsible,
    defaultCollapsed,
    style,
    labelLayout,
    title = props.label,
    tooltip,
    align = 'start',
    direction,
    size = 32,
    titleRender,
    spaceProps,
    extra,
    autoFocus,
  } = {
    ...groupProps,
    ...props,
  };

  const [collapsed, setCollapsed] = useMountMergeState(() => defaultCollapsed || false, {
    value: props.collapsed,
    onChange: props.onCollapse,
  });
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const { ColWrapper, RowWrapper } = useGridHelpers(props);

  const className = getPrefixCls('pro-form-card');
  const { wrapSSR, hashId } = useStyle(className);

  const Wrapper = useCallback(
    ({ children: dom }: { children: React.ReactNode }) => (
      <Space
        {...spaceProps}
        align={align}
        className={classNames(`${className}-container ${hashId}`, spaceProps?.className)}
        direction={direction}
        size={size}
        style={{
          rowGap: 0,
          ...spaceProps?.style,
        }}
      >
        {dom}
      </Space>
    ),
    [align, className, direction, hashId, size, spaceProps],
  );

  const titleDom = titleRender ? titleRender(title, props) : title;
  const [childrenDoms, hiddenDoms] = useMemo(() => {
    const hiddenChildren: React.ReactNode[] = [];
    const childrenList = React.Children.toArray(children).map((element, index) => {
      // @ts-ignore
      if (React.isValidElement(element) && element?.props?.hidden) {
        hiddenChildren.push(element);
        return null;
      }
      if (index === 0 && React.isValidElement(element) && autoFocus) {
        return React.cloneElement(element, {
          ...(element.props as any),
          autoFocus,
        });
      }
      return element;
    });

    return [
      <RowWrapper key="children" Wrapper={Wrapper}>
        {childrenList}
      </RowWrapper>,
      hiddenChildren.length > 0 ? (
        <div
          style={{
            display: 'none',
          }}
        >
          {hiddenChildren}
        </div>
      ) : null,
    ];
  }, [children, RowWrapper, Wrapper, autoFocus]);

  return wrapSSR(
    <ColWrapper>
      <div
        ref={ref}
        className={classNames(className, hashId, {
          [`${className}-twoLine`]: labelLayout === 'twoLine',
        })}
        style={style}
      >
        <Card
          collapsed={collapsed}
          collapsible={collapsible}
          extra={extra}
          title={titleDom}
          tooltip={tooltip}
          onCollapse={setCollapsed}
        >
          {hiddenDoms}
          {childrenDoms}
        </Card>
      </div>
    </ColWrapper>,
  );
};

Card.displayName = 'ProForm-Card';

export default Card;
