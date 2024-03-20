/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-04-21 21:13:53
 * @LastEditors: LJH
 * @LastEditTime: 2022-04-23 15:59:25
 * @FilePath: \GloryApp\src\api\maint\logs.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { defHttp } from '/@/utils/http/axios';
import {
  LoginLogPageListGetResultModel,
  opsLogPageListGetResultModel,
  nLogPageListGetResultModel,
  logsSearchPagedParams,
} from './model/logsModel';
enum Api {
  GetLoginLogs = '/maint/api/loginlogs',
  GetOpsLogs = '/maint/api/opslogs',
  GetNlogLogs = '/maint/api/nloglogs',
}

/**
 * @description: 查询登录日志列表
 */
export const getLoginLogs = (params: logsSearchPagedParams) =>
  defHttp.get<LoginLogPageListGetResultModel>({ url: Api.GetLoginLogs, params });

/**
 * @description: 查询操作日志列表
 */
export const getOpsLogs = (params: logsSearchPagedParams) =>
  defHttp.get<opsLogPageListGetResultModel>({ url: Api.GetOpsLogs, params });

/**
 * @description: 查询Nlog日志列表
 */
export const getNlogLogs = (params: logsSearchPagedParams) =>
  defHttp.get<nLogPageListGetResultModel>({ url: Api.GetNlogLogs, params });
