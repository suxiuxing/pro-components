import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { Ref } from 'react';

import type { IntlType } from '../../../provider';
import { parseValueToDay } from '../../../utils';
import type { ProFieldFC } from '../../types';

type Props = Parameters<
  ProFieldFC<{
    text: string;
    format?: string;
    variant?: 'outlined' | 'borderless' | 'filled' | 'underlined';
  }>
>[0] & {
  intl: IntlType;
};

export function FieldFromNowEdit(props: Props, ref?: Ref<unknown>) {
  const { text, mode, variant, formItemRender, fieldProps, intl } = props;
  const placeholder = intl.getMessage('tableForm.selectPlaceholder', '请选择');
  const momentValue = parseValueToDay(fieldProps.value) as dayjs.Dayjs;
  const dom = (
    <DatePicker
      ref={ref as Ref<any>}
      placeholder={placeholder}
      showTime
      variant={variant ?? fieldProps?.variant ?? 'outlined'}
      {...fieldProps}
      value={momentValue}
    />
  );
  if (formItemRender) {
    return formItemRender(text, { mode, ...fieldProps }, dom);
  }
  return dom;
}
