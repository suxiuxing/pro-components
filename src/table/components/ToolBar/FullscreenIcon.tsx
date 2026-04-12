import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import type { Ref } from 'react';
import { memo, useEffect, useState } from 'react';

import { useIntl } from '../../../provider';
import { isBrowser } from '../../../utils';

const FullScreenIcon = ({ ref }: { ref?: Ref<HTMLSpanElement> }) => {
  const intl = useIntl();
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  useEffect(() => {
    if (!isBrowser()) {
      return;
    }
    document.onfullscreenchange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
  }, []);
  return fullscreen ? (
    <Tooltip title={intl.getMessage('tableToolBar.exitFullScreen', '退出全屏')}>
      <span ref={ref}>
        <FullscreenExitOutlined />
      </span>
    </Tooltip>
  ) : (
    <Tooltip title={intl.getMessage('tableToolBar.fullScreen', '全屏')}>
      <span ref={ref}>
        <FullscreenOutlined />
      </span>
    </Tooltip>
  );
};

export default memo(FullScreenIcon);
