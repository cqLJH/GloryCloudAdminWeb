/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-06-16 16:15:04
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-13 09:45:43
 * @FilePath: \GloryApp\src\api\usr\usr.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  // 分类接口
  GetList = '/blog/api/categorys/list',
  Add = '/blog/api/categorys',
  Delete = '/blog/api/categorys',
  Update = '/blog/api/categorys',
  Item = '/blog/api/categorys/item',
}
// 获取分页列表
export const getList = (params?: any) => defHttp.get<any>({ url: Api.GetList, params });
// 增加
export const addCategory = (params: any) => defHttp.post({ url: Api.Add, params });
// 删除
export const deleteCategory = (id: number) => defHttp.delete({ url: `${Api.Delete}/${id}` });
// 更新
export const updateCategory = (id: number, params: any) =>
  defHttp.put({ url: `${Api.Update}/${id}`, params });

// 获取下拉框列表
export const getCategoryItem = () => defHttp.get({ url: Api.Item });
