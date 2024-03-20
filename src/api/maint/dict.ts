/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-03-22 20:35:29
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-15 14:21:19
 * @FilePath: \GloryApp\src\api\maint\dict.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  GetList = '/maint/api/dicts/list',
  GetRootList = '/maint/api/dicts/rootlist',
  GetPage = '/maint/api/dicts/page',
  GetTree = '/maint/api/dicts/tree',
  Delete = '/maint/api/dicts',
  AddDict = '/maint/api/dicts',
  UpdateDict = '/maint/api/dicts',
}

/**
 * @description: 获取字典树
 */
export const getPage = (params?: any) => defHttp.get<any>({ url: Api.GetPage, params });

/**
 * @description: 获取字典分页列表
 */
export const getDictTree = (params?: any) => defHttp.get<any>({ url: Api.GetTree, params });

/**
 * @description: 获取字典列表
 */
export const getList = (params?: any) => defHttp.get<any>({ url: Api.GetList, params });

/**
 * @description: 获取顶级字典列表
 */
export const getRootList = (params?: any) => defHttp.get<any>({ url: Api.GetRootList, params });
/**
 * @description: 删除字典
 */
export const deleteDict = (id: number) => defHttp.delete({ url: `${Api.Delete}/${id}` });

/**
 * @description: 新增字典
 */
export const addDict = (params: any, mode: ErrorMessageMode = 'message') =>
  defHttp.post(
    { url: Api.AddDict, params },
    {
      errorMessageMode: mode,
    },
  );

/**
 * @description: 修改字典
 */
export const updateDict = (params: any, id: number, mode: ErrorMessageMode = 'message') =>
  defHttp.put(
    { url: `${Api.UpdateDict}/${id}`, params },
    {
      errorMessageMode: mode,
    },
  );

export const submitForm = (params: any, id: number, mode: ErrorMessageMode = 'message') => {
  return id ? updateDict(params, id) : addDict(params);
};
