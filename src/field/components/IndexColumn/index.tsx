import { ConfigProvider } from 'antd';
import { clsx } from 'clsx';
import type { Ref } from 'react';
import { useContext } from 'react';

import { useStyle } from '../../../utils';

/**
 * 默认的 index 列容器，提供一个好看的 index
 *
 * @param param0
 */
const IndexColumn = ({
  border = false,
  children,
  ref,
}: {
  border?: boolean;
  children: number;
  ref?: Ref<any>;
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const className = getPrefixCls('pro-field-index-column');

  // css
  const { wrapSSR, hashId } = useStyle('IndexColumn', () => {
    return {
      [`.${className}`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '18px',
        height: '18px',
        '&-border': {
          color: '#fff',
          fontSize: '12px',
          lineHeight: '12px',
          backgroundColor: '#314659',
          borderRadius: '9px',
          '&.top-three': {
            backgroundColor: '#979797',
          },
        },
      },
    };
  });
  return wrapSSR(
    <div
      ref={ref}
      className={clsx(className, hashId, {
        [`${className}-border`]: border,
        'top-three': (children as number) > 3,
      })}
    >
      {children}
    </div>,
  );
};

export default IndexColumn;
