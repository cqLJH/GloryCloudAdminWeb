<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-06-16 16:28:39
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-19 17:26:29
 * @FilePath: \GloryApp\src\views\usr\user\OrgTree.vue
 * Copyright (C) 2022 LJH. All rights reserved.
-->
<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <Card :bordered="false" :loading="treeLoading" style="height: 100%">
      <Tree
        v-if="treeData.length > 0"
        :tree-data="treeData"
        :field-names="treeFieldNames"
        @select="handleSelect"
        defaultExpandAll
      >
      </Tree>
      <Empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE" />
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, unref, nextTick } from 'vue';
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree/index';
  import { getOrgTree } from '/@/api/usr/org';
  import { Tree, Row, Col, Empty, Card } from 'ant-design-vue';
  /**
   * 声明Emits
   */
  const emit = defineEmits(['select']);
  const treeData = ref<TreeItem[]>([]);
  const treeAction = ref<Nullable<TreeActionType>>(null);
  const treeFieldNames = { children: 'children', title: 'fullName', key: 'id' };

  const treeLoading = ref(true);

  async function loadTreeData() {
    treeData.value = await getOrgTree();
    treeLoading.value = false;
    nextTick(() => {
      unref(treeAction)?.filterByLevel(2);
    });
  }

  function handleSelect(keys, obj) {
    if (obj == undefined) return;
    else emit('select', keys[0], obj.selectedNodes[0]);
  }

  onMounted(() => {
    loadTreeData();
  });
</script>
