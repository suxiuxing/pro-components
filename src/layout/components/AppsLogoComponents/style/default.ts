import type { GenerateStyle } from '../../../../provider';
import { resetComponent } from '../../../../utils';
import type { AppsLogoComponentsToken } from './index';
const genAppsLogoComponentsDefaultListStyle: GenerateStyle<
  AppsLogoComponentsToken
> = (token) => {
  return {
    '&-content': {
      maxHeight: 'calc(100vh - 48px)',
      overflow: 'auto',
      '&-list': {
        boxSizing: 'content-box',
        maxWidth: 720,
        marginBlock: 0,
        marginInline: 0,
        paddingBlock: 0,
        paddingInline: 0,
        listStyle: 'none',
        '&-item': {
          position: 'relative',
          display: 'inline-block',
          width: 328,
          height: 72,
          paddingInline: 16,
          paddingBlock: 16,
          verticalAlign: 'top',
          listStyleType: 'none',
          /**
           * Item 交互过渡：同时过渡 transform / background / box-shadow，
           * hover 时整张卡轻微浮起（translateY(-2px)）+ 阴影，active 下按；
           * 缓动曲线沿用 Material "easeOutStandard"。
           */
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
            /** icon 伴随轻微放大，与卡片浮起协调 */
            '& > a > img': { transform: 'scale(1.04)' },
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: 'none',
          },
          '* div': resetComponent?.(token),
          a: {
            display: 'flex',
            height: '100%',
            fontSize: 12,
            textDecoration: 'none',
            '& > img': {
              width: 40,
              height: 40,
              transition: 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
            },
            '& > div': {
              marginInlineStart: 14,
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

export { genAppsLogoComponentsDefaultListStyle };
