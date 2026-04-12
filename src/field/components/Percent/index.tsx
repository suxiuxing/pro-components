import { useMemo } from 'react';

import { useIntl } from '../../../provider';
import { isProFieldEditOrUpdateMode, isProFieldReadMode } from '../../internal/fieldMode';
import type { ProFieldFC } from '../../types';
import { FieldPercentEdit } from './FieldPercentEdit';
import { FieldPercentRead } from './FieldPercentRead';
import type { PercentPropInt } from './types';
import { toNumber } from './util';

export type { PercentPropInt };

/**
 * 百分比组件
 */
const FieldPercent: ProFieldFC<PercentPropInt> = (props) => {
  const { text, mode, placeholder, showSymbol: propsShowSymbol } = props;
  const intl = useIntl();
  const placeholderValue = placeholder || intl.getMessage('tableForm.inputPlaceholder', '请输入');
  const realValue = useMemo(
    () =>
      typeof text === 'string' && (text as string).includes('%')
        ? toNumber((text as string).replace('%', ''))
        : toNumber(text),
    [text],
  );
  const showSymbol = useMemo(() => {
    if (typeof propsShowSymbol === 'function') {
      return propsShowSymbol?.(text);
    }
    return propsShowSymbol;
  }, [propsShowSymbol, text]);

  if (isProFieldReadMode(mode)) {
    return FieldPercentRead(
      {
        ...props,
        realValue,
        showSymbol,
      },
      props.ref,
    );
  }
  if (isProFieldEditOrUpdateMode(mode)) {
    return FieldPercentEdit(
      {
        ...props,
        placeholderValue,
      },
      props.ref,
    );
  }
  return null;
};

export default FieldPercent;
