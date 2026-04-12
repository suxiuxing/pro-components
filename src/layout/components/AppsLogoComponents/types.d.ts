import type { ReactNode } from 'react';
export type AppItemProps = {
  title: ReactNode;
  desc?: ReactNode;
  icon?: ReactNode | (() => ReactNode);
  url?: string;
  target?: string;
  children?: Omit<AppItemProps, 'children'>[];
};

export type AppListProps = AppItemProps[];
