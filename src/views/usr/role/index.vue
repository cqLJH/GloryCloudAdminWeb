<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <div class="w-1/4 xl:w-1/5 m-4 mr-0 overflow-hidden bg-white" style="overflow: auto">
      <Card :bordered="false" :loading="treeLoading" style="height: 100%">
        <Tree
          v-if="treeData.length > 0"
          :tree-data="treeData"
          :field-names="treeFieldNames"
          @select="treeSelect"
          v-model:expandedKeys="defaultExpandedKeys"
        >
        </Tree>
        <Empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE" />
      </Card>
    </div>
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5">
      <template #tableTitle>
        <a-button
          type="primary"
          @click="handleCreate"
          v-if="hasPermission('sysRole:add')"
          preIcon="ant-design:plus-outlined"
        >
          新增角色
        </a-button>
        <BatchDelete
          :selectedRowKeys="getSelectRowKeys()"
          v-if="hasPermission('sysRole:delete')"
          @batchDelete="deleteBatch"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'category'">
          {{ $filters.dictFormat('ROLE_CATEGORY', record.category) }}
        </template>

        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                label: '编辑',
                ifShow: hasPermission('sysRole:update') && record.id != 1600000000010,
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                label: '删除',
                color: 'error',
                ifShow: hasPermission('sysRole:delete') && record.id != 1600000000010,
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
            :dropDownActions="[
              {
                icon: 'ant-design:menu-outlined',
                label: '授权资源',
                ifShow: hasPermission('sysRole:setAuthority') && record.id != 1600000000010,
                onClick: handleGrantMenu.bind(null, record),
              },
              // {
              //   icon: 'ant-design:database-outlined',
              //   label: '授权数据',
              //   disabled: !hasPermission('sysRole:grantData'),
              //   onClick: handleGrantData.bind(null, record),
              // },
              {
                icon: 'ant-design:user-outlined',
                label: '授权用户',
                ifShow: hasPermission('sysRole:grantUser') && record.id != 1600000000010,
                onClick: handleGrantUser.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <RoleDrawer @register="registerDrawer" @success="handleSuccess" />
    <GrantMenuDrawer @register="registerGrantMenuDrawer" />
    <GrantDataDrawer @register="registerGrantDataDrawer" @success="handleSuccess" />

    <!-- 用户选择 -->
    <GrantUserModal
      @register="registerGrantUserModel"
      @onBack="userCallBack"
      :org-tree-api="selectorApiFunction.orgTreeApi"
      :user-page-api="selectorApiFunction.userPageApi"
      :checked-user-list-api="selectorApiFunction.checkedUserListApi"
    />
  </PageWrapper>
</template>
<script lang="ts" setup name="roleIndex">
  import { ref, reactive } from 'vue';
  import { Tree, Empty, Card } from 'ant-design-vue';
  import { isEmpty } from 'lodash-es';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useMessage } from '/@/hooks/web/useMessage';

  import RoleDrawer from './RoleDrawer.vue';
  import GrantMenuDrawer from './GrantMenuDrawer.vue';
  import GrantDataDrawer from './GrantDataDrawer.vue';
  import GrantUserModal from './GrantUserModal.vue';

  import { columns, searchFormSchema } from './role.data';
  import { getOrgTree } from '/@/api/usr/org';
  import {
    getRoleList,
    batchDeleteRole,
    getRoleOwnUser,
    grantUser,
    userSelectorPaged,
    userListByIds,
  } from '/@/api/usr/role';

  // 默认展开的节点
  const defaultExpandedKeys = ref([]);
  // 定义树元素
  const treeData = ref([]);
  const treeLoading = ref(true);
  const treeFieldNames = { children: 'children', title: 'fullName', key: 'id' };

  const selectedRowKeys = ref([]);

  // 记录数据
  const recordCacheData = ref({});

  let searchInfo = reactive({});

  const { hasPermission } = usePermission();
  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerGrantMenuDrawer, { openDrawer: openGrantMenuDrawer }] = useDrawer();
  const [registerGrantDataDrawer, { openDrawer: openGrantDataDrawer }] = useDrawer();

  const { createMessage } = useMessage();

  /**
   * 用户选择器
   */
  const [registerGrantUserModel, { openModal: openGrantUserModal }] = useModal();

  const [registerTable, { reload, setLoading, getSelectRowKeys, getForm }] = useTable({
    api: getRoleList,
    rowKey: 'id',
    columns,
    searchInfo: searchInfo,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    rowSelection: {
      type: 'checkbox',
      getCheckboxProps(record: Recordable) {
        if (record.id === 1600000000010) {
          return { disabled: true };
        }
        return { disabled: false };
      },
    },
    useSearchForm: true,
    showIndexColumn: false,
    showTableSetting: true,
    clickToRowSelect: false,
    bordered: true,
    striped: true,
    canResize: true,
    actionColumn: {
      width: 180,
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      ifShow: hasPermission([
        'sysRole:update',
        'sysRole:delete',
        'sysRole:grantUser',
        'sysRole:setAuthority',
      ]),
    },
  });

  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
      record: {
        category: searchInfo.category,
        orgId: searchInfo.orgId,
      },
    });
  }

  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }

  async function handleDelete(record: Recordable) {
    setLoading(true);
    await batchDeleteRole({ value: [record.id] });
    reload();
  }

  function handleSuccess() {
    reload();
  }

  // 授权资源菜单
  function handleGrantMenu(record: Recordable) {
    openGrantMenuDrawer(true, { record });
  }

  function handleGrantData(record: Recordable) {
    openGrantDataDrawer(true, { record });
  }

  function deleteBatch() {
    setLoading(true);
    batchDeleteRole({ value: getSelectRowKeys() })
      .then(() => {
        reload();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // 授权用户
  function handleGrantUser(record: any) {
    // 打开人员选择器的时候，缓存一个记录数据
    recordCacheData.value = record;
    setLoading(true);
    // 查询接口，查到这个角色是多少个用户都有它
    getRoleOwnUser(record.id)
      .then((data) => {
        openGrantUserModal(true, { ids: data });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // 人员选择器回调
  const userCallBack = (value) => {
    const userIds = value.map((item) => {
      return item.id;
    });

    setLoading(true);
    grantUser(recordCacheData.value.id, userIds)
      .then(() => {
        createMessage.success(`操作成功`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 用户选择 传递设计器需要的API
  const selectorApiFunction = {
    orgTreeApi: (param) => {
      return getOrgTree(param).then((data) => {
        return Promise.resolve(data);
      });
    },
    userPageApi: (param) => {
      return userSelectorPaged(param).then((data) => {
        return Promise.resolve(data);
      });
    },
    checkedUserListApi: (param) => {
      return userListByIds(param).then((data) => {
        return Promise.resolve(data);
      });
    },
  };

  /**
   * 加载左侧的树
   */
  loadTreeData();
  function loadTreeData() {
    treeLoading.value = true;
    getOrgTree().then((res) => {
      if (res) {
        // 树中插入全局角色类型
        const globalRoleType = [
          {
            id: 'GLOBAL',
            parentId: '0',
            fullName: '全局',
          },
        ];
        treeData.value = globalRoleType.concat(res);
        if (isEmpty(defaultExpandedKeys.value)) {
          // 默认展开2级
          treeData.value.forEach((item) => {
            // 因为0的顶级
            if (item.parentId === 0) {
              defaultExpandedKeys.value.push(item.id);
              // 取到下级ID
              if (item.children) {
                item.children.forEach((items) => {
                  defaultExpandedKeys.value.push(items.id);
                });
              }
            }
          });
        }
      }
      treeLoading.value = false;
    });
  }

  /**
   * 点击树查询
   */
  const treeSelect = (selectedKeys, node) => {
    if (selectedKeys.length > 0) {
      if (selectedKeys[0] === 'GLOBAL') {
        searchInfo.category = 'GLOBAL';
        delete searchInfo.orgId;
      } else {
        searchInfo.orgId = selectedKeys.toString();
        delete searchInfo.category;
      }
    } else {
      delete searchInfo.category;
      delete searchInfo.orgId;
    }

    // 重置表单搜索
    getForm().resetFields();
  };
</script>
