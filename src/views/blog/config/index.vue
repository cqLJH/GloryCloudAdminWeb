<!--
 * @Author: LJH 52238648+cqLJH@users.noreply.github.com
 * @Date: 2022-11-03 14:11:11
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-13 16:50:28
 * @FilePath: \GloryApp\src\views\blog\config\index.vue
 * @Description:
-->
<template>
  <PageWrapper title="博客站点信息配置" v-loading="loading">
    <Tabs v-model:activeKey="activeKey" style="padding: 0 10px; background-color: #fff">
      <TabPane key="1" tab="网站信息" forceRender>
        <BasicForm @register="registerWebsiteForm" autoFocusFirstItem />
      </TabPane>
      <TabPane key="2" tab="社交信息" forceRender>
        <Alert message="空白默认不显示" type="info" banner show-icon style="margin-bottom: 10px" />
        <BasicForm @register="socialRegisterForm" />
      </TabPane>
      <TabPane key="3" tab="其它设置" forceRender>
        <BasicForm @register="otherRegisterForm" />
      </TabPane>
      <template #rightExtra>
        <a-button
          type="primary"
          @click="handleSubmit"
          :loading="loading"
          v-if="hasPermission('sysMenu:add')"
          >保存</a-button
        >
      </template>
    </Tabs>
  </PageWrapper>
</template>

