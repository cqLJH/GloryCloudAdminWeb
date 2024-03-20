/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-12-22 10:59:46
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-22 17:12:00
 * @FilePath: \GloryCloudWeb\src\router\routes\modules\usercenter.ts
 */
import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const UserCenter: AppRouteModule = {
  path: '/usercenter',
  name: 'usercenter',
  component: LAYOUT,
  redirect: '/usercenter/index',
  meta: {
    icon: 'ant-design:user-outlined',
    title: '个人中心',
    hideMenu: true,
    orderNo: 100000,
  },
  children: [
    {
      path: 'index',
      name: 'UserCenterPage',
      component: () => import('/@/views/sys/usercenter/index.vue'),
      meta: {
        title: '个人中心',
        icon: 'ant-design:user-outlined',
        hideMenu: true,
        ignoreKeepAlive: true,
      },
    },
    {
      path: 'changePassword',
      name: 'ChangePassword',
      component: () => import('@/views/sys/password/index.vue'),
      meta: {
        title: t('routes.demo.system.password'),
        hideMenu: true,
        ignoreKeepAlive: true,
      },
    },
  ],
};

export default UserCenter;
