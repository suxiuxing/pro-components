import type { TablePaginationConfig } from 'antd';
import { ConfigProvider, Table } from 'antd';
import type {
  FilterValue as AntFilterValue,
  GetRowKey,
  SorterResult,
  SortOrder,
  TableCurrentDataSource,
} from 'antd/es/table/interface';
import classNames from 'classnames';
import { isEmpty, isEqual } from 'es-toolkit/compat';
import type Summary from 'rc-table/lib/Footer/Summary';
import type { JSX, Key } from 'react';
import React, { useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import type { ActionType } from '.';
import ProCard from '../card';
import ValueTypeToComponent from '../field/ValueTypeToComponent';
import ProForm, { GridContext } from '../form';
import type { ParamsType } from '../provider';
import ProConfigContext, { ProConfigProvider, proTheme, useIntl } from '../provider';
import {
  editableRowByKey,
  ErrorBoundary,
  omitUndefined,
  recordKeyToString,
  stringify,
  useDeepCompareEffect,
  useDeepCompareEffectDebounce,
  useEditableArray,
  useMountMergeState,
} from '../utils';
import Alert from './components/Alert';
import FormRender from './components/Form';
import Toolbar from './components/ToolBar';
import { Container, TableContext } from './Store/Provide';
import { useStyle } from './style';
import type {
  FilterValue,
  OptionSearchProps,
  PageInfo,
  ProTableProps,
  RequestData,
  TableRowSelection,
  UseFetchDataAction,
} from './typing';
import useFetchData from './useFetchData';
import {
  flattenColumns,
  genColumnKey,
  getServerFilterResult,
  getServerSorterResult,
  isBordered,
  mergePagination,
  parseServerDefaultColumnConfig,
  useActionType,
} from './utils';
import { columnSort } from './utils/columnSort';
import { genProColumnToColumn } from './utils/genProColumnToColumn';

function TableRender<T extends Record<string, any>, U, ValueType>(
  props: ProTableProps<T, U, ValueType> & {
    action: UseFetchDataAction<any>;
    defaultClassName: string;
    tableColumn: any[];
    toolbarDom: JSX.Element | null;
    hideToolbar: boolean;
    searchNode: JSX.Element | null;
    alertDom: JSX.Element | null;
    isLightFilter: boolean;
    onSortChange: (sort?: Record<string, SortOrder>) => void;
    onFilterChange: (filter: Record<string, FilterValue>) => void;
    editableUtils: any;
    getRowKey: GetRowKey<any>;
    tableRef: React.RefObject<any>;
  },
) {
  const {
    rowKey,
    tableClassName,
    defaultClassName,
    action,
    tableColumn: tableColumns,
    type,
    pagination,
    rowSelection,
    size,
    defaultSize,
    tableStyle,
    toolbarDom,
    hideToolbar,
    searchNode,
    style,
    cardProps: propsCardProps,
    alertDom,
    name,
    onSortChange,
    onFilterChange,
    options,
    isLightFilter,
    className,
    cardBordered,
    editableUtils,
    getRowKey,
    tableRef,
    ...rest
  } = props;
  const counter = useContext(TableContext);

  /** 需要遍历一下，不然不支持嵌套表格 */
  const columns = useMemo(() => {
    const loopFilter = (column: any[]): any[] => {
      return column
        .map((item) => {
          // 删掉不应该显示的
          const columnKey = genColumnKey(item.key, item.index);
          const config = counter.columnsMap[columnKey];
          if (config && config.show === false) {
            return false;
          }
          if (item.children) {
            return {
              ...item,
              children: loopFilter(item.children),
            };
          }
          return item;
        })
        .filter(Boolean);
    };
    return loopFilter(tableColumns);
  }, [counter.columnsMap, tableColumns]);

  // 需要进行筛选的列
  const useFilterColumns = useMemo(() => {
    const _columns: any[] = flattenColumns(columns);
    return _columns.filter((column) => !!column.filters);
  }, [columns]);

  /**
   * 如果是分页的新增，总是加到最后一行
   *
   * @returns
   */
  const editableDataSource = (dataSource: any[]): T[] => {
    const { options: newLineOptions, defaultValue: row } = editableUtils.newLineRecord || {};
    const isNewLineRecordAtTop = newLineOptions?.position === 'top';
    if (newLineOptions?.parentKey) {
      const actionProps = {
        data: dataSource,
        getRowKey: getRowKey,
        row: {
          ...row,
          map_row_parentKey: recordKeyToString(newLineOptions.parentKey)?.toString(),
        },
        key: newLineOptions?.recordKey,
        childrenColumnName: props.expandable?.childrenColumnName || 'children',
      };

      return editableRowByKey(actionProps, isNewLineRecordAtTop ? 'top' : 'update');
    }

    if (isNewLineRecordAtTop) {
      return [row, ...action.dataSource];
    }
    // 如果有分页的功能，我们加到这一页的末尾
    if (pagination && pagination?.current && pagination?.pageSize) {
      const newDataSource = [...action.dataSource];
      if (pagination?.pageSize > newDataSource.length) {
        newDataSource.push(row);
        return newDataSource;
      }
      newDataSource.splice(pagination?.current * pagination?.pageSize - 1, 0, row);
      return newDataSource;
    }

    return [...action.dataSource, row];
  };

  const getTableProps = () => ({
    ...rest,
    size,
    rowSelection: rowSelection === false ? undefined : rowSelection,
    className: tableClassName,
    style: tableStyle,
    columns,
    loading: action.loading,
    dataSource: editableUtils.newLineRecord ? editableDataSource(action.dataSource) : action.dataSource,
    pagination,
    onChange: (
      changePagination: TablePaginationConfig,
      filters: Record<string, AntFilterValue | null>,
      sorter: SorterResult<T> | SorterResult<T>[],
      extra: TableCurrentDataSource<T>,
    ) => {
      rest.onChange?.(changePagination, filters, sorter, extra);

      // 传递服务端筛选数据
      const serverFilter = getServerFilterResult(filters, useFilterColumns);
      onFilterChange(omitUndefined(serverFilter));

      // 传递服务端排序数据
      const serverSorter = getServerSorterResult(sorter);
      onSortChange(omitUndefined(serverSorter));
    },
  });

  /**
   * 是否需要 card 来包裹
   */
  const notNeedCardDom = useMemo(() => {
    if (props.search === false && !props.headerTitle && props.toolBarRender === false) {
      return true;
    }
    return false;
  }, []);

  /** 默认的 table dom，如果是编辑模式，外面还要包个 form */
  const baseTableDom = (
    <GridContext.Provider
      value={{
        grid: false,
        colProps: undefined,
        rowProps: undefined,
      }}
    >
      <Table<T> {...getTableProps()} ref={tableRef as any} rowKey={rowKey} />
    </GridContext.Provider>
  );

  /** 自定义的 render */
  const tableDom = props.tableViewRender
    ? props.tableViewRender(
        {
          ...getTableProps(),
          rowSelection: rowSelection !== false ? rowSelection : undefined,
        },
        baseTableDom,
      )
    : baseTableDom;

  /**
   * 这段代码使用了 useMemo 进行了性能优化，根据 props.editable 和 props.name 的不同情况，渲染不同的页面组件。
   * 当 props.editable 为 true 并且 props.name 不存在时，渲染一个带有表单和工具栏的页面组件，否则只渲染工具栏和表格组件。
   * renderContent 函数会在 alertDom、props.loading、props.editable、tableDom、toolbarDom 发生变化时重新执行。
   * */
  const tableContentDom = useMemo(() => {
    if (props.editable && !props.name) {
      return (
        <>
          {toolbarDom}
          {alertDom}
          <ProForm
            {...props.editable?.formProps}
            key="table"
            component={false}
            dateFormatter={props.dateFormatter}
            form={props.editable?.form}
            formRef={props.editable?.formProps?.formRef as any}
            omitNil={false}
            submitter={false}
            onValuesChange={editableUtils.onValuesChange}
          >
            {tableDom}
          </ProForm>
        </>
      );
    }

    return (
      <>
        {toolbarDom}
        {alertDom}

        {tableDom}
      </>
    );
  }, [alertDom, props.loading, !!props.editable, tableDom, toolbarDom]);

  const cardBodyStyle = useMemo(() => {
    if (propsCardProps === false || notNeedCardDom === true || !!props.name) return {};

    if (hideToolbar) {
      return {
        padding: 0,
      };
    }

    if (toolbarDom) {
      return {
        paddingBlockStart: 0,
      };
    }
    if (toolbarDom && pagination === false) {
      return {
        paddingBlockStart: 0,
      };
    }
    // if (!toolbarDom)
    return {
      padding: 0,
    };
  }, [notNeedCardDom, pagination, props.name, propsCardProps, toolbarDom, hideToolbar]);

  /** Table 区域的 dom，为了方便 render */
  const tableAreaDom =
    // cardProps 或者 有了name 就不需要这个padding了，不然会导致不好对齐
    propsCardProps === false || notNeedCardDom === true || !!props.name ? (
      tableContentDom
    ) : (
      <ProCard
        bodyStyle={cardBodyStyle}
        ghost={props.ghost}
        variant={isBordered('table', cardBordered) ? 'outlined' : 'borderless'}
        {...propsCardProps}
      >
        {tableContentDom}
      </ProCard>
    );

  const renderTable = () => {
    if (props.tableRender) {
      return props.tableRender(props, tableAreaDom, {
        toolbar: toolbarDom || undefined,
        alert: alertDom || undefined,
        table: tableDom || undefined,
      });
    }
    return tableAreaDom;
  };

  const proTableDom = (
    <div
      ref={counter.rootDomRef}
      className={classNames(className, {
        [`${defaultClassName}-polling`]: action.pollingLoading,
      })}
      style={style}
    >
      {isLightFilter ? null : searchNode}
      {/* 渲染一个额外的区域，用于一些自定义 */}
      {type !== 'form' && props.tableExtraRender && (
        <div className={classNames(className, `${defaultClassName}-extra`)}>
          {props.tableExtraRender(props, action.dataSource || [])}
        </div>
      )}
      {type !== 'form' && renderTable()}
    </div>
  );

  // 如果不需要的全屏，ConfigProvider 没有意义
  if (!options || !options?.fullScreen) {
    return proTableDom;
  }
  return (
    <ConfigProvider
      getPopupContainer={() => {
        return (counter.rootDomRef.current || document.body) as any as HTMLElement;
      }}
    >
      {proTableDom}
    </ConfigProvider>
  );
}

const emptyObj = {} as Record<string, any>;

const ProTable = <T extends Record<string, any>, U extends ParamsType, ValueType>(
  props: ProTableProps<T, U, ValueType> & {
    defaultClassName: string;
  },
) => {
  const {
    cardBordered,
    request,
    className: propsClassName,
    params = emptyObj,
    defaultData,
    headerTitle,
    postData,
    ghost,
    pagination: propsPagination,
    actionRef: propsActionRef,
    columns: propsColumns = [],
    toolBarRender,
    optionsRender,
    onLoad,
    onRequestError,
    style,
    cardProps,
    tableStyle,
    tableClassName,

    options,
    search,
    name: isEditorTable,
    onLoadingChange,
    rowSelection: propsRowSelection = false,
    beforeSearchSubmit,
    tableAlertRender,
    defaultClassName,
    formRef: propRef,
    type = 'table',
    columnEmptyText = '-',
    toolbar,
    rowKey,
    manualRequest,
    polling,
    tooltip,
    revalidateOnFocus = false,
    searchFormRender,
    ...rest
  } = props;
  const { wrapSSR, hashId } = useStyle(props.defaultClassName);

  const className = classNames(defaultClassName, propsClassName, hashId);

  /** 通用的来操作子节点的工具类 */
  const actionRef = useRef<ActionType>(undefined);
  // antd Table 实例 ref（仅用于转发 scrollTo 能力）
  const antTableRef = useRef<any>(null);

  const defaultFormRef = useRef(undefined);
  const formRef = propRef || defaultFormRef;

  useImperativeHandle(propsActionRef, () => actionRef.current);

  /** 单选多选的相关逻辑 */
  const [selectedRowKeys, setSelectedRowKeys] = useMountMergeState<(string | number)[] | Key[] | undefined>(
    propsRowSelection ? propsRowSelection?.defaultSelectedRowKeys || [] : undefined,
    {
      value: propsRowSelection ? propsRowSelection.selectedRowKeys : undefined,
    },
  );

  const [formSearch, setFormSearch] = useMountMergeState<Record<string, any> | undefined>(() => {
    // 如果手动模式，或者 search 不存在的时候设置为 undefined
    // undefined 就不会触发首次加载
    if (manualRequest || search !== false) {
      return undefined;
    }
    return {};
  });

  const { defaultProFilter, defaultProSort } = useMemo(() => {
    const { sort, filter } = parseServerDefaultColumnConfig(propsColumns);
    return {
      defaultProFilter: filter,
      defaultProSort: sort,
    };
  }, [propsColumns]);
  const [proFilter, setProFilter] = useMountMergeState<Record<string, FilterValue>>(defaultProFilter);
  const [proSort, setProSort] = useMountMergeState<Record<string, SortOrder>>(defaultProSort);

  const intl = useIntl();

  /** 需要初始化 不然默认可能报错 这里取了 defaultCurrent 和 current 为了保证不会重复刷新 */
  const fetchPagination =
    typeof propsPagination === 'object'
      ? (propsPagination as TablePaginationConfig)
      : { defaultCurrent: 1, defaultPageSize: 20, pageSize: 20, current: 1 };

  const counter = useContext(TableContext);

  // ============================ useFetchData ============================
  const fetchData = useMemo(() => {
    if (!request) return undefined;
    return async (pageParams?: Record<string, any>) => {
      const actionParams = {
        ...(pageParams || {}),
        ...formSearch,
        ...params,
      };

      delete (actionParams as any)._timestamp;
      const response = await request(actionParams as unknown as U, proSort, proFilter);
      return response as RequestData<T>;
    };
  }, [formSearch, params, proFilter, proSort, request]);

  const action = useFetchData(fetchData, defaultData, {
    pageInfo: propsPagination === false ? false : fetchPagination,
    loading: props.loading,
    dataSource: props.dataSource,
    onDataSourceChange: props.onDataSourceChange,
    onLoad,
    onLoadingChange,
    onRequestError,
    postData,
    revalidateOnFocus,
    manual: formSearch === undefined,
    polling,
    effects: [stringify(params), stringify(formSearch), stringify(proFilter), stringify(proSort)],
    debounceTime: props.debounceTime,
    onPageInfoChange: (pageInfo) => {
      if (!propsPagination || !fetchData) return;

      // 总是触发一下 onChange 和  onShowSizeChange
      // 目前只有 List 和 Table 支持分页, List 有分页的时候打断 Table 的分页
      propsPagination?.onChange?.(pageInfo.current, pageInfo.pageSize);
      propsPagination?.onShowSizeChange?.(pageInfo.current, pageInfo.pageSize);
    },
  });
  // ============================ END ============================

  /** 聚焦的时候重新请求数据，这样可以保证数据都是最新的。 */
  useEffect(() => {
    // 手动模式和 request 为空都不生效
    if (props.manualRequest || !props.request || !revalidateOnFocus || props.form?.ignoreRules) return;

    // 聚焦时重新请求事件
    const visibilitychange = () => {
      if (document.visibilityState === 'visible') {
        action.reload();
      }
    };

    document.addEventListener('visibilitychange', visibilitychange);
    return () => document.removeEventListener('visibilitychange', visibilitychange);
  }, []);

  /** SelectedRowKeys受控处理selectRows */
  const preserveRecordsRef = React.useRef(new Map<any, T>());

  // ============================ RowKey ============================
  const getRowKey = React.useMemo<GetRowKey<any>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (record: T, index?: number) => {
      if (index === -1) {
        return (record as any)?.[rowKey as string];
      }
      // 如果 props 中有name 的话，用index 来做行号，这样方便转化为 index
      if (props.name) {
        return index?.toString();
      }
      return (record as any)?.[rowKey as string] ?? index?.toString();
    };
  }, [props.name, rowKey]);

  useMemo(() => {
    if (action.dataSource?.length) {
      const keys = action.dataSource.map((data) => {
        const dataRowKey = getRowKey(data, -1);
        preserveRecordsRef.current.set(dataRowKey, data);
        return dataRowKey;
      });
      return keys;
    }
    return [];
  }, [action.dataSource, getRowKey]);

  /** 页面编辑的计算 */
  const pagination = useMemo(() => {
    const newPropsPagination = propsPagination === false ? false : { ...propsPagination };
    const pageConfig = {
      ...action.pageInfo,
      setPageInfo: ({ pageSize, current }: PageInfo) => {
        const { pageInfo } = action;

        // pageSize 发生改变，并且你不是在第一页，切回到第一页
        // 这样可以防止出现 跳转到一个空的数据页的问题
        if (pageSize === pageInfo.pageSize || pageInfo.current === 1) {
          action.setPageInfo({ pageSize, current });

          return;
        }

        // 通过request的时候清空数据，然后刷新不然可能会导致 pageSize 没有数据多
        if (request) action.setDataSource([]);
        action.setPageInfo({
          pageSize,
          // 目前只有 List 和 Table 支持分页, List 有分页的时候 还是使用之前的当前页码
          current: type === 'list' ? current : 1,
        });
      },
    };
    if (request && newPropsPagination) {
      delete newPropsPagination.onChange;
      delete newPropsPagination.onShowSizeChange;
    }
    return mergePagination<T>(newPropsPagination, pageConfig, intl);
  }, [propsPagination, action, intl]);
  useDeepCompareEffect(() => {
    // request 存在且params不为空，且已经请求过数据才需要设置。
    if (
      props.request &&
      !isEmpty(params) &&
      action.dataSource &&
      !isEqual(action.dataSource, defaultData) &&
      action?.pageInfo?.current !== 1
    ) {
      action.setPageInfo({
        current: 1,
      });
    }
  }, [params]);

  // 设置 name 到 store 中，里面用了 ref ，所以不用担心直接 set
  counter.setPrefixName(props.name);

  /** 清空所有的选中项 */
  const onCleanSelected = useCallback(() => {
    if (propsRowSelection && propsRowSelection.onChange) {
      propsRowSelection.onChange([], [], {
        type: 'none',
      });
    }
    setSelectedRowKeys([]);
  }, [propsRowSelection, setSelectedRowKeys]);

  counter.propsRef.current = props as ProTableProps<any, any, any>;

  /** 可编辑行的相关配置 */
  const editableUtils = useEditableArray<any>({
    ...props.editable,
    tableName: props.name,
    getRowKey,
    childrenColumnName: props.expandable?.childrenColumnName || 'children',
    dataSource: action.dataSource || [],
    setDataSource: (data) => {
      props.editable?.onValuesChange?.(undefined as any, data);
      action.setDataSource(data);
    },
  });

  // ============================ Render ============================
  const { token } = proTheme?.useToken() || {};

  /** 绑定 action */
  useActionType(actionRef, action, {
    fullScreen: () => {
      if (!counter.rootDomRef?.current || !document.fullscreenEnabled) {
        return;
      }
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        counter.rootDomRef?.current.requestFullscreen();
      }
    },
    onCleanSelected: () => {
      // 清空选中行
      onCleanSelected();
    },
    resetAll: () => {
      // 清空选中行
      onCleanSelected();

      // 清空 toolbar 搜索
      counter.setKeyWords(undefined);
      // 重置页码
      action.setPageInfo({
        current: 1,
      });

      // 重置绑定筛选值
      setProFilter(defaultProFilter);
      // 重置绑定排序值
      setProSort(defaultProSort);

      // 重置表单
      formRef?.current?.resetFields();
    },
    editableUtils,
    scrollTo: (arg: any) => (antTableRef as any)?.current?.scrollTo?.(arg),
  });

  /** 同步 action */
  counter.setAction(actionRef.current);

  // ---------- 列计算相关 start  -----------------
  const tableColumn = useMemo(() => {
    return genProColumnToColumn<T>({
      columns: propsColumns,
      counter,
      columnEmptyText,
      type,
      marginSM: token.marginSM,
      editableUtils,
      rowKey,
      childrenColumnName: props.expandable?.childrenColumnName,
      proFilter,
      proSort,
    }).sort(columnSort(counter.columnsMap));
  }, [
    propsColumns,
    counter?.sortKeyColumns,
    counter?.columnsMap,
    columnEmptyText,
    type,

    editableUtils.editableKeys && editableUtils.editableKeys.join(','),
    proFilter,
    proSort,
  ]);

  /** Table Column 变化的时候更新一下，这个参数将会用于渲染 */
  useDeepCompareEffectDebounce(
    () => {
      if (tableColumn && tableColumn.length > 0) {
        // 重新生成key的字符串用于排序
        const columnKeys = tableColumn.map((item) => genColumnKey(item.key, item.index));
        counter.setSortKeyColumns(columnKeys);
      }
    },
    [tableColumn],
    ['render', 'formItemRender'],
    100,
  );

  /** 同步 Pagination，支持受控的 页码 和 pageSize */
  useDeepCompareEffect(() => {
    const { pageInfo } = action;
    const { current = pageInfo?.current, pageSize = pageInfo?.pageSize } = propsPagination || {};
    if (
      propsPagination &&
      (current || pageSize) &&
      (pageSize !== pageInfo?.pageSize || current !== pageInfo?.current)
    ) {
      action.setPageInfo({
        pageSize: pageSize || pageInfo.pageSize,
        current: current || pageInfo.current,
      });
    }
  }, [propsPagination && propsPagination.pageSize, propsPagination && propsPagination.current]);

  /** 行选择相关的问题 */
  const rowSelection: TableRowSelection = {
    selectedRowKeys,
    ...propsRowSelection,
    onChange: (keys, rows, info) => {
      if (propsRowSelection && propsRowSelection.onChange) {
        propsRowSelection.onChange(keys, rows, info);
      }
      setSelectedRowKeys(keys);
    },
  };

  /** 是不是 LightFilter, LightFilter 有一些特殊的处理 */
  const isLightFilter: boolean = search !== false && search?.filterType === 'light';

  const onFormSearchSubmit = useCallback(
    <Y extends ParamsType>(values: Y): any => {
      // 判断search.onSearch返回值决定是否更新formSearch
      if (options && options.search) {
        const { name = 'keyword' } = options.search === true ? {} : options.search;

        /** 如果传入的 onSearch 返回值为 false，则不要把options.search.name对应的值set到formSearch */
        const success = (options.search as OptionSearchProps)?.onSearch?.(counter.keyWords!);

        if (success !== false) {
          setFormSearch({
            ...values,
            [name]: counter.keyWords,
          });
          return;
        }
      }

      setFormSearch(values);
    },
    [counter.keyWords, options, setFormSearch],
  );

  const loading = useMemo(() => {
    if (typeof action.loading === 'object') {
      return action.loading?.spinning || false;
    }
    return action.loading;
  }, [action.loading]);

  const searchNode = useMemo(() => {
    const node =
      search === false && type !== 'form' ? null : (
        <FormRender<T, U>
          action={actionRef}
          beforeSearchSubmit={beforeSearchSubmit}
          cardBordered={props.cardBordered}
          columns={propsColumns}
          dateFormatter={props.dateFormatter}
          form={props.form}
          formRef={formRef}
          ghost={ghost}
          loading={!!loading}
          manualRequest={manualRequest}
          pagination={pagination}
          search={search}
          type={props.type || 'table'}
          onFormSearchSubmit={(values) => {
            onFormSearchSubmit(values);
          }}
          onReset={props.onReset}
          onSubmit={props.onSubmit}
        />
      );

    if (searchFormRender && node) {
      return <>{searchFormRender(props, node)}</>;
    } else {
      return node;
    }
  }, [
    beforeSearchSubmit,
    formRef,
    ghost,
    loading,
    manualRequest,
    onFormSearchSubmit,
    pagination,
    props,
    propsColumns,
    search,
    searchFormRender,
    type,
  ]);

  const selectedRows = useMemo(
    () => selectedRowKeys?.map((key) => preserveRecordsRef.current?.get(key)),
    [action.dataSource, selectedRowKeys],
  ) as T[];

  const hideToolbar = useMemo(
    () => options === false && !headerTitle && !toolBarRender && !toolbar && !isLightFilter,
    [options, headerTitle, toolBarRender, toolbar, isLightFilter],
  );

  /** 内置的工具栏 */
  const toolbarDom =
    toolBarRender === false ? null : (
      <Toolbar<T>
        actionRef={actionRef}
        headerTitle={headerTitle}
        hideToolbar={hideToolbar}
        options={options}
        optionsRender={optionsRender}
        searchNode={isLightFilter ? searchNode : null}
        selectedRowKeys={selectedRowKeys!}
        selectedRows={selectedRows}
        tableColumn={tableColumn}
        toolBarRender={toolBarRender}
        toolbar={toolbar}
        tooltip={tooltip}
        onFormSearchSubmit={(newValues) => {
          setFormSearch({
            ...formSearch,
            ...newValues,
          });
        }}
      />
    );

  /** 内置的多选操作栏 */
  const alertDom =
    propsRowSelection !== false ? (
      <Alert<T>
        alertInfoRender={tableAlertRender}
        alertOptionRender={rest.tableAlertOptionRender}
        alwaysShowAlert={propsRowSelection?.alwaysShowAlert}
        selectedRowKeys={selectedRowKeys!}
        selectedRows={selectedRows}
        onCleanSelected={onCleanSelected}
      />
    ) : null;
  return wrapSSR(
    <TableRender
      {...props}
      action={action}
      alertDom={alertDom}
      className={className}
      defaultClassName={defaultClassName}
      editableUtils={editableUtils}
      getRowKey={getRowKey}
      hideToolbar={hideToolbar}
      isLightFilter={isLightFilter}
      name={isEditorTable}
      pagination={pagination}
      rowSelection={propsRowSelection !== false ? rowSelection : undefined}
      searchNode={searchNode}
      size={counter.tableSize}
      tableColumn={tableColumn}
      tableRef={antTableRef}
      toolbarDom={toolbarDom}
      onFilterChange={(filterConfig) => {
        if (isEqual(filterConfig, proFilter)) return;
        setProFilter(filterConfig ?? {});
      }}
      onSizeChange={counter.setTableSize}
      onSortChange={(sortConfig) => {
        if (isEqual(sortConfig, proSort)) return;
        setProSort(sortConfig ?? {});
      }}
    />,
  );
};

/**
 * 🏆 Use Ant Design Table like a Pro! 更快 更好 更方便
 *
 * @param props
 */
const ProviderTableContainer = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: ProTableProps<DataType, Params, ValueType>,
) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const ErrorComponent = props.ErrorBoundary === false ? React.Fragment : props.ErrorBoundary || ErrorBoundary;

  const context = useContext(ProConfigContext);
  return (
    <Container initValue={props}>
      <ProConfigProvider needDeps valueTypeMap={{ ...context.valueTypeMap, ...ValueTypeToComponent }}>
        <ErrorComponent>
          <ProTable<DataType, Params, ValueType> defaultClassName={`${getPrefixCls('pro-table')}`} {...props} />
        </ErrorComponent>
      </ProConfigProvider>
    </Container>
  );
};

ProviderTableContainer.Summary = Table.Summary as typeof Summary;

export default ProviderTableContainer;
