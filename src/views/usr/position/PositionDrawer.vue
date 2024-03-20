<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-03-22 20:35:29
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-19 14:55:28
 * @FilePath: \GloryApp\src\views\usr\role\RoleDrawer.vue
 * Copyright (C) 2022 LJH. All rights reserved.
-->
<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <div v-loading="treeLoading">
      <BasicForm layout="vertical" @register="registerForm" />
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { cloneDeep } from 'lodash-es';
  import { formSchema } from './position.data';
  import { submitForm } from '/@/api/usr/position';
  import { getOrgTree } from '/@/api/usr/org';

  /**
   * 声明Emits
   */
  const emit = defineEmits(['success', 'register']);
  const treeLoading = ref(true);
  const isUpdate = ref(true);
  const record = ref({});
  let rowId: number;

  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema, clearValidate }] =
    useForm({
      labelWidth: 90,
      schemas: formSchema,
      showActionButtonGroup: false,
    });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: true });
    record.value = cloneDeep(data.record);
    isUpdate.value = data.record.id ? true : false;
    rowId = data.record.id;

    // 加载组织树
    treeLoading.value = true;
    const treeData = await getOrgTree();
    treeLoading.value = false;
    setDrawerProps({ confirmLoading: false });

    updateSchema({
      field: 'orgId',
      componentProps: { treeData, treeDefaultExpandAll: true },
    });

    setFieldsValue({
      ...cloneDeep(data.record),
    });

    nextTick(() => clearValidate());
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增职位' : '编辑职位'));

  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });
      await submitForm(Object.assign(record.value, values), rowId);
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
