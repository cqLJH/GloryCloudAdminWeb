/*
 * @Author: LJH 52238648+cqLJH@users.noreply.github.com
 * @Date: 2022-10-18 15:58:22
 * @LastEditors: LJH 52238648+cqLJH@users.noreply.github.com
 * @LastEditTime: 2022-10-19 09:12:37
 * @FilePath: \GloryApp\src\views\blog\tags\tags.data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const columns: BasicColumn[] = [
  {
    title: '标签名称',
    dataIndex: 'tagName',
    customRender: ({ record }: any) => {
      return h(Tag, { color: '#2db7f5' }, () => record.tagName);
    },
  },
  {
    title: '文章量',
    dataIndex: 'articleCount',
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'tagName',
    label: '标签名称',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'tagName',
    label: '标签名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'sort',
    label: '排序',
    defaultValue: 0,
    component: 'InputNumber',
    required: true,
  },
];
