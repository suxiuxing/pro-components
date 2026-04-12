import type { AnyObject } from 'antd/es/_util/type';
import type { GetRowKey } from 'antd/es/table/interface';
import type { Key } from 'react';
import { useRef } from 'react';

type LazyMapCache<RecordType> = {
  data?: readonly RecordType[];
  childrenColumnName?: string;
  kvMap?: Map<Key, RecordType>;
  getRowKey?: GetRowKey<RecordType>;
};

const useLazyKVMap = <RecordType extends AnyObject = AnyObject>(
  data: readonly RecordType[],
  childrenColumnName: string,
  getRowKey: GetRowKey<RecordType>,
) => {
  const mapCacheRef = useRef<LazyMapCache<RecordType>>({});

  function getRecordByKey(key: Key): RecordType | undefined {
    function dig(records: readonly RecordType[], kv: Map<Key, RecordType>) {
      records.forEach((record, index) => {
        const rowKey = getRowKey(record, index);
        kv.set(rowKey, record);

        if (record && typeof record === 'object' && childrenColumnName in record) {
          dig(((record as any)[childrenColumnName] || []) as RecordType[], kv);
        }
      });
    }
    if (
      !mapCacheRef.current ||
      mapCacheRef.current.data !== data ||
      mapCacheRef.current.childrenColumnName !== childrenColumnName ||
      mapCacheRef.current.getRowKey !== getRowKey
    ) {
      const kvMap = new Map<Key, RecordType>();
      dig(data, kvMap);

      mapCacheRef.current = {
        data,
        childrenColumnName,
        kvMap,
        getRowKey,
      };
    }

    return mapCacheRef.current.kvMap?.get(key);
  }

  return [getRecordByKey] as const;
};

export default useLazyKVMap;
