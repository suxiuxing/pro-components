import { isProFieldEditOrUpdateMode, isProFieldReadMode } from '../../internal/fieldMode';
import type { ProFieldFC } from '../../types';
import { FieldRateEdit } from './FieldRateEdit';
import { FieldRateRead } from './FieldRateRead';

/**
 * 评分组件
 */
const FieldRate: ProFieldFC<{
  text: string;
}> = (props) => {
  const { mode } = props;
  if (isProFieldReadMode(mode)) {
    return FieldRateRead(props, props.ref);
  }
  if (isProFieldEditOrUpdateMode(mode)) {
    return FieldRateEdit(props, props.ref);
  }
  return null;
};

export default FieldRate;
