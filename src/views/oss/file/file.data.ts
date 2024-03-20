/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-11-30 09:53:39
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-12 10:42:12
 * @FilePath: \GloryCloudWeb\src\views\oss\file\file.data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '文件名称',
    dataIndex: 'fileName',
    width: 120,
  },
  {
    title: '后缀',
    dataIndex: 'suffix',
    width: 60,
  },
  {
    title: '大小kb',
    dataIndex: 'sizeKb',
    width: 80,
  },
  {
    title: '储存位置',
    dataIndex: 'providerText',
    width: 80,
  },
  {
    title: '文件地址',
    dataIndex: 'url',
    width: 100,
  },
  {
    title: '上传者',
    dataIndex: 'createBy',
    width: 100,
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
    width: 100,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '文件名称',
    field: 'fileName',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '文件地址',
    field: 'url',
    component: 'Input',
    colProps: { span: 6 },
  },
];
