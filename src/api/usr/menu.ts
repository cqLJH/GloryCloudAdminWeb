/*
 * @Description: 菜单接口
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-06-13 16:03:47
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-21 11:16:29
 * @FilePath: \GloryApp\src\api\usr\menu.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { defHttp } from '/@/utils/http/axios';
import { MenuPageListGetResultModel, MenuSearchPagedParams, MenuInput } from './model/menuModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  GetMenuList = '/usr/api/menus',
  GetMenuSelectTree = '/usr/api/menus/selectTree',
  DeleteMenu = '/usr/api/menus',
  AddMenu = '/usr/api/menus',
  UpdateMenu = '/usr/api/menus',
}

/**
 * @description: 获取菜单树列表
 */
export const getMenuList = (params?: MenuSearchPagedParams) =>
  defHttp.get<MenuPageListGetResultModel>({ url: Api.GetMenuList, params });

/**
 * @description: 获取菜单树列表
 */
export const getMenuSelectTree = () =>
  defHttp.get<MenuPageListGetResultModel>({ url: Api.GetMenuSelectTree });

/**
 * @description: 删除菜单
 */
export const deleteMenu = (id: number) => defHttp.delete({ url: `${Api.DeleteMenu}/${id}` });

/**
 * @description: 新增菜单
 */
export const addMenu = (params: MenuInput, mode: ErrorMessageMode = 'message') =>
  defHttp.post(
    { url: Api.AddMenu, params },
    {
      errorMessageMode: mode,
    },
  );

/**
 * @description: 修改菜单
 */
export const updateMenu = (params: MenuInput, id: number, mode: ErrorMessageMode = 'modal') =>
  defHttp.put(
    { url: `${Api.UpdateMenu}/${id}`, params },
    {
      errorMessageMode: mode,
    },
  );

export const submitForm = (params: any, id: number, mode: ErrorMessageMode = 'message') => {
  return id ? updateMenu(params, id) : addMenu(params);
};
