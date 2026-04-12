import { CloseCircleFilled, DownOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { clsx } from 'clsx';
import type { CSSProperties, JSX, ReactNode, Ref } from 'react';
import { useContext, useImperativeHandle, useRef } from 'react';

import { useIntl } from '../../../provider';
import { useStyle } from './style';

export type FieldLabelProps = {
  label?: ReactNode;
  value?: any;
  disabled?: boolean;
  onClear?: () => void;
  size?: SizeType;
  ellipsis?: boolean;
  placeholder?: ReactNode;
  className?: string;
  formatter?: (value: any) => ReactNode;
  style?: CSSProperties;
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined';
  allowClear?: boolean;
  downIcon?: ReactNode | false;
  onClick?: () => void;
  valueMaxLength?: number;
  /**
   * 点击标签的事件，用来唤醒 down menu 状态
   */
  onLabelClick?: () => void;
};

const FieldLabelFunction = (props: FieldLabelProps & { ref?: Ref<any> }) => {
  const { ref } = props;
  const {
    label,
    onClear,
    value,
    disabled,
    onLabelClick,
    ellipsis,
    placeholder,
    className,
    formatter,
    variant,
    style,
    downIcon,
    allowClear = true,
    valueMaxLength = 41,
  } = props;
  const { componentSize } = ConfigProvider?.useConfig?.() || {
    componentSize: 'middle',
  };
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('pro-core-field-label');
  const { wrapSSR, hashId } = useStyle(prefixCls);
  const intl = useIntl();
  const clearRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => ({
    labelRef,
    clearRef,
  }));

  const wrapElements = (array: (string | JSX.Element)[]): JSX.Element[] | string => {
    if (array.every((item) => typeof item === 'string')) return array.join(',');

    return array.map((item, index) => {
      const comma = index === array.length - 1 ? '' : ',';
      if (typeof item === 'string') {
        return (
          <span key={index}>
            {item}
            {comma}
          </span>
        );
      }
      return (
        <span
          key={index}
          style={{ display: 'flex' }}
        >
          {item}
          {comma}
        </span>
      );
    });
  };

  const formatterText = (aValue: any) => {
    if (formatter) {
      return formatter(aValue);
    }
    return Array.isArray(aValue) ? wrapElements(aValue) : aValue;
  };

  const getTextByValue = (
    aLabel?: ReactNode | ReactNode[],
    aValue?: string | string[],
  ): ReactNode => {
    if (
      aValue !== undefined &&
      aValue !== null &&
      aValue !== '' &&
      (!Array.isArray(aValue) || aValue.length)
    ) {
      const prefix = aLabel ? (
        <span
          onClick={() => {
            onLabelClick?.();
          }}
          className={clsx(`${prefixCls}-text`, hashId)}
        >
          {aLabel}
          {': '}
        </span>
      ) : (
        ''
      );
      const str = formatterText(aValue);
      if (!ellipsis) {
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {prefix}
            {formatterText(aValue)}
          </span>
        );
      }
      const getText = () => {
        const isArrayValue = Array.isArray(aValue) && aValue.length > 1;
        const unitText = intl.getMessage('form.lightFilter.itemUnit', '项');
        if (typeof str === 'string' && str.length > valueMaxLength && isArrayValue) {
          return `...${aValue.length}${unitText}`;
        }
        return '';
      };
      const tail = getText();

      return (
        <span
          title={typeof str === 'string' ? str : undefined}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {prefix}
          <span style={{ paddingInlineStart: 4, display: 'flex' }}>
            {typeof str === 'string' ? str?.toString()?.slice?.(0, valueMaxLength) : str}
          </span>
          {tail}
        </span>
      );
    }
    return aLabel || placeholder;
  };

  return wrapSSR(
    <span
      className={clsx(
        prefixCls,
        hashId,
        `${prefixCls}-${props.size ?? componentSize ?? 'middle'}`,
        {
          [`${prefixCls}-${variant || 'borderless'}-active`]:
            (Array.isArray(value) ? value.length > 0 : !!value) || value === 0,
          [`${prefixCls}-active`]:
            (Array.isArray(value) ? value.length > 0 : !!value) || value === 0,
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-${variant}`]: variant,
          [`${prefixCls}-allow-clear`]: allowClear,
        },
        className,
      )}
      style={style}
      ref={labelRef}
      onClick={() => {
        props?.onClick?.();
      }}
    >
      {getTextByValue(label, value)}
      {(value || value === 0) && allowClear && (
        <CloseCircleFilled
          role="button"
          title={intl.getMessage('form.lightFilter.clear', '清除')}
          className={clsx(`${prefixCls}-icon`, hashId, `${prefixCls}-close`)}
          onClick={(e) => {
            if (!disabled) onClear?.();
            e.stopPropagation();
          }}
          ref={clearRef}
        />
      )}
      {downIcon !== false
        ? (downIcon ?? (
            <DownOutlined className={clsx(`${prefixCls}-icon`, hashId, `${prefixCls}-arrow`)} />
          ))
        : null}
    </span>,
  );
};

export const FieldLabel = FieldLabelFunction;
