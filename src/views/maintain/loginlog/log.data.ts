/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-04-21 21:06:43
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2024-01-04 09:50:11
 * @FilePath: \GloryApp\src\views\maintain\loginlog\log.data.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '账号名称',
    dataIndex: 'account',
    width: 100,
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: 180,
  },
  {
    title: 'IP地址',
    dataIndex: 'remoteIpAddress',
    width: 150,
  },
  {
    title: '地址',
    dataIndex: 'remoteIpAddressLocation',
    width: 100,
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
    width: 100,
  },
  {
    title: '设备',
    dataIndex: 'os',
    width: 100,
  },
  {
    title: '登录信息',
    dataIndex: 'message',
    width: 180,
  },
  {
    title: '状态码',
    dataIndex: 'statusCode',
    width: 100,
  },
  {
    title: '登录时间',
    dataIndex: 'createTime',
    width: 160,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'account',
    label: '账号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'device',
    label: '设备',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'beginTime',
    label: '开始时间',
    component: 'DatePicker',
    colProps: { span: 8 },
  },
  {
    field: 'endTime',
    label: '结束时间',
    component: 'DatePicker',
    colProps: { span: 8 },
  },
];
