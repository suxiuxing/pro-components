import type { JSX, ReactNode, Ref } from 'react';
import { cloneElement, Fragment, isValidElement, useContext } from 'react';

import type { ProFieldFCRenderProps, ProRenderFieldPropsType } from '../provider';
import ProConfigContext from '../provider';
import {
  omitUndefined,
  pickProProps,
  type ProFieldTextType,
  type ProFieldValueTypeInput,
  useDeepCompareMemo,
  useRefFunction,
} from '../utils';
import './initDayjs';
import type { ProFieldPropsType, ProFieldRenderProps } from './types';

export type ProFieldRenderText = (
  dataValue: ProFieldTextType,
  valueType: ProFieldValueTypeInput,
  props: ProFieldRenderProps,
  valueTypeMap: Record<string, ProRenderFieldPropsType>,
) => ReactNode;

/** 只读 / 编辑使用各自渲染函数，避免在单函数内反复判断 mode */
export type ProFieldDualRender = {
  renderRead: ProFieldRenderText;
  renderEdit: ProFieldRenderText;
};

export function isProFieldDualRender(
  input: ProFieldRenderText | ProFieldDualRender,
): input is ProFieldDualRender {
  return (
    typeof input === 'object' && input !== null && 'renderRead' in input && 'renderEdit' in input
  );
}

export interface CreateProFieldOptions {
  /**
   * 为 true 时，当 valueType 在 context.valueTypeMap 中注册过，
   * 将对应标志传给 pickProProps，使自定义 valueType 的 props 少被过滤
   */
  pickProPropsWithValueTypeMap: boolean;
}

/**
 * @param render 单函数时读写共用（兼容旧用法）；对象时分别指定只读 / 编辑渲染
 */
export function createProField(
  render: ProFieldRenderText | ProFieldDualRender,
  options: CreateProFieldOptions,
) {
  const renderRead = isProFieldDualRender(render) ? render.renderRead : render;
  const renderEdit = isProFieldDualRender(render) ? render.renderEdit : render;

  const ProFieldComponent = ({
    text,
    valueType = 'text',
    mode = 'read',
    onChange,
    formItemRender,
    value,
    readonly,
    fieldProps: restFieldProps,
    ref,
    ...rest
  }: ProFieldPropsType & { ref?: Ref<any> }) => {
    const context = useContext(ProConfigContext);

    const onChangeCallBack = useRefFunction((...restParams: any[]) => {
      restFieldProps?.onChange?.(...restParams);
      onChange?.(...restParams);
    });

    const fieldProps: any = useDeepCompareMemo(() => {
      return (
        (value !== undefined || restFieldProps) && {
          value,
          ...omitUndefined(restFieldProps),
          onChange: onChangeCallBack,
        }
      );
    }, [value, restFieldProps, onChangeCallBack]);

    const customValueType =
      options.pickProPropsWithValueTypeMap &&
      Object.keys(context.valueTypeMap || {}).includes(String(valueType));

    const effectiveMode = readonly ? 'read' : mode;
    /** 取值顺序仍以原始 mode 为准（readonly + mode=edit 时仍按编辑态取 fieldProps.value） */
    const dataValue =
      mode === 'edit' || mode === 'update'
        ? (fieldProps?.value ?? text ?? '')
        : (text ?? fieldProps?.value ?? '');
    const renderFn =
      effectiveMode === 'edit' || effectiveMode === 'update' ? renderEdit : renderRead;

    const renderedDom = renderFn(
      dataValue,
      valueType || 'text',
      omitUndefined({
        ref,
        ...rest,
        mode: effectiveMode,
        formItemRender: formItemRender
          ? (curText: any, props: ProFieldFCRenderProps, dom: JSX.Element) => {
              const { placeholder: _placeholder, ...restProps } = props;
              const newDom = formItemRender(curText, restProps, dom);
              if (isValidElement(newDom)) {
                return cloneElement(newDom, {
                  ...fieldProps,
                  ...(newDom.props as any),
                });
              }
              return newDom;
            }
          : undefined,
        placeholder: formItemRender ? undefined : (rest?.placeholder ?? fieldProps?.placeholder),
        fieldProps: pickProProps(
          omitUndefined({
            ...fieldProps,
            placeholder: formItemRender
              ? undefined
              : (rest?.placeholder ?? fieldProps?.placeholder),
          }),
          customValueType,
        ),
      }) as ProFieldRenderProps,
      context.valueTypeMap || {},
    );

    return <Fragment>{renderedDom}</Fragment>;
  };

  return ProFieldComponent;
}
