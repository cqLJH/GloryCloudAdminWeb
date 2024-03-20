/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-11-15 18:00:12
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-11-16 15:36:12
 * @FilePath: \vue-vben-admin-main\src\api\sys\menu.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';

enum Api {
  GetMenuList = '/usr/api/menus/routers',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};
