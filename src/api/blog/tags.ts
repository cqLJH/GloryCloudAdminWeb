/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-06-16 16:15:04
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-13 09:36:49
 * @FilePath: \GloryApp\src\api\usr\usr.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  // 标签接口
  GetList = '/blog/api/tags/list',
  AddTags = '/blog/api/tags',
  DeleteTags = '/blog/api/tags',
  UpdateTags = '/blog/api/tags',
  Item = '/blog/api/tags/item',
}
// 获取分页列表
export const getList = (params?: any) => defHttp.get<any>({ url: Api.GetList, params });
// 增加
export const addTags = (params: any) => defHttp.post({ url: Api.AddTags, params });
// 删除
export const deleteTags = (id: number) => defHttp.delete({ url: `${Api.DeleteTags}/${id}` });
// 更新
export const updateTags = (id: number, params: any) =>
  defHttp.put({ url: `${Api.UpdateTags}/${id}`, params });

// 获取下拉框列表
export const getTagsItem = () => defHttp.get({ url: Api.Item });
