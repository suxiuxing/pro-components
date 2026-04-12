import { omitBy } from 'es-toolkit/object';

const antdFormItemPropsList = [
  // https://ant.design/components/form-cn/#Form.Item
  'colon',
  'dependencies',
  'extra',
  'getValueFromEvent',
  'getValueProps',
  'hasFeedback',
  'help',
  'htmlFor',
  'initialValue',
  'noStyle',
  'label',
  'labelAlign',
  'labelCol',
  'name',
  'preserve',
  'normalize',
  'required',
  'rules',
  'shouldUpdate',
  'trigger',
  'validateFirst',
  'validateStatus',
  'validateTrigger',
  'valuePropName',
  'wrapperCol',
  'hidden',
  'validateDebounce',
  // 我自定义的
  'addonBefore',
  'addonAfter',
  'addonWarpStyle',
];

const antdFormItemPropsSet = new Set(antdFormItemPropsList);

export function pickProFormItemProps(props: {}) {
  return omitBy(
    (props ?? {}) as Record<string, any>,
    (value, key) => value === undefined || !antdFormItemPropsSet.has(String(key)),
  );
}
