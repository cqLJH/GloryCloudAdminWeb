/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2024-02-29 10:30:55
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2024-03-08 18:05:35
 * @FilePath: \GloryCloudWeb\src\hooks\system\useThirdLogin.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref } from 'vue';
import { useGlobSetting } from '/@/hooks/setting';
import { useUserStore } from '/@/store/modules/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';

const userStore = useUserStore();

export function useThirdLogin() {
  const glob = useGlobSetting();

  const { t } = useI18n();

  //windows对象，用于关闭窗口事件
  const windowsIndex = ref(null);

  const { createErrorModal, notification } = useMessage();

  //第三方类型
  const thirdType = ref('');
  //第三方登录相关信息
  const thirdLoginInfo = ref<any>({});
  //状态
  const thirdLoginState = ref(false);

  //第三方登录
  function onThirdLogin(provider) {
    var url = `${glob.apiUrl}/auth/api/oauth2/signin?provider=${provider}&redirectUrl=${glob.webUrl}/oauth2Result`;

    var iHeight = 400;
    var iWidth = 700;
    var iTop = (window.screen.height - 30 - iHeight) / 2; //获得窗口的垂直位置;
    var iLeft = (window.screen.width - 10 - iWidth) / 2; //获得窗口的水平位置;

    windowsIndex.value = window.open(
      url,
      `login ${provider}`,
      `height=${iHeight}, width=${iWidth}, top=${iTop}, left=${iLeft}, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`,
    );
    thirdType.value = provider;
    thirdLoginInfo.value = {};
    thirdLoginState.value = false;

    let receiveMessage = function (event) {
      // 确保消息来源是我们预期的窗口
      if (event.source !== windowsIndex.value) return;

      var result = event.data;
      if (result.token) {
        thirdLogin(result.token);
      } else {
        createErrorModal({ title: '授权失败！', content: result.message });
        windowsIndex.value?.close();
      }
    };

    window.addEventListener('message', receiveMessage, false);
  }

  async function thirdLogin(token) {
    const userInfo = await userStore.thirdLogin(token);
    windowsIndex.value?.close();

    notification.success({
      message: t('sys.login.loginSuccessTitle'),
      description: `${t('sys.login.loginSuccessDesc')}: ${userInfo?.realName}`,
      duration: 3,
    });
  }

  //返回数据和方法
  return {
    onThirdLogin,
  };
}
