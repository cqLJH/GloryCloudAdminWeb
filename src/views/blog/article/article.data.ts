/*
 * @Author: LJH 52238648+cqLJH@users.noreply.github.com
 * @Date: 2022-10-18 15:58:22
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-13 09:46:24
 * @FilePath: \GloryApp\src\views\blog\tags\tags.data.ts
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag, Switch } from 'ant-design-vue';
import { getTagsItem } from '/@/api/blog/tags';
import { getCategoryItem } from '/@/api/blog/category';
import { useMessage } from '/@/hooks/web/useMessage';
import { topAndFeatured } from '/@/api/blog/article';

export const columns: BasicColumn[] = [
  {
    title: '文章封面',
    dataIndex: 'articleCover',
    width: 140,
    key: 'articleCover',
  },
  {
    title: '标题',
    dataIndex: 'articleTitle',
  },
  {
    title: '分类',
    dataIndex: 'categoryName',
    customRender: ({ record }: any) => {
      return h(Tag, { color: '#2db7f5' }, () => record.categoryName);
    },
  },
  {
    title: '标签',
    dataIndex: 'tags',
    key: 'tags',
  },
  {
    title: '浏览量',
    width: 80,
    dataIndex: 'viewsCount',
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 80,
    key: 'type',
  },
  {
    title: '发布日期',
    dataIndex: 'createTime',
  },
  {
    title: '置顶',
    dataIndex: 'isTop',
    customRender: ({ record }: any) => {
      if (!Reflect.has(record, 'pendingTop')) {
        record.pendingTop = false;
      }
      return h(Switch, {
        checked: record.isTop,
        loading: record.pendingTop,
        onChange(checked: boolean) {
          record.pendingTop = true;
          const data = { isTop: checked, isFeatured: record.isFeatured };
          const { createMessage } = useMessage();
          topAndFeatured(record.id, data)
            .then(() => {
              record.isTop = checked;
              createMessage.success(`已修改`);
            })
            .catch(() => {
              // createMessage.error('修改角色状态失败');
            })
            .finally(() => {
              record.pendingTop = false;
            });
        },
      });
    },
  },
  {
    title: '推荐',
    dataIndex: 'isFeatured',
    customRender: ({ record }: any) => {
      if (!Reflect.has(record, 'pendingFeatured')) {
        record.pendingFeatured = false;
      }
      return h(Switch, {
        checked: record.isFeatured,
        loading: record.pendingFeatured,
        onChange(checked: boolean) {
          record.pendingFeatured = true;
          const data = { isFeatured: checked, isTop: record.isTop };
          const { createMessage } = useMessage();
          topAndFeatured(record.id, data)
            .then(() => {
              record.isFeatured = checked;
              createMessage.success(`已修改`);
            })
            .catch(() => {
              // createMessage.error('修改角色状态失败');
            })
            .finally(() => {
              record.pendingFeatured = false;
            });
        },
      });
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'articleTitle',
    label: '文章标题',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'type',
    label: '文章类型',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        {
          label: '原创',
          value: 1,
          key: '1',
        },
        {
          label: '转载',
          value: 2,
          key: '2',
        },
        {
          label: '翻译',
          value: 3,
          key: '2',
        },
      ],
    },
  },
  {
    field: 'categoryId',
    label: '文章分类',
    colProps: { span: 6 },
    component: 'ApiSelect',
    componentProps: {
      api: getCategoryItem,
    },
  },
  {
    field: 'tagsId',
    label: '标签',
    colProps: { span: 6 },
    component: 'ApiSelect',
    componentProps: {
      api: getTagsItem,
    },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'categoryId',
    label: '文章分类',
    component: 'ApiSelect',
    componentProps: {
      api: getCategoryItem,
      allowClear: false,
    },
    required: true,
  },
  {
    field: 'tagsId',
    label: '文章标签',
    component: 'ApiSelect',
    componentProps: {
      mode: 'multiple',
      api: getTagsItem,
      allowClear: false,
    },
    rules: [
      {
        required: true,
        type: 'array',
      },
    ],
  },
  {
    field: 'type',
    label: '文章类型',
    component: 'Select',
    defaultValue: 1,
    componentProps: {
      allowClear: false,
      options: [
        {
          label: '原创',
          value: 1,
          key: '1',
        },
        {
          label: '转载',
          value: 2,
          key: '2',
        },
        {
          label: '翻译',
          value: 3,
          key: '2',
        },
      ],
    },
    required: true,
  },
  {
    field: 'originalUrl',
    label: '原文地址',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => {
      return values.type != 1;
    },
  },
  {
    field: 'articleCover',
    label: '上传封面',
    component: 'Input',
    slot: 'articleCoverSlot',
  },
  {
    field: 'isTop',
    label: '置顶',
    component: 'Switch',
    defaultValue: false,
  },
  {
    field: 'isFeatured',
    label: '推荐',
    component: 'Switch',
    defaultValue: false,
  },
  {
    field: 'status',
    component: 'RadioGroup',
    label: '发布形式',
    defaultValue: 1,
    componentProps: {
      options: [
        {
          label: '公开',
          value: 1,
        },
        {
          label: '私密',
          value: 2,
        },
      ],
    },
  },
  {
    field: 'password',
    label: '访问密码',
    defaultValue: 0,
    component: 'Input',
    required: true,
    ifShow: ({ values }) => {
      return values.status == 2;
    },
  },
];
