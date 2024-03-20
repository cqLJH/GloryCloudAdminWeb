<!--
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-12-21 15:53:26
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-25 12:21:11
 * @FilePath: \GloryCloudWeb\src\views\sys\usercenter\userTab\shortcutSetting.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <!-- <a-form
    ref="formRef"
    :model="formData"
    v-bind="layout"
    :label-col="{ ...layout.labelCol, offset: 0 }"
    :wrapper-col="{ ...layout.wrapperCol, offset: 0 }"
  >
    <a-form-item label="选择菜单：">
      <menuTreeSelect ref="menuTreeSelectRef" :resultData="true" />
    </a-form-item>
    <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 4 }">
      <a-button type="primary" :loading="submitLoading" @click="onSubmit">保存</a-button>
    </a-form-item>
  </a-form> -->
  </div>
</template>

<script setup name="shortcutSetting">
  // import userCenterApi from '@/api/sys/userCenterApi';
  // import { onMounted } from 'vue';
  // import menuTreeSelect from '@/components/TreeSelect/menuTreeSelect.vue';

  // const formRef = ref();
  // let formData = ref({});
  // const menuTreeSelectRef = ref();
  // const submitLoading = ref(false);

  // onMounted(() => {
  //   // 进来后执行查询
  //   getUserLoginWorkbench();
  // });
  // const getUserLoginWorkbench = () => {
  //   userCenterApi.userLoginWorkbench().then((data) => {
  //     // 设置组件回显
  //     menuTreeSelectRef.value.setSelectData(JSON.parse(data).shortcut);
  //   });
  // };

  // // 验证并提交数据
  // const onSubmit = () => {
  //   const selectMenu = menuTreeSelectRef.value.getSelectData();
  //   const workbenchData = {
  //     shortcut: selectMenu,
  //   };
  //   formData.value.workbenchData = JSON.stringify(workbenchData);
  //   submitLoading.value = true;
  //   userCenterApi
  //     .userUpdateUserWorkbench(formData.value)
  //     .then(() => {})
  //     .finally(() => {
  //       submitLoading.value = false;
  //     });
  // };
  // const layout = {
  //   labelCol: {
  //     span: 4,
  //   },
  //   wrapperCol: {
  //     span: 12,
  //   },
  // };
</script>
