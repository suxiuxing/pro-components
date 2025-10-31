import Card from '../../FormItem/Card';
import type { ProSchemaRenderValueTypeFunction } from '../typing';

export const card: ProSchemaRenderValueTypeFunction = (item, { genItems }) => {
  if (item.valueType === 'group') {
    if (!item.columns || !Array.isArray(item.columns)) return null;

    return (
      <Card
        key={item.key}
        colProps={item.colProps}
        label={item.label}
        rowProps={item.rowProps}
        {...item.getFieldProps?.()}
      >
        {genItems(item.columns)}
      </Card>
    );
  }

  return true;
};
