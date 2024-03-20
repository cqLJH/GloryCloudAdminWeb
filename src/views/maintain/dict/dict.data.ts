/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-11-30 09:53:39
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-19 13:37:16
 * @FilePath: \GloryCloudWeb\src\views\oss\file\file.data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '字典名称',
    dataIndex: 'dictLabel',
  },
  {
    title: '字典值',
    dataIndex: 'dictValue',
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '字典名称',
    field: 'searchKey',
    component: 'Input',
    componentProps: {
      placeholder: '请输入字典名称关键词',
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'parentId',
    label: '上级字典',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        children: 'children',
        label: 'dictLabel',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    colProps: { span: 24 },
    required: true,
  },
  {
    label: '字典名称',
    component: 'Input',
    field: 'dictLabel',
    colProps: { span: 24 },
    required: true,
  },
  {
    label: '字典值',
    component: 'Input',
    field: 'dictValue',
    colProps: { span: 24 },
    required: true,
  },
  {
    label: '排序',
    field: 'sort',
    component: 'InputNumber',
    defaultValue: 0,
    colProps: { span: 24 },
    required: true,
    componentProps: { style: { width: '100%' } },
  },
];
