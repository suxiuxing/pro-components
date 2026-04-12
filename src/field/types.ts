import type { ReactNode, Ref, RefObject } from 'react';

import type { BaseProFieldFC, ProFieldFCRenderProps, ProRenderFieldPropsType } from '../provider';
import type { ProFieldRequestData, ProFieldTextType, ProFieldValueTypeInput } from '../utils';

export type ProFieldEmptyText = string | false;

/** 默认的 Field 需要实现的功能 */
export type ProFieldFC<T = {}> = (
  props: BaseProFieldFC & ProRenderFieldPropsType & T & { ref?: Ref<any> },
) => ReactNode;

/** 轻量筛选的 field 属性 */
export type ProFieldLightProps = {
  lightLabel?: RefObject<{
    labelRef: RefObject<HTMLElement>;
    clearRef: RefObject<HTMLElement>;
  }>;
  labelTrigger?: boolean;
};

/** Value type by function */
export type ProFieldValueTypeFunction<T> = (item: T) => ProFieldValueTypeInput;

/** 传给各模式渲染函数（defaultRenderRead/Edit、pureRenderRead/Edit 等）的合并 props */
export type ProFieldRenderProps = Omit<ProFieldFCRenderProps, 'text' | 'placeholder'> &
  ProRenderFieldPropsType & {
    /** 从服务器读取选项 */
    request?: ProFieldRequestData;
    emptyText?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    [key: string]: any;
  };

/** ProField / PureProField 对外 props */
export type ProFieldPropsType = {
  text?: ProFieldTextType;
  valueType?: ProFieldValueTypeInput;
} & ProFieldRenderProps;
