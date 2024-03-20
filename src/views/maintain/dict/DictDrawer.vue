<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-03-22 20:35:29
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-19 11:29:22
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
  import { ref, computed, unref } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { formSchema } from './dict.data';
  import { getRootList, submitForm } from '/@/api/maint/dict';
  import { object, string } from 'vue-types';
  import { useMessage } from '/@/hooks/web/useMessage';

  /**
   * 声明Emits
   */
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const treeLoading = ref(true);
  const getTitle = ref('');
  const record = ref({});

  let rowId: number;
  
  const { createMessage } = useMessage();
  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 90,
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: true });
    record.value = cloneDeep(data.record);
    rowId = data.record.id;
    isUpdate.value = data.record.id ? true : false;
    getTitle.value = isUpdate ? `新增${data.title}` : `编辑${data.title}`;

    /**
     * 初始化字典树
     */
    treeLoading.value = true;
    const children = await getRootList(data.record);
    treeLoading.value = false;
    setDrawerProps({ confirmLoading: false });
    let treeData = [{ dictLabel: '顶级', id: 0, children, parentId: 0 }];
    updateSchema({
      field: 'parentId',
      componentProps: { treeData },
    });

    setFieldsValue({
      ...cloneDeep(data.record),
    });
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      if (isUpdate.value && values.parentId == rowId) {
        createMessage.error('不能选择自身，请重新选择！');
        return;
      }
      setDrawerProps({ confirmLoading: true });
      await submitForm(Object.assign(record.value, values), rowId);
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
