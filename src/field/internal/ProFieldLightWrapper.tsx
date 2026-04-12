import type { JSX, MouseEvent as ReactMouseEvent, ReactElement, ReactNode, RefObject } from 'react';
import { cloneElement, useCallback, useRef, useState } from 'react';

import type { ProFieldLightProps } from '../types';

/**
 * Light 筛选专用：区分 label 点击与 clear，向子组件注入 `labelTrigger` / `lightLabel`。
 * 与只读（read）/ 编辑（edit）无关；read/edit 分支请用 `fieldMode.ts` 中的工具函数。
 */
function ProFieldLightWrapper<T extends ProFieldLightProps>(
  props: T & {
    children: ReactNode;
    isLight?: boolean;
  },
) {
  const [labelTrigger, setLabelTrigger] = useState(false);

  const lightLabel = useRef<{
    labelRef: RefObject<HTMLElement>;
    clearRef: RefObject<HTMLElement>;
  }>(null);

  const isTriggeredByLabel = useCallback(
    (e: ReactMouseEvent) => {
      const isLabelMouseDown = lightLabel.current?.labelRef?.current?.contains(
        e.target as HTMLElement,
      );
      const isClearMouseDown = lightLabel.current?.clearRef?.current?.contains(
        e.target as HTMLElement,
      );
      return isLabelMouseDown && !isClearMouseDown;
    },
    [lightLabel],
  );

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isTriggeredByLabel(e)) {
      setLabelTrigger(true);
    }
  };
  const handleMouseUp = () => {
    setLabelTrigger(false);
  };

  if (props.isLight) {
    return (
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {cloneElement(props.children as JSX.Element, {
          labelTrigger,
          lightLabel,
        })}
      </div>
    );
  }

  return <>{props.children as ReactNode}</>;
}

/**
 * 非 light 时直接返回子元素；light 时包一层 {@link ProFieldLightWrapper}。
 * 用于在需要处包一层 light 行为，避免重复的 JSX 包装。
 */
export function wrapProFieldLight(isLight: boolean | undefined, child: ReactElement): ReactNode {
  if (!isLight) {
    return child;
  }
  return <ProFieldLightWrapper isLight>{child}</ProFieldLightWrapper>;
}

export default ProFieldLightWrapper;
