import type { GenerateStyle, ProAliasToken } from '../../../../provider';
import { useStyle as useAntdStyle } from '../../../../provider';
import { genAppsLogoComponentsDefaultListStyle } from './default';
import { genAppsLogoComponentsSimpleListStyle } from './simple';

export interface AppsLogoComponentsToken extends ProAliasToken {
  componentCls: string;
}

/**
 * 缓动曲线统一常量：
 * - `easeOut`：标准"入场/微交互"（Material Emphasized Decelerate），更自然的收尾；
 * - `easeSpring`：轻微超调，给 hover 浮起 / active 按下一点"手感"。
 */
const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)';
const easeSpring = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const genAppsLogoComponentsStyle: GenerateStyle<AppsLogoComponentsToken> = (
  token,
) => {
  return {
    [token.componentCls]: {
      boxSizing: 'border-box',
      '*, *::before, *::after': {
        boxSizing: 'border-box',
      },

      /**
       * 触发按钮（九宫格 icon）：
       * - 整体过渡统一走 `easeOut`，hover 背景 + 轻微放大，active 下沉
       * - 内部 svg 在 `-active` 下旋转 90°，给"已展开"更强视觉反馈
       * - 选中态背景叠一层 inset box-shadow，和 hover 态区分开
       */
      '&-icon': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingInline: 4,
        paddingBlock: 0,
        fontSize: 14,
        lineHeight: '14px',
        height: 28,
        width: 28,
        cursor: 'pointer',
        color: token.layout?.colorTextAppListIcon,
        borderRadius: token.borderRadius,
        transition: `color 0.2s ${easeOut}, background-color 0.2s ${easeOut}, transform 0.2s ${easeSpring}, box-shadow 0.2s ${easeOut}`,
        /** 触发按钮里的 svg 单独给旋转过渡，独立于父级 transform */
        svg: {
          transition: `transform 0.28s ${easeOut}`,
        },
        '&:hover': {
          color: token.layout?.colorTextAppListIconHover,
          backgroundColor: token.layout?.colorBgAppListIconHover,
          transform: 'scale(1.06)',
        },
        '&:active': {
          transform: 'scale(0.94)',
        },
        '&-active': {
          borderRadius: token.borderRadius,
          color: token.layout?.colorTextAppListIconHover,
          backgroundColor: token.layout?.colorBgAppListIconHover,
          boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.06)',
          svg: {
            transform: 'rotate(90deg)',
          },
        },
      },
      '&-item-title': {
        marginInlineStart: '16px',
        marginInlineEnd: '8px',
        marginBlockStart: 0,
        marginBlockEnd: '12px',
        fontWeight: 600,
        color: 'rgba(0, 0, 0, 0.88)',
        fontSize: 16,
        opacity: 0.85,
        lineHeight: 1.5,
        '&:first-child': {
          marginBlockStart: 12,
        },
      },
      /**
       * Popover 入场动画：`opacity 0 → 1` + `translateY(8px) → 0`。
       * 只在进入阶段跑；离开由 antd 内置过渡负责，以避免两套动画打架。
       * transform-origin 设为 top-right，与 `placement=bottomRight` 对齐，
       * 视觉上就像从触发按钮"掉"下来。
       */
      '&-popover': {
        [`${token.antCls}-popover-arrow`]: {
          display: 'none',
        },
        [`${token.antCls}-popover-inner`]: {
          transformOrigin: 'top right',
          animationName: `${token.componentCls}-popover-in`.replace(/^\./, ''),
          animationDuration: '0.24s',
          animationTimingFunction: easeOut,
          animationFillMode: 'both',
        },
      },

      /**
       * 全局 keyframes（挂在根 componentCls 下，命名带前缀避免与业务冲突）
       * - popover-in：面板入场
       * - avatar-pulse：simple 模式字符头像 hover 微呼吸（幅度很小，避免干扰阅读）
       */
      [`@keyframes ${token.componentCls}-popover-in`.replace(/\./, '')]: {
        '0%': {
          opacity: 0,
          transform: 'translateY(8px) scale(0.98)',
        },
        '100%': {
          opacity: 1,
          transform: 'translateY(0) scale(1)',
        },
      },
      [`@keyframes ${token.componentCls}-avatar-pulse`.replace(/\./, '')]: {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.04)' },
      },

      '&-simple': genAppsLogoComponentsSimpleListStyle(token),
      '&-default': genAppsLogoComponentsDefaultListStyle(token),
    },
  };
};

export function useStyle(prefixCls: string) {
  return useAntdStyle('AppsLogoComponents', (token) => {
    const proCardToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    } as AppsLogoComponentsToken;

    return [genAppsLogoComponentsStyle(proCardToken)];
  });
}
