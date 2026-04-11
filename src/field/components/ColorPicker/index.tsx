import type { ColorPickerProps } from 'antd';
import React from 'react';
import {
  isProFieldEditOrUpdateMode,
  isProFieldReadMode,
} from '../../internal/fieldMode';
import type { ProFieldFC } from '../../types';
import { FieldColorPickerEdit } from './FieldColorPickerEdit';
import { FieldColorPickerRead } from './FieldColorPickerRead';

type FieldColorPickerProps = {
  text: string;
  mode?: 'read' | 'edit' | 'update';
} & Partial<Omit<ColorPickerProps, 'value' | 'mode'>>;

type ForwardRefFieldColorPicker = React.ForwardRefExoticComponent<
  FieldColorPickerProps & React.RefAttributes<any>
>;

/**
 * 颜色组件
 * Antd > 5.5.0 的版本 使用 antd 的 ColorPicker
 */
const FieldColorPicker: ProFieldFC<
  FieldColorPickerProps
> = (props, ref: any) => {
  const { mode: type } = props;

  if (isProFieldReadMode(type)) {
    return FieldColorPickerRead(props);
  }
  if (isProFieldEditOrUpdateMode(type)) {
    return FieldColorPickerEdit(props, ref);
  }
  return null;
};

const ForwardRefFieldColorPicker: ForwardRefFieldColorPicker =
  React.forwardRef(FieldColorPicker);

export default ForwardRefFieldColorPicker;
