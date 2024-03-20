<!--
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-12-21 15:53:26
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-22 15:40:06
 * @FilePath: \GloryCloudWeb\src\views\sys\usercenter\userTab\accountBasic.vue
-->
<template>
  <BasicForm @register="registerForm" @submit="handleSubmit">
    <template #accountText="{ model, field }">
      {{ model[field] }}
    </template>
  </BasicForm>
</template>

<script lang="ts" setup name="AccountBasic">
  import { ref, computed, unref, nextTick } from 'vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { useUserStore } from '/@/store/modules/user';

  // 分类字典
  import { dictList } from '@/utils/dictUtil';

  import { updateUserInfo } from '/@/api/usr/usr';

  const { createMessage } = useMessage();

  const formSchema: FormSchema[] = [
    {
      field: 'id',
      component: 'Input',
      ifShow: false,
    },
    {
      field: 'account',
      label: '账号',
      component: 'Input',
      slot: 'accountText',
      colProps: { span: 24 },
    },
    {
      field: 'name',
      label: '姓名',
      component: 'Input',
      required: true,
      componentProps: {
        placeholder: '请输入姓名',
      },
      colProps: { span: 24 },
    },
    {
      field: 'phone',
      label: '手机号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机号码',
      },
      colProps: { span: 24 },
    },

    {
      field: 'nickName',
      label: '昵称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入昵称',
      },
      colProps: { span: 24 },
    },
    {
      field: 'gender',
      label: '性别',
      component: 'RadioGroup',
      defaultValue: '1',
      colProps: { span: 24 },
      componentProps: {
        options: dictList('GENDER'),
      },
    },
    {
      field: 'birthday',
      label: '出生日期',
      component: 'DatePicker',
      colProps: { span: 24 },
      componentProps: { style: { width: '50%' } },
    },
    {
      field: 'email',
      label: '邮箱',
      component: 'Input',
      componentProps: {
        placeholder: '请输入邮箱',
      },
      colProps: { span: 24 },
    },
  ];

  /**
   * 本地个人信息
   */
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;

  const [registerForm, { setFieldsValue, validate, setProps }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    wrapperCol: { span: 15 },
    showActionButtonGroup: true,
    actionColOptions: {
      span: 24,
    },
    showResetButton: false,
    submitButtonOptions: {
      text: '保存基础信息',
    },
  });

  nextTick(() => {
    setFieldsValue({
      ...cloneDeep(Object.assign({ id: userInfo.userId }, userInfo.profile)),
    });
  });

  /**
   * 提交表单
   */
  async function handleSubmit() {
    try {
      const values = await validate();
      console.log(values);
      setProps({ submitButtonOptions: { loading: true } });
      await updateUserInfo(values, values.id);
      createMessage.success('已更新');
      // 更新前端缓存本地个人信息
      userInfo.profile = cloneDeep(Object.assign(userInfo.profile, values));
      userStore.setUserInfo(userInfo);
    } finally {
      setProps({ submitButtonOptions: { loading: false } });
    }
  }
</script>
