import { DownOutlined } from '@ant-design/icons';
import { useControlledState } from '@rc-component/util';
import { Dropdown, Space, Tabs } from 'antd';
import { clsx } from 'clsx';
import type { FC, Key, ReactNode } from 'react';
import { useCallback, useContext } from 'react';

import { ProProvider } from '../../../provider';

export type ListToolBarMenuItem = {
  key: Key;
  label: ReactNode;
  disabled?: boolean;
};

export type ListToolBarHeaderMenuProps = {
  type?: 'inline' | 'dropdown' | 'tab';
  activeKey?: Key;
  defaultActiveKey?: Key;
  items?: ListToolBarMenuItem[];
  onChange?: (activeKey?: Key) => void;
  prefixCls?: string;
  hashId?: string;
};

const HeaderMenu: FC<ListToolBarHeaderMenuProps> = (props) => {
  const { hashId: contextHashId } = useContext(ProProvider);
  const hashId = props.hashId ?? contextHashId;
  const {
    items = [],
    type = 'inline',
    prefixCls,
    activeKey: propActiveKey,
    defaultActiveKey,
  } = props;

  const [activeKey, setActiveKeyInner] = useControlledState<Key>(
    propActiveKey || (defaultActiveKey as Key),
    propActiveKey,
  );
  const setActiveKey = useCallback(
    (updater: Key | ((prev: Key) => Key)) => {
      setActiveKeyInner((prev) => {
        const next = typeof updater === 'function' ? (updater as (p: Key) => Key)(prev) : updater;
        (props.onChange as ((key?: Key, prev?: Key) => void) | undefined)?.(next, prev);
        return next;
      });
    },
    [props.onChange],
  );

  if (items.length < 1) {
    return null;
  }

  const activeItem =
    items.find((item) => {
      return item.key === activeKey;
    }) || items[0];

  if (type === 'inline') {
    return (
      <div className={clsx(`${prefixCls}-menu`, `${prefixCls}-inline-menu`, hashId)}>
        {items.map((item, index) => (
          <div
            key={item.key || index}
            onClick={() => {
              setActiveKey(item.key);
            }}
            className={clsx(
              `${prefixCls}-inline-menu-item`,
              activeItem.key === item.key ? `${prefixCls}-inline-menu-item-active` : undefined,
              hashId,
            )}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'tab') {
    return (
      <Tabs
        items={items.map((item) => ({
          ...item,
          key: item.key?.toString(),
        }))}
        activeKey={activeItem.key as string}
        onTabClick={(key) => setActiveKey(key)}
      />
    );
  }

  return (
    <div className={clsx(`${prefixCls}-menu`, `${prefixCls}-dropdownmenu`, hashId)}>
      <Dropdown
        trigger={['click']}
        menu={{
          selectedKeys: [activeItem.key as string],
          onClick: (item) => {
            setActiveKey(item.key);
          },
          items: items.map((item, index) => ({
            key: item.key || index,
            disabled: item.disabled,
            label: item.label,
          })),
        }}
      >
        <Space className={clsx(`${prefixCls}-dropdownmenu-label`, hashId)}>
          {activeItem.label}
          <DownOutlined />
        </Space>
      </Dropdown>
    </div>
  );
};

export default HeaderMenu;
