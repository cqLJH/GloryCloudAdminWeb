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
          v-if="hasPermission('sysPosition:add')"
          preIcon="ant-design:plus-outlined"
        >
          新增职位
        </a-button>
        <BatchDelete
          :selectedRowKeys="getSelectRowKeys()"
          @batchDelete="deleteBatch"
          v-if="hasPermission('sysPosition:delete')"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'category'">
          {{ $filters.dictFormat('POSITION_CATEGORY', record.category) }}
        </template>

        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                label: '编辑',
                ifShow: hasPermission('sysPosition:update'),
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                label: '删除',
                color: 'error',
                ifShow: hasPermission('sysPosition:delete'),
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

    <PositionDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup name="positionIndex">
  import { ref, reactive } from 'vue';
  import { Tree, Empty, Card } from 'ant-design-vue';
  import { isEmpty } from 'lodash-es';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import { usePermission } from '/@/hooks/web/usePermission';

  import PositionDrawer from './PositionDrawer.vue';

  import { columns, searchFormSchema } from './position.data';
  import { getOrgTree } from '/@/api/usr/org';
  import { getPositionPage, batchDeletePosition } from '/@/api/usr/position';

  // 默认展开的节点
  const defaultExpandedKeys = ref([]);
  // 定义树元素
  const treeData = ref([]);
  const treeLoading = ref(true);
  const treeFieldNames = { children: 'children', title: 'fullName', key: 'id' };

  const selectedRowKeys = ref([]);
  let searchInfo = reactive({});

  const { hasPermission } = usePermission();
  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload, setLoading, getSelectRowKeys, getForm }] = useTable({
    api: getPositionPage,
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
      width: 180,
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      ifShow: hasPermission(['sysPosition:update', 'sysPosition:delete']),
    },
  });

  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
      record: {
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
    await batchDeletePosition({ value: [record.id] });
    reload();
  }

  function handleSuccess() {
    reload();
  }

  async function deleteBatch() {
    setLoading(true);
    await batchDeletePosition({ value: getSelectRowKeys() });
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
      searchInfo.orgId = selectedKeys[0];
    } else {
      delete searchInfo.orgId;
    }
    // 重置表单搜索
    getForm().resetFields();
  };
</script>
