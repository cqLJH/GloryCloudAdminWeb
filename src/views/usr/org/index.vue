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

    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess" class="w-3/4 xl:w-4/5">
      <template #tableTitle>
        <a-button
          type="primary"
          v-if="hasPermission('sysOrg:add')"
          @click="handleCreate"
          preIcon="ant-design:plus-outlined"
        >
          新增组织
        </a-button>
        <BatchDelete
          :selectedRowKeys="getSelectRowKeys()"
          @batchDelete="deleteBatchOrg"
          v-if="hasPermission('sysOrg:delete')"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'category'">
          {{ $filters.dictFormat('ORG_CATEGORY', record.category) }}
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                label: '编辑',
                ifShow: hasPermission('sysOrg:update'),
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                label: '删除',
                ifShow: hasPermission('sysOrg:delete'),
                color: 'error',
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

    <OrgDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup name="orgIndex">
  import { ref, reactive } from 'vue';
  import { Tree, Row, Col, Empty, Card } from 'ant-design-vue';
  import { isEmpty } from 'lodash-es';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getOrgPage, batchDelete, getOrgTree } from '/@/api/usr/org';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import OrgDrawer from './OrgDrawer.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { columns, searchFormSchema } from './org.data';

  const { hasPermission } = usePermission();

  // 默认展开的节点
  const defaultExpandedKeys = ref([]);

  // 定义树元素
  const treeData = ref([]);
  const treeLoading = ref(true);

  const selectedRowKeys = ref([]);
  let searchInfo = reactive({});
  const treeFieldNames = { children: 'children', title: 'fullName', key: 'id' };

  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload, setLoading, getSelectRowKeys, getForm }] = useTable({
    api: getOrgPage,
    rowKey: 'id',
    columns,
    searchInfo: searchInfo,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    rowSelection: {
      type: 'checkbox',
    },
    useSearchForm: true,
    showIndexColumn: false,
    showTableSetting: true,
    clickToRowSelect: false,
    bordered: true,
    striped: true,
    canResize: true,
    actionColumn: {
      width: 150,
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      ifShow: hasPermission(['sysOrg:update', 'sysOrg:delete']),
    },
  });

  function handleCreate() {
    openDrawer(true, {
      record: { parentId: searchInfo.parentId ? searchInfo.parentId : 0 },
    });
  }

  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
    });
  }

  async function handleDelete(record: Recordable) {
    setLoading(true);
    await batchDelete({ value: [record.id] });
    reload();
  }

  async function deleteBatchOrg() {
    setLoading(true);
    await batchDelete({ value: getSelectRowKeys() });
    reload();
  }

  /**
   * 加载左侧的树
   */
  loadTreeData();
  function loadTreeData() {
    treeLoading.value = true;
    getOrgTree().then((res) => {
      if (res) {
        treeData.value = res;
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
      searchInfo.parentId = selectedKeys[0];
    } else {
      delete searchInfo.parentId;
    }
    // 重置表单搜索
    getForm().resetFields();
  };

  function handleSuccess() {
    loadTreeData();
    reload();
  }

  function onFetchSuccess() {}
</script>
