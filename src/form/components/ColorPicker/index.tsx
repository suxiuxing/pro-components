import type { PopoverProps, ColorPickerProps } from 'antd';
import type { Ref } from 'react';

import { FieldColorPicker } from '../../../field';
import { ProConfigProvider } from '../../../provider';
import type { ProFormFieldItemProps } from '../../typing';
import ProFromField from '../Field';

export type ProFormColorPickerProps = ProFormFieldItemProps<ColorPickerProps> & {
  popoverProps?: PopoverProps;
  colors?: string[];
};

/**
 * 颜色选择组件
 *
 * @param
 */
const ProFormColorPicker = ({
  fieldProps,
  popoverProps,
  proFieldProps,
  colors,
  ref,
  ...rest
}: ProFormColorPickerProps & { ref?: Ref<any> }) => {
  return (
    <ProConfigProvider
      valueTypeMap={{
        color: {
          render: (text, props) => (
            <FieldColorPicker
              {...props}
              text={text}
            />
          ),
          formItemRender: (text, props) => (
            <FieldColorPicker
              {...props}
              text={text}
            />
          ),
        },
      }}
    >
      <ProFromField
        valueType="color"
        fieldProps={{
          popoverProps,
          colors,
          ...fieldProps,
        }}
        ref={ref}
        proFieldProps={proFieldProps}
        fieldConfig={{
          defaultProps: {
            width: '100%',
          },
        }}
        {...rest}
      />
    </ProConfigProvider>
  );
};

export default ProFormColorPicker;
