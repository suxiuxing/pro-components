import { ConfigProvider } from 'antd';
import type { CSSProperties, JSX, ReactNode } from 'react';
import { cloneElement, Fragment, isValidElement, useContext, useImperativeHandle } from 'react';

import { proTheme } from '../../../provider';
import type { ProFieldFC } from '../../types';

const addArrayKeys = (doms: ReactNode[]) =>
  doms.map((dom, index) => {
    if (!isValidElement<Record<string, any>>(dom)) {
      return <Fragment key={index}>{dom}</Fragment>;
    }
    const domProps = dom.props as Record<string, any> & {
      style?: CSSProperties;
    };
    return cloneElement(dom, {
      key: index,
      ...domProps,
      style: {
        ...domProps.style,
      },
    });
  });

/**
 * 一般用于放多个按钮
 *
 * @param
 */
const FieldOptions: ProFieldFC = ({ text, mode: type, render, fieldProps, ref }) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const className = getPrefixCls('pro-field-option');

  const { token } = proTheme.useToken();

  useImperativeHandle(ref, () => ({}));

  if (render) {
    const doms = render(text, { mode: type, ...fieldProps }, <></>) as unknown as ReactNode[];

    if (!doms || doms?.length < 1 || !Array.isArray(doms)) {
      return null;
    }

    return (
      <div
        style={{
          display: 'flex',
          gap: token.margin,
          alignItems: 'center',
        }}
        className={className}
      >
        {addArrayKeys(doms)}
      </div>
    );
  }

  if (!text || !Array.isArray(text)) {
    if (!isValidElement(text)) {
      return null;
    }
    return text as JSX.Element;
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: token.margin,
        alignItems: 'center',
      }}
      className={className}
    >
      {addArrayKeys(text)}
    </div>
  );
};

export default FieldOptions;
