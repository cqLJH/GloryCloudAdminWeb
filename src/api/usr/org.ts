/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-06-16 14:23:26
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-15 22:59:01
 * @FilePath: \GloryApp\src\api\usr\Orgs.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  // 部门接口
  GetOrgPage = '/usr/api/org/page',
  AddOrg = '/usr/api/org',
  Tree = '/usr/api/org/tree',
  BatchDeleteOrg = '/usr/api/org',
  UpdateOrg = '/usr/api/org',
}

// 获取分页列表
export const getOrgPage = (params?: any) => defHttp.get<any>({ url: Api.GetOrgPage, params });

// 获取树列表
export const getOrgTree = (params?: any) => defHttp.get<any>({ url: Api.Tree, params });

// 增加
export const addOrg = (params: any) => defHttp.post({ url: Api.AddOrg, params });

// 删除
export const batchDelete = (params: any) =>
  defHttp.delete({ url: `${Api.BatchDeleteOrg}`, params });

// 更新
export const updateOrg = (params: any, id: number) =>
  defHttp.put({ url: `${Api.UpdateOrg}/${id}`, params });

export const submitForm = (params: any, id: number, mode: ErrorMessageMode = 'message') => {
  return id ? updateOrg(params, id) : addOrg(params);
};
