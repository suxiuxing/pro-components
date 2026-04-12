import type { ReactNode } from 'react';
import { Children, cloneElement, Fragment, isValidElement } from 'react';

/**
 * 将 autoFocus 应用到第一个子节点；若首个子节点是 Fragment，则递归应用到其第一个子节点，
 * 避免向 React.Fragment 传入非法 props。
 */
export function autoFocusToFirstChild(node: ReactNode, autoFocus: boolean): ReactNode {
  if (!autoFocus || !isValidElement<{ children?: ReactNode }>(node)) {
    return node;
  }
  if (node.type === Fragment) {
    const children = Children.toArray(node.props.children);
    const newChildren = children.map((child, index) =>
      index === 0 ? autoFocusToFirstChild(child, autoFocus) : child,
    );
    return cloneElement(node, {}, ...newChildren);
  }
  return cloneElement(node, {
    ...(node.props as any),
    autoFocus,
  });
}
