import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import type { MenuItemProps } from 'antd';
import { Button, ConfigProvider, Dropdown } from 'antd';
import { clsx } from 'clsx';
import type { CSSProperties, FC, ReactNode } from 'react';
import { useContext } from 'react';

interface MenuItems extends MenuItemProps {
  name: ReactNode;
  key: string;
  title?: string;
}

export type DropdownProps = {
  className?: string;
  style?: CSSProperties;
  menus?: MenuItems[];
  onSelect?: (key: string) => void;
  children?: ReactNode;
};

/**
 * 一个简单的下拉菜单
 *
 * @param param0
 */
const DropdownButton: FC<DropdownProps> = ({ children, menus, onSelect, className, style }) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const tempClassName = getPrefixCls('pro-table-dropdown');

  return (
    <Dropdown
      menu={{
        onClick: (params) => onSelect && onSelect(params.key as string),
        items: menus?.map((item) => ({
          label: item.name,
          key: item.key,
        })),
      }}
      className={clsx(tempClassName, className)}
    >
      <Button style={style}>
        {children} <DownOutlined />
      </Button>
    </Dropdown>
  );
};

const TableDropdown: FC<DropdownProps> & {
  Button: typeof DropdownButton;
} = ({ className: propsClassName, style, onSelect, menus = [], children }) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const className = getPrefixCls('pro-table-dropdown');
  return (
    <Dropdown
      menu={{
        onClick: (params) => {
          onSelect?.(params.key as string);
        },
        items: menus.map(({ key, name, ...rest }) => ({
          key,
          ...rest,
          title: rest.title as string,
          label: name,
        })),
      }}
      className={clsx(className, propsClassName)}
    >
      <a style={style}>{children || <EllipsisOutlined />}</a>
    </Dropdown>
  );
};

TableDropdown.Button = DropdownButton;

export default TableDropdown;
