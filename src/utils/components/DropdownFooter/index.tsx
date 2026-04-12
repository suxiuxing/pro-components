import { Button, ConfigProvider } from 'antd';
import { clsx } from 'clsx';
import type { FC, JSX, MouseEvent, ReactNode } from 'react';
import { useContext } from 'react';

import { useIntl } from '../../../provider';
import { useStyle } from './style';

type LightFilterFooterRender =
  | ((
      onConfirm?: (e?: MouseEvent) => void,
      onClear?: (e?: MouseEvent) => void,
    ) => JSX.Element | false)
  | false;

type OnClick = (e?: MouseEvent) => void;

export type DropdownFooterProps = {
  onClear?: OnClick;
  onConfirm?: OnClick;
  disabled?: boolean;
  footerRender?: LightFilterFooterRender;
  children?: ReactNode;
};

const DropdownFooter: FC<DropdownFooterProps> = (props) => {
  const intl = useIntl();
  const { onClear, onConfirm, disabled, footerRender } = props;
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('pro-core-dropdown-footer');
  const { wrapSSR, hashId } = useStyle(prefixCls);
  const defaultFooter = [
    <Button
      key="clear"
      style={{
        visibility: onClear ? 'visible' : 'hidden',
      }}
      type="link"
      size="small"
      disabled={disabled}
      onClick={(e) => {
        if (onClear) {
          onClear(e);
        }
        e.stopPropagation();
      }}
    >
      {intl.getMessage('form.lightFilter.clear', '清除')}
    </Button>,
    <Button
      key="confirm"
      data-type="confirm"
      type="primary"
      size="small"
      onClick={onConfirm}
      disabled={disabled}
    >
      {intl.getMessage('form.lightFilter.confirm', '确认')}
    </Button>,
  ];

  if (footerRender === false || footerRender?.(onConfirm, onClear) === false) {
    return null;
  }

  const renderDom = footerRender?.(onConfirm, onClear) || defaultFooter;

  return wrapSSR(
    <div
      className={clsx(prefixCls, hashId)}
      onClick={(e) =>
        (e.target as Element).getAttribute('data-type') !== 'confirm' && e.stopPropagation()
      }
    >
      {renderDom}
    </div>,
  );
};

export { DropdownFooter };
