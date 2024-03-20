/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-11-16 15:49:22
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2024-03-07 13:22:03
 * @FilePath: \GloryCloudWeb\src\api\usr\usr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-06-16 16:15:04
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-20 15:09:29
 * @FilePath: \GloryApp\src\api\usr\usr.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  // 用户接口
  GetUserList = '/usr/api/users',
  GetUserDetail = '/usr/api/users',
  AddUser = '/usr/api/users',
  DeleteUser = '/usr/api/users',
  UpdateUser = '/usr/api/users',
  SetRoles = '/usr/api/users',
  SetUserStatus = '/usr/api/users',
  GetBindList = '/auth/api/oauth2/bindList',
  UnBind = '/auth/api/oauth2/unBind',
}
// 获取用户分页列表
export const getUserList = (params?: any) => defHttp.get<any>({ url: Api.GetUserList, params });
// 增加用户
export const addUser = (params: any) => defHttp.post({ url: Api.AddUser, params });
// 删除用户
export const deleteUser = (id: number) => defHttp.delete({ url: `${Api.DeleteUser}/${id}` });
// 更新用户
export const updateUser = (params: any, id: number) =>
  defHttp.put({ url: `${Api.UpdateUser}/${id}`, params });

// 更新个人基础信息
export const updateUserInfo = (params: any, id: number) =>
  defHttp.put({ url: `${Api.UpdateUser}/${id}/info`, params });

// 重置密码
export const resetUserPwd = (id: number) =>
  defHttp.put({ url: `${Api.UpdateUser}/${id}/resetUserPwd` });

// 修改密码
export const changePassword = (params: any) =>
  defHttp.put({ url: `${Api.UpdateUser}/password`, params });

// 设置用户角色
export const grantUserRole = (id: number, params: any) =>
  defHttp.put({ url: `${Api.SetRoles}/${id}/roles`, params });

/**
 * 获取用户详情
 * @param id 用户id
 * @returns
 */
export const getUserDetail = (id: number) =>
  defHttp.get<any>({ url: `${Api.GetUserDetail}/${id}/detail` });

/**
 * 设置用户状态
 * @param id
 * @param params
 * @returns
 */
export const setUserStatus = (id: number, params: any) =>
  defHttp.put({ url: `${Api.SetUserStatus}/${id}/status`, params });

export const submitForm = (params: any, id: number) => {
  return id ? updateUser(params, id) : addUser(params);
};

/**
 * 获取绑定账号信息
 * @returns
 */
export const getBindList = () => defHttp.get<any>({ url: Api.GetBindList });

/**
 * 解绑
 * @param id 绑定id
 * @returns
 */
export const unBind = (id: number) => defHttp.delete({ url: `${Api.UnBind}/${id}` });
