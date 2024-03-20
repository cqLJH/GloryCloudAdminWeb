/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-11-16 15:51:51
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-19 15:05:37
 * @FilePath: \GloryCloudWeb\src\views\usr\org\org.data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
// 分类字典
import { dictList } from '@/utils/dictUtil';

export const columns: BasicColumn[] = [
  {
    title: '组织名称',
    dataIndex: 'fullName',
    align: 'left',
  },
  {
    title: '组织简称',
    dataIndex: 'simpleName',
  },
  {
    title: '分类',
    dataIndex: 'category',
    width: 100,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 60,
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
      placeholder: '请输入组织名称关键词',
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'parentId',
    label: '上级组织',
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
    field: 'fullName',
    label: '组织名称',
    component: 'Input',
    colProps: { span: 24 },
    required: true,
  },

  {
    field: 'simpleName',
    label: '组织简称',
    component: 'Input',
    colProps: { span: 24 },
    required: true,
  },
  {
    field: 'category',
    label: '组织分类',
    component: 'Select',
    colProps: { span: 24 },
    componentProps: {
      options: dictList('ORG_CATEGORY'),
    },
    required: true,
  },
  {
    field: 'sort',
    label: '排序',
    defaultValue: 0,
    colProps: { span: 24 },
    component: 'InputNumber',
    componentProps: { style: { width: '100%' } },
    required: true,
  },
  {
    label: '备注',
    field: 'tips',
    colProps: { span: 24 },
    component: 'InputTextArea',
  },
  {
    label: '指定主管', // 待完善
    field: 'directorId',
    component: 'Select',
    colProps: { span: 24 },
    slot: 'director',
  },
];
