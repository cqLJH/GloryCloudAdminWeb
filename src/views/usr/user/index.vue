<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <OrgTree class="w-1/4 xl:w-1/5" style="overflow: auto" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #tableTitle>
        <a-button
          type="primary"
          @click="handleCreate"
          preIcon="ant-design:plus-outlined"
          :disabled="!hasPermission('sysUser:add')"
        >
          新增账号
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'avatar'">
          <Avatar :src="record.avatar" :size="40" style="margin-top: -5px; margin-bottom: -5px" />
        </template>
        <template v-if="column.key === 'gender'">
          <Tag :color="record.gender == 1 ? 'blue' : record.gender == 2 ? 'red' : 'orange'">
            {{ $filters.dictFormat('GENDER', record.gender) }}
          </Tag>
        </template>
        <template v-if="column.key === 'status'">
          <Switch
            :checked="record.status == 1"
            checkedChildren="已启用"
            unCheckedChildren="已禁用"
            :loading="record.pendingStatus"
            :disabled="record.id == 1600000000000 || !hasPermission('sysUser:changeStatus')"
            @change="onChangeStatus(record)"
          />
        </template>

        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                label: '编辑',
                tooltip: '编辑账号',
                ifShow: hasPermission('sysUser:update') && record.id != 1600000000000,
                onClick: handleEdit.bind(null, record),
              },
            ]"
            :dropDownActions="[
              {
                icon: 'ant-design:menu-outlined',
                label: '授权角色',
                ifShow: hasPermission('sysUser:grantRole') && record.id != 1600000000000,
                onClick: handleGrantRole.bind(null, record),
              },
              {
                icon: 'ant-design:database-outlined',
                label: '授权数据',
                ifShow: hasPermission('sysUser:grantData') && record.id != 1600000000000,
                onClick: handleGrantData.bind(null, record),
              },
              {
                icon: 'ant-design:redo-outlined',
                label: '重置密码',
                ifShow: hasPermission('sysUser:resetPwd') && record.id != 1600000000000,
                popConfirm: {
                  title: '是否确认重置密码',
                  confirm: handleResetUserPwd.bind(null, record),
                },
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                label: '删除账号',
                ifShow: hasPermission('sysUser:delete') && record.id != 1600000000000,
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <!-- 用户编辑 -->
    <UserDrawer @register="registerUserDrawer" @success="handleSuccess" />

    <!-- 角色选择 -->
    <GrantRoleModal @register="registerGrantRoleModel" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup name="userIndex">
  import { reactive } from 'vue';
  import { BasicTable, useTable, TableAction, TableImg } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Avatar, Switch, Tag } from 'ant-design-vue';

  import OrgTree from './OrgTree.vue';
  import UserDrawer from './UserDrawer.vue';
  import GrantRoleModal from './GrantRoleModal.vue';

  import { columns, searchFormSchema } from './user.data';
  import { getUserList, deleteUser, resetUserPwd, setUserStatus } from '/@/api/usr/usr';

  const { hasPermission } = usePermission();
  const { createMessage } = useMessage();

  const [registerUserDrawer, { openDrawer: openUserDrawer }] = useDrawer();

  /**
   * 角色选择器
   */
  const [registerGrantRoleModel, { openModal: openGrantRoleModal }] = useModal();

  const searchInfo = reactive<Recordable>({});
  const [registerTable, { reload, setLoading, updateTableDataRecord }] = useTable({
    api: getUserList,
    rowKey: 'id',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showIndexColumn: false,
    showTableSetting: true,
    bordered: true,
    striped: true,
    canResize: true,
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      ifShow: hasPermission([
        'sysUser:update',
        'sysUser:grantRole',
        'sysUser:resetPwd',
        'sysUser:delete',
      ]),
    },
  });

  function handleCreate() {
    openUserDrawer(true, {});
  }

  function handleEdit(record: Recordable) {
    openUserDrawer(true, {
      id: record.id,
    });
  }

  async function handleDelete(record: Recordable) {
    await deleteUser(record.id);
    reload();
  }

  function handleSuccess() {
    reload();
  }

  function handleSelect(orgId: number) {
    searchInfo.orgId = orgId;
    reload();
  }

  function handleGrantData(record: Recordable) {
    createMessage.error('开发中');
    // openGrantOrgDrawer(true, { record });
  }

  function handleGrantRole(record: Recordable) {
    openGrantRoleModal(true, { record });
  }

  /**
   * 修改账号状态
   */
  function onChangeStatus(record) {
    if (!Reflect.has(record, 'pendingStatus')) {
      record.pendingStatus = false;
    }
    record.pendingStatus = true;
    const newStatus = record.status == 1 ? 0 : 1;
    const { createMessage } = useMessage();
    setUserStatus(record.id, { value: newStatus })
      .then(() => {
        record.status = newStatus;
        createMessage.success(`已成功修改账号状态`);
      })
      .catch(() => {
        createMessage.error('修改账号状态失败');
      })
      .finally(() => {
        record.pendingStatus = false;
      });
  }

  async function handleResetUserPwd(record: Recordable) {
    setLoading(true);
    await resetUserPwd(record.id);
    setLoading(false);
    createMessage.success(`已成功重置密码，初始密码为123456`);
  }
</script>
