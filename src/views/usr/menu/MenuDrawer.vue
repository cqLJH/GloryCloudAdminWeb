<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-03-22 20:35:29
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-21 13:33:45
 * @FilePath: \GloryApp\src\views\usr\menu\MenuDrawer.vue
 * Copyright (C) 2022 LJH. All rights reserved.
-->
<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <div v-loading="treeLoading">
      <BasicForm @register="registerForm" />
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { getMenuList, getMenuSelectTree, submitForm } from '/@/api/usr/menu';

  /**
   * 声明Emits
   */
  const emit = defineEmits(['success', 'register']);

  const record = ref({});
  const isUpdate = ref(true);
  const isButton = (type) => type === 3;
  const treeLoading = ref(true);
  const getTitle = ref('新增菜单');

  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: true });
    isUpdate.value = data.isUpdate;
    record.value = cloneDeep(data.record);

    getTitle.value =
      record.value.type == 3
        ? !isUpdate.value
          ? '新增按钮'
          : '编辑按钮'
        : !isUpdate.value
        ? '新增菜单'
        : '编辑菜单';
    updateSchema({
      field: 'title',
      label: isButton(record.value.type) ? '按钮/权限' : '菜单名称',
    });

    // 加载菜单树
    treeLoading.value = true;
    const children = await getMenuSelectTree();
    treeLoading.value = false;
    setDrawerProps({ confirmLoading: false });

    let treeData = [{ title: '顶级', id: 0, children, parentId: 0 }];
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
      setDrawerProps({ confirmLoading: true });
      await submitForm(values, values.id);
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
