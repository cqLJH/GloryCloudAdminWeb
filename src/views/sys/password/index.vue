<!--
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-12-22 17:09:44
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-25 10:11:21
 * @FilePath: \GloryCloudWeb\src\views\sys\password\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <PageWrapper title="修改当前用户密码" content="修改成功后会自动退出当前登录！">
    <div class="py-8 bg-white flex flex-col justify-center items-center" v-loading="loading">
      <BasicForm @register="register" />
      <div class="flex justify-center">
        <a-button @click="resetFields"> 重置 </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit" :loading="loading">
          确认
        </a-button>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '@/components/Page';
  import { BasicForm, useForm } from '@/components/Form';
  import { changePassword } from '/@/api/usr/usr';
  import { formSchema } from './pwd.data';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';

  defineOptions({ name: 'ChangePassword' });

  const { createMessage } = useMessage();
  /**
   * 本地个人信息
   */
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;

  const loading = ref(false);
  const [register, { validate, resetFields }] = useForm({
    size: 'large',
    baseColProps: { span: 24 },
    labelWidth: 100,
    showActionButtonGroup: false,
    schemas: formSchema,
  });

  async function handleSubmit() {
    try {
      loading.value = true;
      const values = await validate();
      const { passwordOld, passwordNew } = values;
      await changePassword(values);
      createMessage.success('修改成功，即将退出');
      await userStore.logout(true);
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }
</script>