<script lang="ts" setup name="blogConfig">
  import { ref, computed } from 'vue';
  import { Tabs, TabPane, Alert } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { omit } from 'lodash-es';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { uploadApi } from '/@/api/oss/oss';
  import { getConfig, updateConfig } from '/@/api/blog/config';
  import { getToken } from '/@/utils/auth';
  import { any, object } from 'vue-types';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { hasPermission } = usePermission();
  const { createMessage } = useMessage();
  const activeKey = ref('1');
  const loading = ref(false);
  let websiteData = {};
  const tokenHeader = { Authorization: getToken() };

  // 网站信息
  const websiteSchemas: FormSchema[] = [
    {
      field: 'authorAvatar',
      label: '博主头像',
      colProps: { span: 8 },
      component: 'ImageUpload',
      required: true,
      componentProps: {
        api: uploadApi,
        accept: ['png', 'jpeg', 'jpg'],
        maxNumber: 1,
        headers: tokenHeader,
      },
    },
    {
      field: 'logo',
      label: '网站logo',
      colProps: { span: 8 },
      component: 'ImageUpload',
      required: true,
      componentProps: {
        api: uploadApi,
        accept: ['png', 'jpeg', 'jpg'],
        maxNumber: 1,
        headers: tokenHeader,
      },
    },
    {
      field: 'favicon',
      label: 'favicon',
      colProps: { span: 8 },
      component: 'ImageUpload',
      required: true,
      componentProps: {
        api: uploadApi,
        accept: ['png', 'jpeg', 'jpg', 'ico'],
        maxNumber: 1,
        headers: tokenHeader,
      },
    },
    {
      field: 'name',
      label: '网站名称',
      component: 'Input',
      defaultValue: '',
      colProps: { span: 12 },
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      field: 'englishName',
      label: '网站英文名称',
      component: 'Input',
      defaultValue: '',

      colProps: { span: 12 },
    },
    {
      field: 'author',
      label: '网站作者',
      component: 'Input',
      defaultValue: '',
      colProps: { span: 12 },
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      field: 'websiteTitle',
      label: '网页标题',
      component: 'Input',
      defaultValue: '',
      colProps: { span: 12 },
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      field: 'authorIntro',
      label: '作者介绍',
      component: 'InputTextArea',
      defaultValue: '',
      colProps: { span: 12 },
    },
    {
      field: 'multiLanguage',
      label: '多语言',
      component: 'Switch',
      defaultValue: true,
      componentProps: {
        checkedChildren: '开',
        unCheckedChildren: '关',
      },
    },
    {
      field: 'websiteCreateTime',
      label: '网站创建日期',
      component: 'DatePicker',
      colProps: { span: 12 },
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      field: 'notice',
      label: '网站公告',
      component: 'InputTextArea',
      defaultValue: '',
      colProps: { span: 12 },
    },
    {
      field: 'beianNumber',
      label: '工信部备案号',
      component: 'Input',
      defaultValue: '',
      colProps: { span: 12 },
    },
    {
      field: 'gongAnBeianNumber',
      label: '公安部备案号',
      component: 'Input',
      defaultValue: '',
      colProps: { span: 12 },
    },
    {
      field: 'isQQLogin',
      label: 'QQ登录',
      component: 'Switch',
      defaultValue: false,
      componentProps: {
        checkedChildren: '开启',
        unCheckedChildren: '关闭',
      },
    },
  ];
  const websiteForm = useForm({
    labelWidth: 100,
    schemas: websiteSchemas,
    showActionButtonGroup: false,
  });
  const registerWebsiteForm = websiteForm[0];
  const websiteValidate = websiteForm[1].validate;
  const websiteSetFieldsValue = websiteForm[1].setFieldsValue;

  // 社交信息
  const socialSchemas: FormSchema[] = [
    {
      field: 'github',
      label: 'Github',
      component: 'Input',
      defaultValue: '',
      colProps: { span: 12 },
    },
    {
      field: 'gitee',
      label: 'Gitee',
      component: 'Input',
      defaultValue: '',
      colProps: { span: 12 },
    },
    {
      field: 'qq',
      label: 'QQ',
      component: 'Input',
      defaultValue: '',
      colProps: { span: 12 },
    },
    {
      field: 'weChat',
      label: 'WeChat',
      component: 'Input',
      defaultValue: '',
      colProps: { span: 12 },
    },
    {
      field: 'weibo',
      label: '微博',
      component: 'Input',
      defaultValue: '',
      colProps: { span: 12 },
    },
    {
      field: 'zhihu',
      label: '知乎',
      component: 'Input',
      defaultValue: '',
      colProps: { span: 12 },
    },
    {
      field: 'juejin',
      label: '掘金',
      component: 'Input',
      defaultValue: '',
      colProps: { span: 12 },
    },
    {
      field: 'twitter',
      label: 'Twitter',
      component: 'Input',
      defaultValue: '',
      colProps: { span: 12 },
    },
    {
      field: 'stackoverflow',
      label: 'Stackoverflow',
      component: 'Input',
      defaultValue: '',
      colProps: { span: 12 },
    },
  ];
  const socialForm = useForm({
    labelWidth: 100,
    schemas: socialSchemas,
    showActionButtonGroup: false,
  });
  const socialRegisterForm = socialForm[0];
  const socialValidate = socialForm[1].validate;
  const socialSetFieldsValue = socialForm[1].setFieldsValue;

  // 其它设置
  const otherSchemas: FormSchema[] = [
    {
      field: 'userAvatar',
      label: '用户头像',
      component: 'ImageUpload',
      colProps: { span: 12 },
      required: true,
      componentProps: {
        api: uploadApi,
        accept: ['png', 'jpeg', 'jpg'],
        maxNumber: 1,
        headers: tokenHeader,
      },
    },
    {
      field: 'touristAvatar',
      label: '游客头像',
      component: 'ImageUpload',
      colProps: { span: 12 },
      required: true,
      componentProps: {
        api: uploadApi,
        accept: ['png', 'jpeg', 'jpg'],
        maxNumber: 1,
        headers: tokenHeader,
      },
    },
    {
      field: 'isEmailNotice',
      component: 'Switch',
      label: '邮箱通知',
      colProps: { span: 24 },
      defaultValue: false,
      componentProps: {
        checkedChildren: '开',
        unCheckedChildren: '关',
      },
    },
    {
      field: 'isCommentReview',
      component: 'Switch',
      label: '评论审核',
      colProps: { span: 24 },
      defaultValue: false,
      componentProps: {
        checkedChildren: '开',
        unCheckedChildren: '关',
      },
    },
    {
      field: 'isReward',
      component: 'Switch',
      label: '打赏状态',
      defaultValue: false,
      colProps: { span: 24 },
      componentProps: {
        checkedChildren: '开',
        unCheckedChildren: '关',
        onChange: (e, v) => {
          console.log('打赏状态====>:', e, v);
        },
      },
    },
    {
      field: 'weiXinQRCode',
      label: '微信收款码',
      colProps: { span: 12 },
      component: 'ImageUpload',
      componentProps: {
        api: uploadApi,
        accept: ['png', 'jpeg', 'jpg'],
        maxNumber: 1,
        headers: tokenHeader,
      },
      required: true,
      ifShow: ({ values }) => values.IsReward,
    },
    {
      field: 'alipayQRCode',
      label: '支付宝收款码',
      colProps: { span: 12 },
      component: 'ImageUpload',
      componentProps: {
        api: uploadApi,
        accept: ['png', 'jpeg', 'jpg'],
        maxNumber: 1,
        headers: tokenHeader,
      },
      required: true,
      ifShow: ({ values }) => values.IsReward,
    },
  ];
  const otherForm = useForm({
    labelWidth: 100,
    schemas: otherSchemas,
    showActionButtonGroup: false,
  });
  const otherRegisterForm = otherForm[0];
  const otherValidate = otherForm[1].validate;
  const otherSetFieldsValue = otherForm[1].setFieldsValue;

  // 加载配置
  async function loadData() {
    try {
      loading.value = true;
      const data = await getConfig();
      websiteData = data;
      console.log(websiteData);
      websiteSetFieldsValue({
        ...data,
      });

      socialSetFieldsValue({
        ...data,
      });

      otherSetFieldsValue({
        ...data,
      });
    } finally {
      loading.value = false;
    }
  }

  loadData();

  async function handleSubmit() {
    try {
      switch (activeKey.value) {
        case '1':
          const websiteValues = await websiteValidate();
          websiteData = Object.assign(websiteData, websiteValues);
          break;
        case '2':
          const socialValues = await socialValidate();
          websiteData = Object.assign(websiteData, socialValues);
          break;
        case '3':
          const otherValues = await otherValidate();
          websiteData = Object.assign(websiteData, otherValues);
          break;
      }
      // const websiteValues = await websiteValidate();
      // const socialValues = await socialValidate();
      // const otherValues = await otherValidate();

      // websiteData = Object.assign(websiteData, websiteValues, socialValues, otherValues);

      loading.value = true;
      await updateConfig(websiteData);
      createMessage.success('操作成功');
    } finally {
      loading.value = false;
    }
  }
</script>

<style scoped></style>
