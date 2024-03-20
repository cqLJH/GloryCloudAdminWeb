/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-06-13 22:02:01
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2024-03-07 18:29:58
 * @FilePath: \GloryApp\src\api\usr\role.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  // 角色接口
  GetRoleList = '/usr/api/roles',
  AddRole = '/usr/api/roles',
  DeleteRole = '/usr/api/roles',
  UpdateRole = '/usr/api/roles',
  RoleOwnMenuList = '/usr/api/menus',
  RoleOwnOrgList = '/usr/api/ownOrg',
  GrantRoleMenu = '/usr/api/grantMenu',
  GrantRoleData = '/usr/api/roles/',
  GetRoleListByIds = '/usr/api/roles/getListByIds',
}

// 获取角色分页列表
export const getRoleList = (params?: any) => defHttp.get<any>({ url: Api.GetRoleList, params });
// 增加角色
export const addRole = (params: any) => defHttp.post({ url: Api.AddRole, params });

// 批量删除角色
export const batchDeleteRole = (params: any) =>
  defHttp.delete({ url: `${Api.DeleteRole}`, params });

// 更新角色
export const updateRole = (params: any, roleId: number) =>
  defHttp.put({ url: `${Api.UpdateRole}/${roleId}`, params });

// 获取角色拥有菜单列表
export const ownMenuList = (roleId: number) =>
  defHttp.get<any>({ url: `${Api.RoleOwnMenuList}/${roleId}/menutree` });

// 授权角色菜单
export const grantRoleMenu = (roleId: number, permissons: any) =>
  defHttp.put({ url: `${Api.GrantRoleData}/${roleId}/permissons`, data: permissons });

export const submitForm = (params: any, id: number) => {
  return id ? updateRole(params, id) : addRole(params);
};

// 根据角色id获取集合
export const getRoleListByIds = (params: any) =>
  defHttp.post({ url: Api.GetRoleListByIds, params });

// 获取角色下的用户
export const getRoleOwnUser = (roleId: number) =>
  defHttp.get<any>({ url: `${Api.GetRoleList}/${roleId}/ownUser` });

/**
 * 根据用户ids获取用户名称
 * @returns
 */
export const userListByIds = (params: any) =>
  defHttp.post<any>({ url: `${Api.GetRoleList}/userListByIds`, data: params });

// 分页获取用户列表
export const userSelectorPaged = (params: any) =>
  defHttp.get<any>({ url: `${Api.GetRoleList}/userSelectorPaged`, params });

// 给角色授权用户
export const grantUser = (roleId: number, params: any) =>
  defHttp.put({ url: `${Api.GetRoleList}/${roleId}/grantUser`, params });
