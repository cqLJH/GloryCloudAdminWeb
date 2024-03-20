/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-06-16 16:15:04
 * @LastEditors: LJH 52238648+cqLJH@users.noreply.github.com
 * @LastEditTime: 2022-11-02 13:15:13
 * @FilePath: \GloryApp\src\api\usr\usr.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  // 文章接口
  GetList = '/blog/api/articles/list',
  AddArticle = '/blog/api/articles/add',
  UpdateArticle = '/blog/api/articles/save',
  DeleteArticle = '/blog/api/articles',
  TopAndFeatured = '/blog/api/articles/topAndFeatured',
  GetDetails = '/blog/api/articles/admin',
}
// 获取分页列表
export const getList = (params?: any) => defHttp.get<any>({ url: Api.GetList, params });

// 获取编辑详情
export const getDetails = (id: any) => defHttp.get<any>({ url: `${Api.GetDetails}/${id}` });

// 新增文章
export const addArticle = (params: any) => defHttp.post({ url: Api.AddArticle, params });

// 删除文章
export const deleteArticle = (id: number) => defHttp.delete({ url: `${Api.DeleteArticle}/${id}` });

// 更新文章
export const updateArticle = (id: number, params: any) =>
  defHttp.put({ url: `${Api.UpdateArticle}/${id}`, params });

// 更新指定或推荐
export const topAndFeatured = (id: number, params: any) =>
  defHttp.put({ url: `${Api.TopAndFeatured}/${id}`, params });
