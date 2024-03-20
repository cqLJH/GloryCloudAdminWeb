import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

// 分类字典
import { dictList } from '@/utils/dictUtil';

export const columns: BasicColumn[] = [
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 70,
  },
  {
    title: '账户',
    dataIndex: 'account',
    width: 120,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 100,
  },
  {
    title: '角色',
    dataIndex: 'roleNames',
    width: 100,
  },
  {
    title: '组织',
    dataIndex: 'orgName',
    width: 140,
  },
  {
    title: '职位',
    dataIndex: 'positionName',
    width: 140,
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: 50,
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    width: 100,
  },

  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'userName',
    label: '用户名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'phone',
    label: '手机号码',
    component: 'Input',
    colProps: { span: 8 },
  },
];

/**
 * 基础信息
 */
export const formSchema: FormSchema[] = [
  {
    field: 'account',
    label: '账号',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入账号',
    },
    colProps: { span: 12 },
  },
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入姓名',
    },
    colProps: { span: 12 },
  },
  {
    field: 'gender',
    label: '性别',
    component: 'RadioGroup',
    defaultValue: '1',
    colProps: { span: 12 },
    componentProps: {
      options: dictList('GENDER'),
    },
  },
  {
    field: 'nickName',
    label: '昵称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入昵称',
    },
    colProps: { span: 12 },
  },
  {
    field: 'phone',
    label: '手机号码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入手机号码',
    },
    colProps: { span: 12 },
    required: true,
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    componentProps: {
      placeholder: '请输入邮箱',
    },
    colProps: { span: 12 },
  },
  {
    field: 'birthday',
    label: '出生日期',
    component: 'DatePicker',
    colProps: { span: 24 },
    componentProps: { style: { width: '50%' } },
  },
  {
    field: 'orgId',
    label: '选择组织',
    component: 'TreeSelect',
    componentProps: {
      placeholder: '请选择组织',
    },
    required: true,
    colProps: { span: 8 },
  },
  {
    field: 'positionId',
    label: '选择职位',
    component: 'Select',
    componentProps: {
      options: [],
      placeholder: '请选择职位',
    },
    required: true,
    colProps: { span: 8 },
  },
  {
    field: 'directorId',
    label: '选择主管',
    component: 'Select',
    componentProps: {
      options: [],
      placeholder: '请选择主管',
    },
    colProps: { span: 8 },
  },
  {
    field: 'empNo',
    label: '员工编号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入员工编号',
    },
    colProps: { span: 8 },
  },
  {
    field: 'positionLevel',
    label: '职级',
    component: 'Input',
    componentProps: {
      placeholder: '请输入职级',
    },
    colProps: { span: 8 },
  },
  {
    field: 'entryDate',
    label: '入职日期',
    component: 'DatePicker',
    colProps: { span: 8 },
    componentProps: { style: { width: '100%' } },
  },
];

/**
 * 更多信息
 */
export const moreFormSchema: FormSchema[] = [
  {
    field: 'nation',
    label: '民族',
    component: 'Select',
    componentProps: {
      options: dictList('NATION'),
      placeholder: '请选择民族',
    },
    colProps: { span: 12 },
  },
  {
    field: 'nativePlace',
    label: '籍贯',
    component: 'Input',
    componentProps: {
      placeholder: '请输入籍贯',
    },
    colProps: { span: 12 },
  },
  {
    field: 'homeAddress',
    label: '家庭住址',
    component: 'Input',
    componentProps: {
      placeholder: '请输入家庭住址',
    },
    colProps: { span: 12 },
  },
  {
    field: 'mailingAddress',
    label: '通信地址',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入通信地址',
    },
    colProps: { span: 12 },
  },
  {
    field: 'idCardType',
    label: '证件类型',
    component: 'Select',
    componentProps: {
      options: dictList('IDCARD_TYPE'),
      placeholder: '请选择证件类型',
    },
    colProps: { span: 12 },
  },
  {
    field: 'idCardNumber',
    label: '证件号码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入证件号码',
    },
    colProps: { span: 12 },
  },
  {
    field: 'cultureLevel',
    label: '文化程度',
    component: 'Select',
    componentProps: {
      options: dictList('CULTURE_LEVEL'),
      placeholder: '请选择文化程度',
    },
    colProps: { span: 12 },
  },
  {
    field: 'politicalOutlook',
    label: '政治面貌',
    component: 'Input',
    componentProps: {
      placeholder: '请输入政治面貌',
    },
    colProps: { span: 12 },
  },
  {
    field: 'college',
    label: '毕业学校',
    component: 'Input',
    componentProps: {
      placeholder: '请输入毕业学校',
    },
    colProps: { span: 12 },
  },
  {
    field: 'education',
    label: '学历',
    component: 'Input',
    componentProps: {
      placeholder: '请输入学历',
    },
    colProps: { span: 12 },
  },
  {
    field: 'eduLength',
    label: '学制',
    component: 'Input',
    componentProps: {
      placeholder: '请输入学制',
    },
    colProps: { span: 12 },
  },
  {
    field: 'degree',
    label: '学位',
    component: 'Input',
    componentProps: {
      placeholder: '请输入学位',
    },
    colProps: { span: 12 },
  },
  {
    field: 'homeTel',
    label: '家庭电话',
    component: 'Input',
    componentProps: {
      placeholder: '请输入家庭电话',
    },
    colProps: { span: 12 },
  },
  {
    field: 'officeTel',
    label: '办公电话',
    component: 'Input',
    componentProps: {
      placeholder: '请输入办公电话',
    },
    colProps: { span: 12 },
  },
  {
    field: 'emergencyContact',
    label: '紧急联系人',
    component: 'Input',
    componentProps: {
      placeholder: '请输入紧急联系人',
    },
    colProps: { span: 12 },
  },
  {
    field: 'emergencyPhone',
    label: '紧急联系电话',
    component: 'Input',
    componentProps: {
      placeholder: '请输入紧急联系电话',
    },
    colProps: { span: 12 },
  },
  {
    field: 'emergencyAddress',
    label: '紧急联系人地址',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入紧急联系人地址',
    },
    colProps: { span: 12 },
  },
];
