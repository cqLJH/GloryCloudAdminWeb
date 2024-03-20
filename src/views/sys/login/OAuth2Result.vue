<!--
 * @Author: LJH 424122999@qq.com
 * @Date: 2024-03-04 08:58:31
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2024-03-08 17:08:24
 * @FilePath: \GloryCloudWeb\src\views\sys\login\OAuth2Login.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="fixed h-full w-full flex flex-col justify-center items-center text-4xl">
    <Result :status="status" :title="title"></Result>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Result } from 'ant-design-vue';

  const { currentRoute } = useRouter();
  const status = ref('info');
  const title = ref('授权中...');
  const route = currentRoute.value;

  if (route.query?.token) {
    status.value = 'success';
    title.value = '授权成功跳转中....';
  } else {
    status.value = 'error';
    title.value = '授权失败！';
  }
  setTimeout(function () {
    window.opener.postMessage({ token: route.query?.token, message: route.query?.message }, '*');
    // window.close();
  }, 0);
</script>
