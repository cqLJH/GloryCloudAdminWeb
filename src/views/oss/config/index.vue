<!--
 * @Author: LJH 52238648+cqLJH@users.noreply.github.com
 * @Date: 2022-11-03 14:11:11
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-19 14:34:59
 * @FilePath: \GloryApp\src\views\blog\config\index.vue
 * @Description:
-->
<template>
  <PageWrapper title="云储存信息" v-loading="dataLoading">
    <Tabs v-model:activeKey="activeKey" style="padding: 0 10px; background-color: #fff">
      <TabPane key="1" tab="配置">
        <BasicForm @register="registerForm" />
      </TabPane>
      <template #rightExtra>
        <a-button
          type="primary"
          @click="handleSubmit"
          :loading="loading"
          v-if="hasPermission('sysOSS:updateConfig')"
        >
          保存
        </a-button>
      </template>
    </Tabs>
  </PageWrapper>
</template>

<script lang="ts" setup name="ossConfigIndex">
  import { ref } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { omit } from 'lodash-es';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { updateConfig, getConfig } from '/@/api/oss/oss';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { hasPermission } = usePermission();
  const { createMessage } = useMessage();
  const activeKey = ref('1');
  const loading = ref(false);
  const dataLoading = ref(false);

  const isLocalStorage = (type: number) => type === 0;
  const isAliYunOSS = (type: number) => type === 1;
  const isQCloudOSS = (type: number) => type === 2;
  const isQiNiuKoDo = (type: number) => type === 3;

  // 网站信息
  const ossSchemas: FormSchema[] = [
    {
      field: 'storageType',
      label: '存储方式',
      component: 'RadioGroup',
      defaultValue: 0,
      colProps: { span: 24 },
      componentProps: {
        options: [
          {
            label: '本地存储',
            value: 0,
          },
          {
            label: '阿里云OSS',
            value: 1,
          },
          {
            label: '腾讯云COS',
            value: 2,
          },
          {
            label: '七牛云KoDo',
            value: 3,
          },
        ],
      },
    },
    {
      field: 'path',
      component: 'Input',
      label: '存储路径',
      defaultValue: '/upload/',
      helpMessage: [
        '请使用路径，如"/upload/doc/"，路径前后都要加“/”（七牛云为key/value结构不支持）',
      ],
      colProps: { span: 12 },
      required: true,
    },

    {
      field: 'fileTypes',
      component: 'Input',
      label: '文件后缀类型',
      defaultValue: 'gif,jpg,jpeg,png,bmp,xls,xlsx,doc,pdf,mp4,WebM,Ogv',
      helpMessage: ['使用小写逗号分割'],
      colProps: { span: 12 },
      required: true,
    },
    {
      field: 'maxSize',
      component: 'InputNumber',
      label: '文件最大大小',
      defaultValue: 20,
      helpMessage: ['M（兆），一般10M即可，超过网络容易缓慢'],
      colProps: { span: 12 },
      required: true,
      componentProps: {
        min: 1,
        precision: 0,
        addonAfter: 'M',
      },
    },
    {
      field: 'enableMd5',
      component: 'RadioGroup',
      label: 'MD5校验',
      colProps: { span: 12 },
      defaultValue: true,
      componentProps: {
        options: [
          {
            label: '启用',
            value: true,
          },
          {
            label: '禁用',
            value: false,
          },
        ],
      },
    },
    {
      field: 'apiUrl',
      component: 'Input',
      label: 'Api地址',
      defaultValue: 'http://oss.icqcore.com/',
      helpMessage: ['文件访问地址 如：http://oss.icqcore.com/'],
      colProps: { span: 12 },
      required: true,
      ifShow: ({ values }) => isLocalStorage(values.storageType),
    },
    {
      field: 'physicalPath',
      component: 'Input',
      label: '物理路径',
      defaultValue: '',
      helpMessage: ['服务器存放文件的物理地址'],
      colProps: { span: 12 },
      required: true,
      ifShow: ({ values }) => isLocalStorage(values.storageType),
    },
    {
      field: 'bucketBindUrl',
      component: 'Input',
      label: '云存储绑定域名',
      colProps: { span: 12 },
      helpMessage: ['独立绑定的域名最好，也可以用云存储提供的多级域名'],
      required: true,
      ifShow: ({ values }) => !isLocalStorage(values.storageType),
    },
    {
      field: 'accessKeyId',
      component: 'Input',
      label: '云存储授权账户',
      colProps: { span: 12 },
      required: true,
      ifShow: ({ values }) => !isLocalStorage(values.storageType),
    },
    {
      field: 'accessKeySecret',
      component: 'Input',
      label: '云存储授权密钥',
      colProps: { span: 12 },
      required: true,
      ifShow: ({ values }) => !isLocalStorage(values.storageType),
    },
    {
      field: 'aliYunEndpoint',
      component: 'Input',
      label: '阿里云节点',
      colProps: { span: 12 },
      required: true,
      ifShow: ({ values }) => isAliYunOSS(values.storageType),
    },
    {
      field: 'aliYunBucketName',
      component: 'Input',
      label: '阿里云桶名称',
      colProps: { span: 12 },
      required: true,
      ifShow: ({ values }) => isAliYunOSS(values.storageType),
    },
    {
      field: 'tencentAccountId',
      component: 'Input',
      label: '腾讯云账户标识',
      colProps: { span: 12 },
      required: true,
      ifShow: ({ values }) => isQCloudOSS(values.storageType),
    },
    {
      field: 'tencentCosRegion',
      component: 'Input',
      label: '腾讯云桶地域',
      colProps: { span: 12 },
      required: true,
      ifShow: ({ values }) => isQCloudOSS(values.storageType),
    },
    {
      field: 'tencentBucketName',
      component: 'Input',
      label: '腾讯云桶名称',
      colProps: { span: 12 },
      required: true,
      ifShow: ({ values }) => isQCloudOSS(values.storageType),
    },
    {
      field: 'qiNiuBucketName',
      component: 'Input',
      label: '七牛云桶名称',
      colProps: { span: 12 },
      required: true,
      ifShow: ({ values }) => isQiNiuKoDo(values.storageType),
    },
  ];
  const [registerForm, { setFieldsValue, validate }] = useForm({
    labelWidth: 160,
    schemas: ossSchemas,
    showActionButtonGroup: false,
  });

  // 加载配置
  async function loadData() {
    try {
      dataLoading.value = true;
      const data = await getConfig();
      setFieldsValue({
        ...data,
      });
    } finally {
      dataLoading.value = false;
    }
  }

  loadData();

  async function handleSubmit() {
    try {
      const values = await validate();
      loading.value = true;
      await updateConfig(values);
      createMessage.success('操作成功');
    } finally {
      loading.value = false;
    }
  }
</script>

<style scoped></style>
