/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-06-13 16:06:16
 * @LastEditors: LJH
 * @LastEditTime: 2022-06-13 17:53:19
 * @FilePath: \GloryApp\src\api\usr\model\menuModel.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type MenuSearchPagedParams = BasicPageParams & {
  name: string;
  account: string;
};

export interface Menu {
  id: 0;
  parentId: 0;
  name: string;
  levels: 0;
  type: 0;
  isMenuName: string;
  status: 0;
  statusName: string;
  ordinal: 0;
  url: string;
  path: string;
  icon: string;
  code: string;
  pCode: string;
  component: string;
  hidden: true;
  children: [string];
}

export interface MenuInput {
  code: string;
  component: string;
  hidden: boolean;
  icon: string;
  type: 1;
  isOpen: boolean;
  levels: 0;
  name: string;
  ordinal: 0;
  pCode: string;
  pCodes: string;
  status: 0;
  tips: string;
  url: string;
}

/**
 * @description: Get menu return value
 */
export type MenuPageListGetResultModel = BasicFetchResult<Menu>;
