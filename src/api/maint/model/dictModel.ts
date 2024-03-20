/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-03-17 20:08:38
 * @LastEditors: LJH
 * @LastEditTime: 2022-04-06 19:43:05
 * @FilePath: \GloryApp\src\api\maint\model\dictModel.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type DictSearchPagedParams = BasicPageParams & {
  name: string;
  account: string;
};

export interface DictItem {
  account: string;
  avatar: string;
  birthday: string;
  deptId?: number;
  deptName: string;
  email: string;
  name: string;
  password: string;
  phone: string;
  roleIds: string;
  roleNames: string;
  sex?: number;
  sexName: string;
  status?: number;
  statusName: string;
}

export interface DictInput {
  code: string;
  name: string;
  remark: string;
  sort: number;
  status: string;
}

export type DictPageListGetResultModel = BasicFetchResult<DictItem>;
