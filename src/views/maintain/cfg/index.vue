<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-06-02 16:42:34
 * @LastEditors: LJH
 * @LastEditTime: 2022-06-02 17:28:14
 * @FilePath: \GloryApp\src\views\maintain\cfg\index.vue
 * Copyright (C) 2022 LJH. All rights reserved.
-->
<template>
  <div style="background-color: #fff">
    <PageWrapper>
      <Tabs v-model:activeKey="activeKey">
        <TabPane key="1" tab="Tab 1">Content of Tab Pane 1</TabPane>
        <TabPane key="2" tab="Tab 2" force-render>Content of Tab Pane 2</TabPane>
        <TabPane key="3" tab="Tab 3">Content of Tab Pane 3</TabPane>
      </Tabs>
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Tabs, TabPane } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  export default defineComponent({
    components: {
      Tabs,
      TabPane,
      PageWrapper,
    },
    setup() {
      return {
        activeKey: ref('1'),
      };
    },
  });
</script>
