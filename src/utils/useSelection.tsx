import { Checkbox, Radio } from 'antd';
import type { GetRowKey, TableRowSelection } from 'antd/es/table/interface';
import type { Key, ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type UseSelectionConfig<RecordType> = {
  getRowKey: GetRowKey<RecordType>;
  getRecordByKey: (key: Key) => RecordType | undefined;
  prefixCls?: string;
  data: RecordType[];
  pageData: RecordType[];
  expandType?: 'row' | 'nest';
  childrenColumnName?: string;
  locale?: any;
};

function useSelection<RecordType>(
  config: UseSelectionConfig<RecordType>,
  rowSelection?: TableRowSelection<RecordType>,
): readonly [
  (columns?: any[]) => Array<{
    render: (text: any, record: RecordType, index: number) => ReactElement;
  }>,
  Set<Key>,
] {
  const { getRowKey, data } = config;

  const controlledKeys = rowSelection?.selectedRowKeys as Key[] | undefined;
  const [innerKeys, setInnerKeys] = useState<Key[]>(controlledKeys || []);

  // Keep in sync with controlled keys
  useEffect(() => {
    if (controlledKeys) {
      setInnerKeys(controlledKeys);
    }
  }, [controlledKeys && controlledKeys.join(';')]);

  const selectedKeySet = useMemo(() => new Set(innerKeys), [innerKeys]);

  const toggleKey = useCallback(
    (key: Key, record: RecordType, checked: boolean) => {
      setInnerKeys((prevKeys) => {
        if (rowSelection?.type === 'radio') {
          const nextKeys = [key];
          const selectedRows = [record];
          rowSelection?.onChange?.(nextKeys, selectedRows, {
            type: 'single',
            selectedRows,
            selectedRowKeys: nextKeys,
          } as any);
          rowSelection?.onSelect?.(record, checked, selectedRows, {} as any);
          if (!controlledKeys) {
            return nextKeys;
          }
          return prevKeys;
        }
        const prevSet = new Set(prevKeys);
        const next = new Set(prevSet);
        if (checked) {
          next.add(key);
        } else {
          next.delete(key);
        }

        const nextKeys = Array.from(next);

        // Fire callbacks similar to antd rowSelection
        const selectedRows = data.filter((item, idx) => next.has(getRowKey(item, idx)));
        rowSelection?.onChange?.(nextKeys, selectedRows, {
          type: 'multiple',
          selectedRows,
          selectedRowKeys: nextKeys,
        } as any);
        rowSelection?.onSelect?.(
          record,
          checked,
          data.filter((item, idx) => next.has(getRowKey(item, idx))),
          {} as any,
        );

        if (!controlledKeys) {
          return nextKeys;
        }
        return prevKeys;
      });
    },
    [data, getRowKey, rowSelection, controlledKeys],
  );

  const selectItemRender = useCallback(
    (columns?: any[]) => {
      void columns;
      if (!rowSelection) {
        return [];
      }
      return [
        {
          render: (_text: any, record: RecordType, index: number) => {
            const key = getRowKey(record, index);
            const checked = selectedKeySet.has(key);
            if (rowSelection?.type === 'radio') {
              return (
                <Radio
                  checked={checked}
                  onChange={(e) => {
                    toggleKey(key, record, e.target.checked);
                  }}
                />
              );
            }
            return (
              <Checkbox
                checked={checked}
                onChange={(e) => {
                  toggleKey(key, record, e.target.checked);
                }}
              />
            );
          },
        },
      ];
    },
    [getRowKey, selectedKeySet, toggleKey, rowSelection?.type],
  );

  return [selectItemRender, selectedKeySet] as const;
}

export default useSelection;
