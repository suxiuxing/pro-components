import { clsx } from 'clsx';
import type { FC, ReactNode } from 'react';

import useStyle from './style';

export type ProCardActionsProps = {
  /**
   * 自定义前缀
   *
   * @ignore
   */
  prefixCls?: string;
  /** 操作按钮 */
  actions?: ReactNode[] | ReactNode;
};

const ProCardActions: FC<ProCardActionsProps> = (props) => {
  const { actions, prefixCls } = props;
  const { wrapSSR, hashId } = useStyle(prefixCls);
  if (Array.isArray(actions) && actions?.length) {
    return wrapSSR(
      <ul className={clsx(`${prefixCls}-actions`, hashId)}>
        {actions.map((action, index) => (
          <li
            style={{ width: `${100 / actions.length}%`, padding: 0, margin: 0 }}
            key={`action-${index}`}
            className={clsx(`${prefixCls}-actions-item`, hashId)}
          >
            {action}
          </li>
        ))}
      </ul>,
    );
  }
  return wrapSSR(<ul className={clsx(`${prefixCls}-actions`, hashId)}>{actions}</ul>);
};

export default ProCardActions;
