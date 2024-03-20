<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-06-16 16:28:39
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-20 17:53:27
 * @FilePath: \GloryApp\src\views\usr\user\UserDrawer.vue
 * Copyright (C) 2022 LJH. All rights reserved.
-->
<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="800"
    @ok="handleSubmit"
  >
    <Tabs :bordered="false" v-model:activeKey="tabKey" v-loading="treeLoading">
      <TabPane key="0" tab="基础信息" forceRender>
        <BasicForm @register="registerForm" layout="vertical" />
      </TabPane>
      <TabPane key="1" tab="更多信息" forceRender>
        <BasicForm @register="moreRegisterForm" layout="vertical" />
      </TabPane>
    </Tabs>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { Card, TabPane, Tabs } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';

  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { getOrgTree } from '/@/api/usr/org';

  import { formSchema, moreFormSchema } from './user.data';
  import { submitForm, getUserDetail } from '/@/api/usr/usr';
  import { getPositionSelectList } from '/@/api/usr/position';
  /**
   * 声明Emits
   */
  const emit = defineEmits(['success', 'register']);
  const treeLoading = ref(true);
  const isUpdate = ref(true);
  const record = ref({});

  const tabKey = ref('0');

  let rowId: number;

  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    wrapperCol: { span: 22 },
    showActionButtonGroup: false,
  });

  /**
   *更多信息表单
   */
  const moreForm = useForm({
    labelWidth: 100,
    schemas: moreFormSchema,
    wrapperCol: { span: 22 },
    showActionButtonGroup: false,
  });
  const moreRegisterForm = moreForm[0];
  const moreValidate = moreForm[1].validate;
  const moreSetFieldsValue = moreForm[1].setFieldsValue;
  const moreResetFields = moreForm[1].resetFields;

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    moreResetFields();
    tabKey.value = '0';
    rowId = undefined;
    record.value = {};
    setLoading(true);

    isUpdate.value = data.id ? true : false;

    // 获取用户详情
    if (isUpdate.value) {
      rowId = data.id;
      record.value = await getUserDetail(data.id);
    }

    // 加载组织树
    const treeData = await getOrgTree();
    setLoading(false);
    updateSchema({
      field: 'orgId',
      componentProps: ({ formModel, formActionType }) => {
        return {
          treeData,
          treeDefaultExpandAll: true,
          fieldNames: {
            label: 'fullName',
            key: 'id',
            value: 'id',
          },
          getPopupContainer: () => document.body,
          onChange: async (e: any) => {
            let position = [];
            if (e === undefined) {
              position = [];
            } else {
              try {
                setLoading(true);
                position = await getPositionSelectList({ orgId: e });
              } finally {
                setLoading(false);
              }
            }

            formModel.positionId = position.some((c) => c.value === formModel.positionId)
              ? formModel.positionId
              : undefined;
            updateSchema({
              field: 'positionId',
              componentProps: {
                options: position,
              },
            });
          },
        };
      },
    });

    setFieldsValue({
      ...cloneDeep(record.value),
    });
    moreSetFieldsValue({
      ...cloneDeep(record.value),
    });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));

  /**
   * 提交表单
   */
  async function handleSubmit() {
    try {
      const values = await validate();
      const moreValues = await moreValidate();

      setDrawerProps({ confirmLoading: true });
      await submitForm(Object.assign(record.value, values, moreValues), rowId);
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }

  function setLoading(type: boolean) {
    treeLoading.value = type;
    setDrawerProps({ confirmLoading: type });
  }
</script>
