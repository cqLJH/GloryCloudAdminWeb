<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-06-16 16:28:39
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-19 16:51:55
 * @FilePath: \GloryApp\src\views\usr\user\OrgTree.vue
 * Copyright (C) 2022 LJH. All rights reserved.
-->
<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      title="组织列表"
      toolbar
      search
      :loading="treeLoading"
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="{ key: 'id', title: 'fullName' }"
      @select="handleSelect"
      ref="treeAction"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, unref, nextTick } from 'vue';
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree/index';
  import { getOrgTree } from '/@/api/usr/org';

  /**
   * 声明Emits
   */
  const emit = defineEmits(['select']);
  const treeData = ref<TreeItem[]>([]);
  const treeAction = ref<Nullable<TreeActionType>>(null);

  const treeLoading = ref(true);

  const appendNodeByKey = (parentKey: string, values) => {
    unref(treeAction).insertNodeByKey({
      parentKey: parentKey,
      node: values,
      // 往后插入
      push: 'push',
      // 往前插入
      // push:'unshift'
    });
  };

  const updateNodeByKey = (key: string, values) => {
    unref(treeAction).updateNodeByKey(key, values);
  };

  const deleteNodeByKey = (key: string) => {
    unref(treeAction).deleteNodeByKey(key);
  };

  async function fetch() {
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
    fetch();
  });
</script>
