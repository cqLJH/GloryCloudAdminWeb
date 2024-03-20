/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-06-13 22:02:01
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-20 16:16:15
 * @FilePath: \GloryApp\src\api\usr\Position.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  // 岗位接口
  GetPage = '/usr/api/position/page',
  GetSelectList = '/usr/api/position/select',
  Add = '/usr/api/position',
  Delete = '/usr/api/position',
  Update = '/usr/api/position',
}

// 获取角色分页列表
export const getPositionPage = (params?: any) => defHttp.get<any>({ url: Api.GetPage, params });

/**
 * 获取下拉框数据
 * @returns
 */
export const getPositionSelectList = (params?: any) =>
  defHttp.get<any>({ url: Api.GetSelectList, params });

// 增加
export const addPosition = (params: any) => defHttp.post({ url: Api.Add, params });

// 删除
export const batchDeletePosition = (params: any) =>
  defHttp.delete({ url: `${Api.Delete}`, params });

// 更新
export const updatePosition = (params: any, id: number) =>
  defHttp.put({ url: `${Api.Update}/${id}`, params });

export const submitForm = (params: any, id: number) => {
  return id ? updatePosition(params, id) : addPosition(params);
};
