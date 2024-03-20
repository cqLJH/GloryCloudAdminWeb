/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-11-16 15:51:51
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-19 13:36:11
 * @FilePath: \GloryCloudWeb\src\views\usr\role\role.data.ts
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

// 分类字典
import { dictList } from '@/utils/dictUtil';

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '分类',
    dataIndex: 'category',
    width: 100,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 50,
  },
  {
    title: '备注',
    dataIndex: 'tips',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'searchKey',
    label: '名称关键词',
    component: 'Input',
    componentProps: {
      placeholder: '请输入角色名称关键词',
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    required: true,
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    field: 'category',
    label: '角色分类',
    required: true,
    component: 'Select',
    componentProps: {
      options: dictList('ROLE_CATEGORY'),
    },
    colProps: { span: 24 },
  },
  {
    field: 'orgId',
    label: '所属机构',
    component: 'TreeSelect',
    colProps: { span: 24 },
    ifShow: ({ values }) => values.category == 'ORG',
    componentProps: {
      fieldNames: {
        label: 'fullName',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'sort',
    label: '排序',
    component: 'InputNumber',
    defaultValue: 0,
    required: true,
    componentProps: { style: { width: '100%' } },
  },
  {
    label: '备注',
    field: 'tips',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
];
