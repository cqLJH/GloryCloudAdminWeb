/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-04-23 15:19:37
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2024-01-04 14:47:10
 * @FilePath: \GloryApp\src\views\maintain\opslog\opslog.data.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const columns: BasicColumn[] = [
  {
    title: '账号名称',
    dataIndex: 'account',
    width: 100,
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: 100,
  },
  {
    title: 'IP地址',
    dataIndex: 'remoteIpAddress',
    width: 100,
  },
  {
    title: '地址',
    dataIndex: 'remoteIpAddressLocation',
    width: 100,
  },
  {
    title: '日志名称',
    dataIndex: 'logName',
    width: 150,
  },
  {
    title: '是否成功',
    dataIndex: 'success',
    width: 80,
    customRender: ({ record }: any) => {
      const enable = record.succeed === 'true' ? 1 : 0;
      const color = enable ? 'green' : 'red';
      const text = enable ? '成功' : '失败';
      return h(Tag, { color: color }, () => text);
    },
  },
  // {
  //   title: '浏览器',
  //   dataIndex: 'browser',
  //   width: 100,
  // },
  // {
  //   title: '操作系统',
  //   dataIndex: 'os',
  //   width: 100,
  // },
  // {
  //   title: '请求地址',
  //   dataIndex: 'url',
  //   width: 200,
  // },
  {
    title: '类名',
    dataIndex: 'className',
    width: 200,
  },
  {
    title: '方法名',
    dataIndex: 'method',
    width: 150,
  },
  // {
  //   title: '请求方式',
  //   dataIndex: 'reqMethod',
  //   width: 80,
  // },
  {
    title: '请求参数',
    dataIndex: 'message',
    width: 200,
  },
  // {
  //   title: '返回结果',
  //   dataIndex: 'result',
  //   width: 300,
  // },
  {
    title: '耗时',
    dataIndex: 'requestDuration',
    width: 50,
  },
  {
    title: '操作时间',
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
    field: 'method',
    label: '方法名',
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
