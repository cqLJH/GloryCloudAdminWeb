<!--
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-11-15 18:00:12
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-11-30 15:11:35
 * @FilePath: \GloryCloudWeb\src\views\oss\file\Drawer5.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :isDetail="true"
    :title="fileData.fileName"
  >
    <vue-office-docx
      v-if="fileData.suffix == '.docx'"
      :src="fileData.url"
      style="height: 100vh"
      @rendered="renderedHandler"
      @error="errorHandler"
    />

    <vue-office-excel
      v-if="fileData.suffix == '.xlsx'"
      :src="fileData.url"
      style="height: 100vh"
      @rendered="renderedHandler"
      @error="errorHandler"
    />

    <vue-office-pdf
      v-if="fileData.suffix == '.pdf'"
      :src="fileData.url"
      style="height: 100vh"
      @rendered="renderedHandler"
      @error="errorHandler"
    />

    <!-- <template #titleToolbar> toolbar </template> -->
  </BasicDrawer>
</template>

<script lang="ts" name="fileDrawer" setup>
  import { ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useMessage } from '/@/hooks/web/useMessage';
  import VueOfficeDocx from '@vue-office/docx';
  import VueOfficeExcel from '@vue-office/excel';
  import VueOfficePdf from '@vue-office/pdf';
  import '@vue-office/docx/lib/index.css';
  import '@vue-office/excel/lib/index.css';

  const { createMessage } = useMessage();

  const fileData = ref({
    suffix: '',
    url: '',
    fileName: '详情',
  });

  const [registerDrawer, { setDrawerProps }] = useDrawerInner((data) => {
    fileData.value = data;
    console.log(fileData.fileName);
    setDrawerProps({ confirmLoading: true });
  });

  // 文件渲染完成
  const renderedHandler = () => {
    setDrawerProps({ confirmLoading: false });
  };

  // 文件渲染失败
  const errorHandler = () => {
    setDrawerProps({ confirmLoading: false });
    createMessage.error('文档渲染失败！');
  };
</script>

<style lang="less" scoped>
  :deep(.vben-basic-drawer__detail) {
    position: fixed !important;
  }
</style>
