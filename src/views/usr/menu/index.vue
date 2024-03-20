<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #tableTitle>
        <a-button type="primary" @click="handleCreate({})" v-if="hasPermission('sysMenu:add')">
          新增菜单
        </a-button>

        <a-button type="primary" class="ml-2" preIcon="ic:round-expand" @click="onExpandAll()">
          展开全部
        </a-button>
        <a-button type="primary" class="ml-2" preIcon="ic:round-compress" @click="onCollapseAll()">
          折叠全部
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '新增',
                onClick: handleCreate.bind(null, record),
                ifShow: hasPermission('sysMenu:add'),
                disabled: record.type === 3 || record.openType == 3 || record.openType == 2,
              },
              {
                label: '编辑',
                ifShow: hasPermission('sysMenu:update'),
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                color: 'error',
                ifShow: hasPermission('sysMenu:delete'),
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup name="menuIndex">
  import { nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getMenuList, deleteMenu } from '/@/api/usr/menu';
  import { useDrawer } from '/@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { columns, searchFormSchema } from './menu.data';

  const { hasPermission } = usePermission();

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload, expandAll, collapseAll }] = useTable({
    api: getMenuList,
    columns,
    size: 'small',
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    useSearchForm: true,
    isTreeTable: true,
    striped: true,
    pagination: false,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 150,
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      ifShow: hasPermission(['sysMenu:add', 'sysMenu:update', 'sysMenu:delete']),
    },
  });

  function handleCreate(record?: any) {
    let addRecord = { type: 1, parentId: 0, openType: 1 };
    if (record?.id) {
      addRecord.type = record.type + 1;
      addRecord.parentId = record.id;
    }
    openDrawer(true, {
      isUpdate: false,
      record: addRecord,
    });
  }

  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }

  async function handleDelete(record: Recordable) {
    await deleteMenu(record.id);
    reload();
  }

  function handleSuccess() {
    reload();
  }

  function onFetchSuccess() {
    // nextTick(expandAll);
  }

  function onExpandAll() {
    nextTick(expandAll);
  }

  function onCollapseAll() {
    nextTick(collapseAll);
  }
</script>
