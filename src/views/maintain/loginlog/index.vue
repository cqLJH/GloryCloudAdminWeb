<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-04-21 21:06:16
 * @LastEditors: LJH
 * @LastEditTime: 2022-04-21 22:31:22
 * @FilePath: \GloryApp\src\views\maintain\loginlog\index.vue
 * Copyright (C) 2022 LJH. All rights reserved.
-->
<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <!-- <a-button type="primary" @click="handleClear" :disabled="!hasPermission('sysExlog:clear')">
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

  import { columns, searchFormSchema } from './log.data';
  import { getLoginLogs } from '/@/api/maint/logs';

  export default defineComponent({
    name: 'LoginLogsManagement',
    components: { BasicTable },
    setup() {
      const { hasPermission } = usePermission();
      const [registerTable, { reload }] = useTable({
        title: '登录日志',
        api: getLoginLogs,
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
          pageSize: 30,
        },
      });

      async function handleClear() {
        // await clearExLog();
        reload();
      }

      return {
        registerTable,
        handleClear,
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
