<!--
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-12-21 15:53:26
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2024-03-08 18:06:47
 * @FilePath: \GloryCloudWeb\src\views\sys\usercenter\userTab\accountBind.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <List item-layout="horizontal" :data-source="bindData" v-loading="loading">
    <template #renderItem="{ item }">
      <ListItem>
        <ListItemMeta class="list-item-meta">
          <template #title>{{ item.title }}</template>
          <template #description>
            <span class="security-list-description">{{
              item.bindStatus == 1 ? '已绑定' : item.description
            }}</span>
            <span v-if="item.value"> : </span>
            <span class="security-list-value">{{ item.value }}</span>
          </template>
          <template #avatar>
            <Icon
              v-if="item.type === 'password'"
              class="bind-icon"
              icon="ant-design:insurance-outlined"
              :style="{ color: '#1890FF' }"
            />
            <Icon
              v-if="item.type === 'QQ'"
              class="bind-icon"
              icon="ant-design:qq-outlined"
              :style="{ color: '#1890FF' }"
            />
            <Icon
              v-if="item.type === 'WeChat'"
              class="bind-icon"
              icon="ant-design:wechat-outlined"
              :style="{ color: '#1AAD19' }"
            />
            <Icon
              v-if="item.type === 'Github'"
              class="bind-icon"
              icon="ant-design:github-filled"
              :style="{ color: '#000' }"
            />
            <Icon
              style="width: 40px"
              v-if="item.type === 'Gitee'"
              icon="ant-design:google-circle-filled"
              class="bind-icon"
              :style="{ color: 'red' }"
            />
          </template>
        </ListItemMeta>
        <template #actions>
          <a v-if="item.type == 'password'" @click="changePassword">修改</a>
          <a v-else-if="!item.value" @click="bindCommon(item.type)">去绑定</a>
          <a v-else @click="unBindCommon(item.id)">解绑</a>
        </template>
      </ListItem>
    </template>
  </List>
</template>

<script setup>
  import { ref, unref, h } from 'vue';
  import { List, ListItem, ListItemMeta } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Icon from '@/components/Icon/Icon.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { getToken } from '/@/utils/auth';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getBindList, unBind } from '/@/api/usr/usr';
  import { useI18n } from '@/hooks/web/useI18n';

  const { createMessage, createErrorModal, createConfirm } = useMessage();
  const glob = useGlobSetting();
  const { t } = useI18n();

  //windows对象，用于关闭窗口事件
  const windowsIndex = ref('');
  //窗口监听事件
  const receiveMessage = ref('');

  const loading = ref(false);

  const go = useGo();
  const updatePasswordRef = ref();
  // 获取绑定的情况
  const bindData = [
    /*{ title: '密保手机', description: '已绑定手机', value: '138****8293', type: 'phone', bindStatus: 1 },
  	{ title: '密保邮箱', description: '未绑定邮箱', value: '', type: 'email', bindStatus: 0 },
  	{ title: '实名状态', description: '未实名', value: '', type: 'userReal', bindStatus: 0 },*/
    {
      title: '密码',
      description: '',
      value: '',
      type: 'password',
    },
    { title: '绑定QQ', description: '未绑定', value: '', type: 'QQ', bindStatus: 0, id: 0 },
    { title: '绑定微信', description: '未绑定', value: '', type: 'WeChat', bindStatus: 0, id: 0 },
    { title: '绑定Github', description: '未绑定', value: '', type: 'Github', bindStatus: 0, id: 0 },
    { title: '绑定Gitee', description: '未绑定', value: '', type: 'Gitee', bindStatus: 0, id: 0 },
  ];

  /**
   * 修改密码
   */
  const changePassword = () => {
    go('/usercenter/changePassword');
  };

  /**
   * 绑定
   */
  const bindCommon = (key) => {
    onThirdBind(key);
  };

  /**
   * 解绑
   */
  async function unBindCommon(id) {
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: '确认要解绑此授权？',
      onOk: async () => {
        await unBind(id);
        createMessage.success('解绑成功');
        loadData();
      },
    });
  }

  //第三方账号绑定
  function onThirdBind(provider) {
    var url = `${
      glob.apiUrl
    }/auth/api/oauth2/signinBind?provider=${provider}&token=${getToken()}&redirectUrl=${
      glob.webUrl
    }/bindResult&gwUrl=${glob.apiUrl}`;

    if (unref(windowsIndex)) {
      //确保只有一个窗口
      windowsIndex.value.close();
      //确保只有一个监听
      window.removeEventListener('message', unref(receiveMessage), false);
    }
    var iHeight = 400;
    var iWidth = 700;
    var iTop = (window.screen.height - 30 - iHeight) / 2; //获得窗口的垂直位置;
    var iLeft = (window.screen.width - 10 - iWidth) / 2; //获得窗口的水平位置;
    windowsIndex.value = window.open(
      url,
      `login ${provider}`,
      `height=${iHeight}, width=${iWidth}, top=${iTop}, left=${iLeft}, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`,
    );

    window.addEventListener('message', unref(receiveMessage), false);
  }

  receiveMessage.value = function (event) {
    // 确保消息来源是我们预期的窗口
    if (event.source !== windowsIndex.value) return;
    var result = event.data;
    switch (result.code) {
      case '200':
        createMessage.success('绑定成功');
        loadData();
        break;
      case '400':
        createErrorModal({ title: '绑定失败', content: result.message });
        break;
      default:
        break;
    }
    window.removeEventListener('message', unref(receiveMessage), false);
    windowsIndex.value = '';
  };

  loadData();
  async function loadData() {
    loading.value = true;
    const data = await getBindList();
    loading.value = false;
    bindData.forEach((e) => {
      e.bindStatus = 0;
      e.value = '';
      e.id = 0;
      data.forEach((o) => {
        if (e.type == o.identityType) {
          e.bindStatus = 1;
          e.value = o.identifier;
          e.id = o.id;
        }
      });
    });
  }
</script>

<style scoped>
  :deep(.list-item-meta) {
    align-items: center;
  }

  :deep(.bind-icon) {
    padding-left: 10px !important;
    font-size: 30px !important;
  }
</style>
