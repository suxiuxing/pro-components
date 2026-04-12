import { CopyrightOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import type { CSSProperties, FC, ReactNode } from 'react';
import { Fragment } from 'react';

import type { WithFalse } from '../typing';
import { GlobalFooter } from './GlobalFooter';

const { Footer } = Layout;

export type FooterProps = {
  links?: WithFalse<
    {
      key?: string;
      title: ReactNode;
      href: string;
      blankTarget?: boolean;
    }[]
  >;
  copyright?: WithFalse<string>;
  style?: CSSProperties;
  className?: string;
  prefixCls?: string;
};

const DefaultFooter: FC<FooterProps> = ({
  links,
  copyright,
  style,
  className,
  prefixCls,
}: FooterProps) => (
  <Footer
    className={className}
    style={{ padding: 0, ...style }}
    data-testid="pro-layout-footer"
  >
    <GlobalFooter
      links={links}
      prefixCls={prefixCls}
      copyright={
        copyright === false ? null : (
          <Fragment>
            <CopyrightOutlined /> {copyright}
          </Fragment>
        )
      }
    />
  </Footer>
);

export { DefaultFooter };
