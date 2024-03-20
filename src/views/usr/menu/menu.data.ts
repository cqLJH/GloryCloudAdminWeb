import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import Icon from '@/components/Icon/Icon.vue';

export const columns: BasicColumn[] = [
  {
    title: '菜单名称',
    dataIndex: 'title',
    width: 250,
    customRender: ({ record }: any) => {
      return h('div', [h(Icon, { icon: record.icon }), record.title]);
    },
    align: 'left',
  },

  {
    title: '路由',
    dataIndex: 'path',
    customRender: ({ record }: any) => {
      return isMenu(record.type) ? record.path : '--';
    },
  },
  {
    title: '组件',
    dataIndex: 'component',
    customRender: ({ record }: any) => {
      return isMenu(record.type) ? record.component : '--';
    },
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
    customRender: ({ record }: any) => {
      return isButton(record.type) ? record.permission : '--';
    },
    width: 160,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 100,
    customRender: ({ record }: any) => {
      const type = record.type;
      if (~~type === 1) return h(Tag, { color: 'gold' }, () => '目录');
      if (~~type === 2) return h(Tag, { color: 'purple' }, () => '菜单');
      if (~~type === 3) return h(Tag, { color: 'blue' }, () => '按钮');
    },
  },
  {
    title: '是否隐藏',
    dataIndex: 'hidden',
    width: 100,
    customRender: ({ record }: any) => {
      const hideMenu: boolean = record.hidden;
      const color = hideMenu ? 'red' : 'green';
      const text = hideMenu ? '隐藏' : '显示';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '排序',
    dataIndex: 'orderNo',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }: any) => {
      const status = record.status;
      const enable = ~~status === 1;
      const color = enable ? '#87d068' : '#f50';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
];

const isDir = (type: number) => type === 1;
const isMenu = (type: number) => type === 2;
const isButton = (type: number) => type === 3;

const isComponent = (type: number) => type === 1;
const isFrameSrc = (type: number) => type === 2 || type === 3;

export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '菜单名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'type',
    label: '菜单类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '目录', value: 1 },
        { label: '菜单', value: 2 },
        { label: '按钮', value: 3 },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'title',
    label: '显示名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'id',
    label: 'Id',
    required: false,
    component: 'Input',
    show: false,
  },
  {
    field: 'type',
    label: '菜单类型',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: '目录', value: 1 },
          { label: '菜单', value: 2 },
          { label: '按钮', value: 3 },
        ],
        onChange: (e: any) => {
          if (e == 1) formModel.component = 'LAYOUT';
        },
      };
    },
  },
  {
    field: 'parentId',
    label: '上级菜单',
    component: 'TreeSelect',
    defaultValue: '',
    componentProps: {
      fieldNames: {
        label: 'title',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'openType',
    label: '打开方式 ',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    ifShow: ({ values }) => !isButton(values.type) && !isDir(values.type),
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: '组件', value: 1 },
          { label: '内链', value: 2 },
          { label: '外链', value: 3 },
        ],
        onChange: (e: any) => {
          formModel.component = e != 1 ? 'IFRAME' : '';
        },
      };
    },
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
    componentProps: { allowClear: true },
    ifShow: ({ values }) => !isButton(values.type),
  },
  {
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    defaultValue: 0,
    required: true,
    componentProps: { style: { width: '100%' } },
  },
  {
    field: 'name',
    label: '组件名称',
    component: 'Input',
    helpMessage: [
      '此处名称应和vue组件的name属性保持一致。',
      '组件名称不能重复，主要用于路由缓存功能。',
      '如果组件名称和vue组件的name属性不一致，则会导致路由缓存失效。',
      '非必填，留空则会根据访问路径自动生成。',
    ],
    required: true,
    ifShow: ({ values }) => isMenu(values.type) && !isFrameSrc(values.openType),
    componentProps: {
      addonBefore: 'setup name=',
    },
    renderComponentContent: () => {
      return {
        prefix: () => '',
      };
    },
  },
  {
    field: 'path',
    label: '路由地址',
    component: 'Input',
    required: true,
    helpMessage: ['浏览器显示的URL，例：/menu，对应打开页面为菜单页面'],
    ifShow: ({ values }) => {
      return !isButton(values.type) && isComponent(values.openType) && !isDir(values.type);
    },
  },
  {
    field: 'component',
    label: '组件路径',
    component: 'Input',
    ifShow: ({ values }) => {
      return !isButton(values.type) && isComponent(values.openType) && !isDir(values.type);
    },
    componentProps: {
      addonBefore: 'src/views/',
    },
    renderComponentContent: () => {
      return {
        prefix: () => '',
      };
    },
  },
  {
    field: 'permission',
    label: '权限标识',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => isButton(values.type) && !isDir(values.type),
  },
  {
    field: 'redirect',
    label: '跳转地址',
    component: 'Input',
    ifShow: ({ values }) => isDir(values.type) && !isDir(values.type),
  },
  {
    field: 'frameSrc',
    label: '跳转地址',
    component: 'Input',
    required: true,
    helpMessage: ['需要以`http://`、`https://`、`//`开头'],
    ifShow: ({ values }) => {
      return isMenu(values.type) && isFrameSrc(values.openType);
    },
  },
  {
    field: 'ignoreKeepAlive',
    label: '忽略缓存',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    ifShow: ({ values }) => {
      return isMenu(values.type) && isComponent(values.openType);
    },
  },
  {
    field: 'hidden',
    label: '是否隐藏',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    ifShow: ({ values }) => !isButton(values.type),
  },
  {
    field: 'status',
    label: '是否启用',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
    // ifShow: ({ values }) => !isButton(values.type),
  },
];
