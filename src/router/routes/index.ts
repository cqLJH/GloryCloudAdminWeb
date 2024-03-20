/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-11-15 18:00:12
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2024-03-04 16:58:37
 * @FilePath: \GloryCloudWeb\src\router\routes\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { AppRouteRecordRaw, AppRouteModule } from '@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '@/router/routes/basic';

import { mainOutRoutes } from './mainOut';
import { PageEnum } from '@/enums/pageEnum';
import { t } from '@/hooks/web/useI18n';

// import.meta.glob() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob('./modules/**/*.ts', { eager: true });
const routeModuleList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = (modules as Recordable)[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};
export const Oauth2ResultRoute: AppRouteRecordRaw = {
  path: '/oauth2Result',
  name: 'Oauth2Result',
  component: () => import('@/views/sys/login/OAuth2Result.vue'),
  meta: {
    title: '第三方登录',
    ignoreAuth: true,
  },
};

export const OAutn2BindResultRoute: AppRouteRecordRaw = {
  path: '/bindResult',
  name: 'BindResult',
  component: () => import('@/views/sys/usercenter/BindResult.vue'),
  meta: {
    title: '账号绑定',
    ignoreAuth: true,
  },
};

// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [
  LoginRoute,
  Oauth2ResultRoute,
  OAutn2BindResultRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
];
