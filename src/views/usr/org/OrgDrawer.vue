<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-05-30 11:37:06
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-19 15:36:16
 * @FilePath: \GloryApp\src\views\usr\dept\DeptModal.vue
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
  import { ref, reactive, toRefs, computed, unref } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './org.data';
  import { Loading } from '/@/components/Loading';
  import { getOrgTree, submitForm } from '/@/api/usr/org';
  import { useMessage } from '/@/hooks/web/useMessage';
  /**
   * 声明Emits
   */
  const emit = defineEmits(['success', 'register']);
  const treeLoading = ref(true);
  const record = ref({});
  const isUpdate = ref(true);

  let rowId: number;

  const { createMessage } = useMessage();

  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: true });
    record.value = cloneDeep(data.record);
    isUpdate.value = data.record.id ? true : false;

    // 加载组织树
    treeLoading.value = true;
    const children = await getOrgTree();
    treeLoading.value = false;
    setDrawerProps({ confirmLoading: false });
    let treeData = [{ fullName: '顶级', id: 0, children, parentId: 0 }];
    updateSchema({
      field: 'parentId',
      componentProps: { treeData, treeDefaultExpandAll: true },
    });

    rowId = data.record.id;
    setFieldsValue({
      ...cloneDeep(data.record),
    });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增组织' : '编辑组织'));

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
