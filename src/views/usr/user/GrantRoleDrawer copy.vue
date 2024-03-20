<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-06-16 16:28:39
 * @LastEditors: LJH
 * @LastEditTime: 2022-07-14 15:46:48
 * @FilePath: \GloryApp\src\views\usr\user\GrantRoleDrawer.vue
 * Copyright (C) 2022 LJH. All rights reserved.
-->
<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="授权用户角色"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicTable @register="registerTable" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { grantUserRole } from '/@/api/usr/usr';
  import { getRoleList } from '/@/api/usr/role';

  export default defineComponent({
    name: 'GranRoleDrawer',
    components: { BasicDrawer, BasicTable },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      let rowId: number;
      const [registerTable, { getSelectRowKeys, setSelectedRowKeys }] = useTable({
        title: '',
        api: getRoleList,
        columns: [
          {
            title: '角色名称',
            dataIndex: 'name',
            width: 150,
          },
          {
            title: '编码',
            dataIndex: 'code',
            width: 120,
          },
        ],
        useSearchForm: false,
        showTableSetting: false,
        bordered: true,
        showIndexColumn: false,
        canResize: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
        },
        pagination: {
          pageSize: 50,
        },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ confirmLoading: false });
        rowId = data.record.id;
        setSelectedRowKeys(data.record.roleIds.split(',').map((e) => e * 1));
      });

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });

          await grantUserRole(rowId, getSelectRowKeys() as unknown as number[]);

          closeDrawer();
          emit('success', false);
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerTable,
        handleSubmit,
      };
    },
  });
</script>
