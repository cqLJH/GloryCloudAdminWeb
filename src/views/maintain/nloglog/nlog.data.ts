/*
 * @Description:
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-04-23 15:44:52
 * @LastEditors: LJH
 * @LastEditTime: 2022-06-02 16:24:57
 * @FilePath: \GloryApp\src\views\maintain\nloglog\nlog.data.ts
 * Copyright (C) 2022 LJH. All rights reserved.
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '级别',
    dataIndex: 'level',
    width: 80,
  },
  {
    title: 'eventId_Id',
    dataIndex: 'properties.eventId_Id',
    customRender: ({ record }: any) => {
      return record.properties.eventId_Id;
    },
    width: 100,
  },
  {
    title: '请求地址',
    dataIndex: 'properties.queryUrl',
    customRender: ({ record }: any) => {
      return record.properties.queryUrl;
    },
    ellipsis: true,
    width: 200,
  },
  {
    title: '类型',
    dataIndex: 'properties.requestMethod',
    customRender: ({ record }: any) => {
      return record.properties.requestMethod;
    },
    ellipsis: true,
    width: 80,
  },
  {
    title: '请求内容',
    dataIndex: 'properties.queryContent',
    customRender: ({ record }: any) => {
      return record.properties.queryContent;
    },
    ellipsis: true,
    width: 200,
  },
  {
    title: '时间',
    dataIndex: 'date',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'level',
    label: '级别',
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
