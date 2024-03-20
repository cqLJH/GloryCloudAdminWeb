/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-11-16 15:51:51
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-19 14:50:41
 * @FilePath: \GloryCloudWeb\src\views\usr\role\role.data.ts
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

// 分类字典
import { dictList } from '@/utils/dictUtil';

export const columns: BasicColumn[] = [
  {
    title: '职位名称',
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
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'searchKey',
    label: '名称关键词',
    component: 'Input',
    componentProps: {
      placeholder: '请输入职位名称关键词',
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '职位名称',
    required: true,
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    field: 'category',
    label: '职位分类',
    required: true,
    component: 'Select',
    componentProps: {
      options: dictList('POSITION_CATEGORY'),
    },
    colProps: { span: 24 },
  },
  {
    field: 'orgId',
    label: '所属机构',
    component: 'TreeSelect',
    colProps: { span: 24 },
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
];
