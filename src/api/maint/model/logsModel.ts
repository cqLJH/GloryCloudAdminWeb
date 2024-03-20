/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-04-21 21:27:25
 * @LastEditors: LJH
 * @LastEditTime: 2022-04-26 21:33:45
 * @FilePath: \GloryApp\src\api\maint\model\logsModel.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
export type logsSearchPagedParams = BasicPageParams & {
  beginTime: string;
  endTime: string;
  account: string;
  method: string;
  level: string;
};

/**
 * @description:登录日志
 */
export interface LoginLogDto {
  id: string;
  device: string;
  message: string;
  succeed: boolean;
  statusCode: number;
  userId: number;
  account: string;
  userName: string;
  remoteIpAddress: string;
  createTime: string;
}

/**
 * @description: 操作日志
 */
export interface OpsLogDto {
  id: string;
  className: string;
  logName: string;
  logType: string;
  message: string;
  method: string;
  succeed: boolean;
  device: string;
  userId: number;
  statusCode: number;
  requestDuration: number;
  account: string;
  userName: string;
  remoteIpAddress: string;
  createTime: string;
}

/**
 * @description: Nlog日志
 */
export interface NLogDto {
  id: string;
  exception: string;
  level: string;
  logger: string;
  message: string;
  processID: string;
  processName: boolean;
  properties: Properties;
  threadID: number;
  threadName: number;
  date: string;
}
interface Properties {
  baseDir: string;
  connectionId: string;
  controller: string;
  eventId: string;
  eventId_Id: string;
  eventId_Name: string;
  formContent: string;
  method: string;
  queryUrl: string;
  remoteIpAddress: string;
  requestMethod: string;
  traceIdentifier: string;
}

export type LoginLogPageListGetResultModel = BasicFetchResult<LoginLogDto>;

export type opsLogPageListGetResultModel = BasicFetchResult<OpsLogDto>;

export type nLogPageListGetResultModel = BasicFetchResult<NLogDto>;
