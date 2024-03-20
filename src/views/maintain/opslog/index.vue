<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-04-23 15:19:37
 * @LastEditors: LJH
 * @LastEditTime: 2022-04-23 15:49:10
 * @FilePath: \GloryApp\src\views\maintain\opslog\index.vue
 * Copyright (C) 2022 LJH. All rights reserved.
-->
<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <!-- <a-button type="primary" @click="handleClear" :disabled="!hasPermission('sysOplog:clear')">
          清空日志
        </a-button> -->
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { usePermission } from '/@/hooks/web/usePermission';

  import { columns, searchFormSchema } from './opslog.data';
  import { getOpsLogs } from '/@/api/maint/logs';

  export default defineComponent({
    name: 'OplogManagement',
    components: { BasicTable },
    setup() {
      const { hasPermission } = usePermission();
      const [registerTable] = useTable({
        title: '操作日志',
        api: getOpsLogs,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: false,
        showIndexColumn: false,
        canResize: true,
        pagination: {
          pageSize: 20,
        },
      });

      // async function handleClear() {
      //   await clearOpLog();
      //   reload();
      // }

      return {
        registerTable,
        // handleClear,
        hasPermission,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-picker) {
    width: 100%;
  }
</style>
