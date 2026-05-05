import type { GenerateStyle } from '../../../../provider';
import type { AppsLogoComponentsToken } from './index';

const genAppsLogoComponentsSimpleListStyle: GenerateStyle<
  AppsLogoComponentsToken
> = (token) => {
  return {
    '&-content': {
      maxHeight: 'calc(100vh - 48px)',
      overflow: 'auto',
      '&-list': {
        boxSizing: 'border-box',
        maxWidth: 376,
        marginBlock: 0,
        marginInline: 0,
        paddingBlock: 0,
        paddingInline: 0,
        listStyle: 'none',
        '&-item': {
          position: 'relative',
          display: 'inline-block',
          width: 104,
          height: 104,
          marginBlock: 8,
          marginInline: 8,
          paddingInline: 24,
          paddingBlock: 24,
          verticalAlign: 'top',
          listStyleType: 'none',
          /** 与 default 列表共享的 hover 过渡：transform + 背景 + 阴影 */
          transition:
            'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
          borderRadius: token.borderRadius,
          cursor: 'pointer',
          '&-group': {
            marginBottom: 16,
            '&-title': {
              margin: '16px 0 8px 12px',
              fontWeight: 600,
              color: 'rgba(0, 0, 0, 0.88)',
              fontSize: 16,
              opacity: 0.85,
              lineHeight: 1.5,
              '&:first-child': {
                marginTop: 12,
              },
            },
          },
          '&:hover': {
            backgroundColor: token.colorBgTextHover,
            transform: 'translateY(-2px)',
            boxShadow:
              '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12)',
            /** 字符 chip 头像：hover 时跑呼吸动画 + 渐变轻微旋转 */
            [`& > a > ${token.componentCls}-simple-avatar`]: {
              animationName: `${token.componentCls}-avatar-pulse`.replace(
                /^\./,
                '',
              ),
              animationDuration: '1.6s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
            },
            '& > a > img': { transform: 'scale(1.06)' },
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: 'none',
          },
          a: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            fontSize: 12,
            textDecoration: 'none',
            /**
             * 字符 chip 头像使用 className 而非 id（旧代码 `#avatarLogo` 会在列表里
             * 生成重复 id，见 `SimpleContent.renderLogo` 的重构）。
             */
            [`& > ${token.componentCls}-simple-avatar`]: {
              width: 40,
              height: 40,
              margin: '0 auto',
              color: token.colorPrimary,
              fontSize: 22,
              lineHeight: '40px',
              textAlign: 'center',
              backgroundImage:
                'linear-gradient(180deg, #E8F0FB 0%, #F6F8FC 100%)',
              borderRadius: token.borderRadius,
              transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
            },
            '& > img': {
              width: 40,
              height: 40,
              transition: 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
            },
            '& > div': {
              marginBlockStart: 5,
              marginInlineStart: 0,
              color: token.colorTextHeading,
              fontSize: 14,
              lineHeight: '22px',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            },
            '& > div > span': {
              color: token.colorTextSecondary,
              fontSize: 12,
              lineHeight: '20px',
            },
          },
        },
      },
    },
  };
};

export { genAppsLogoComponentsSimpleListStyle };
