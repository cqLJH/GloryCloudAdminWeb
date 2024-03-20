<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-04-23 15:44:52
 * @LastEditors: LJH
 * @LastEditTime: 2022-06-02 15:47:43
 * @FilePath: \GloryApp\src\views\maintain\nloglog\index.vue
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

  import { columns, searchFormSchema } from './nlog.data';
  import { getNlogLogs } from '/@/api/maint/logs';

  export default defineComponent({
    name: 'ExlogManagement',
    components: { BasicTable },
    setup() {
      const { hasPermission } = usePermission();
      const [registerTable] = useTable({
        title: 'Nlog日志',
        api: getNlogLogs,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        striped: true,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: true,
        pagination: {
          pageSize: 20,
        },
      });

      // async function handleClear() {
      //   await clearExLog();
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
