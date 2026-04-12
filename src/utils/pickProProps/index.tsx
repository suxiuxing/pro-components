import { omitBy } from 'es-toolkit/object';

const proFieldProps = `valueType request formItemRender render text formItemProps valueEnum`;

const proFormProps = `fieldProps isDefaultDom groupProps contentRender submitterProps submitter`;

const proPropsSet = new Set(`${proFieldProps} ${proFormProps}`.split(/[\s\n]+/));

export function pickProProps(props: Record<string, any>, customValueType = false) {
  return omitBy(
    props ?? {},
    (_, key) => !customValueType && proPropsSet.has(String(key)),
  ) as Record<string, any>;
}
