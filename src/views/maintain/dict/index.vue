<template>
  <PageWrapper>
    <Card
      :bordered="false"
      :active-tab-key="searchInfo.category"
      :tab-list="tabListNoTitle"
      @tabChange="(key) => onTabChange(key, 'key')"
    >
      <Row :gutter="10">
        <Col :xs="24" :sm="24" :md="24" :lg="4" :xl="4" v-loading="treeLoading">
          <Tree
            v-if="treeData.length > 0"
            :tree-data="treeData"
            :field-names="treeFieldNames"
            @select="treeSelect"
          >
          </Tree>
          <Empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE" />
        </Col>
        <Col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
          <BasicTable @register="registerTable">
            <template #tableTitle>
              <a-button
                type="primary"
                v-if="hasPermission('sysDict:add')"
                @click="handleCreate"
                preIcon="ant-design:plus-outlined"
              >
                新增
              </a-button>
            </template>

            <!--操作栏-->
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <TableAction :actions="getTableAction(record)" />
              </template>
              <template v-if="column.key === 'level'">
                <Tag color="blue" v-if="record.level">{{ record.level }}</Tag>
                <Tag color="green" v-else>子级</Tag>
              </template>
            </template>
          </BasicTable>
        </Col>
      </Row>
    </Card>
    <DictDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup name="dictIndex">
  import { ref, reactive, getCurrentInstance } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './dict.data';
  import { Card, Row, Col, Empty, Tree, Divider, Tag } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import DictDrawer from './DictDrawer.vue';
  import { getPage, getDictTree, deleteDict } from '/@/api/maint/dict';
  import { setDictCache } from '/@/utils/dictUtil';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { hasPermission } = usePermission();

  // 定义树元素
  const treeData = ref([]);
  const treeLoading = ref(true);
  // 顶级id
  const rootId = ref(0);

  let searchInfo = reactive({ category: '0' });
  const treeFieldNames = { children: 'children', title: 'dictLabel', key: 'id' };
  const tabListNoTitle = ref([
    { key: '0', tab: '系统字典' },
    { key: '1', tab: '业务字典' },
  ]);

  updateColumns();
  function updateColumns() {
    if (columns.length == 4) {
      columns.splice(2, 1);
    }
  }

  const [registerTable, { reload, setLoading, getForm }] = useTable({
    api: getPage,
    afterFetch: (v) => {
      if (searchInfo.parentId) {
        v.forEach((item) => {
          if (item.parentId === 0) {
            item.level = '上级';
          }
        });
      }
    },
    rowKey: 'id',
    columns,
    size: 'small',
    useSearchForm: true,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    showIndexColumn: false,
    showTableSetting: true,
    resizeHeightOffset: 40,
    searchInfo: searchInfo,
    bordered: true,
    canResize: true,
    striped: true,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: undefined,
    },
  });

  const [registerDrawer, { openDrawer }] = useDrawer();

  /**
   * 新增
   */
  function handleCreate() {
    openDrawer(true, {
      record: {
        parentId: rootId,
        category: searchInfo.category,
      },
      title: tabListNoTitle.value.filter((e) => e.key == searchInfo.category)[0].tab,
    });
  }

  /**
   * 编辑
   */
  function handleEdit(record) {
    openDrawer(true, {
      record,
      title: tabListNoTitle.value.filter((e) => e.key == searchInfo.category)[0].tab,
    });
  }

  /**
   * 加载左侧的树
   */
  loadTreeData();
  function loadTreeData() {
    const param = {
      category: searchInfo.category,
    };
    treeLoading.value = true;
    getDictTree(param).then((res) => {
      if (res) {
        treeData.value = res;
      }
      treeLoading.value = false;
    });
  }

  /**
   * 点击树查询
   */
  const treeSelect = (selectedKeys, node) => {
    rootId.value = node.node.parentId == 0 ? node.node.id : node.node.parentId;
    if (selectedKeys && selectedKeys.length > 0) {
      searchInfo.parentId = selectedKeys[0];
      if (!columns.find((f) => f.title === '层级')) {
        columns.splice(2, 0, {
          title: '层级',
          dataIndex: 'level',
          key: 'level',
          width: 100,
        });
      }
    } else {
      delete searchInfo.parentId;
      columns.splice(2, 1);
    }

    // 重置表单搜索
    getForm().resetFields();
  };

  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '编辑',
        icon: 'clarity:note-edit-line',
        ifShow: hasPermission('sysDict:update'),
        onClick: handleEdit.bind(null, record),
      },
    ];
  }

  /**
   * 字典类型切换
   */
  function onTabChange(value, type) {
    searchInfo.category = value;
    delete searchInfo.parentId;
    loadTreeData();
    updateColumns();
    // 重置表单搜索
    getForm().resetFields();
  }

  /**
   * 新增/编辑成功
   */
  function handleSuccess() {
    loadTreeData();
    reload();
    refreshStoreDict();
  }

  /**
   * 刷新store中的字典
   */
  const refreshStoreDict = () => {
    getDictTree().then((data) => {
      setDictCache(data);
    });
  };
</script>

<style lang="less" scoped>
  .ant-card .ant-card-body {
    padding: 0 !important;
  }

  .vben-basic-table-form-container .ant-form {
    margin-bottom: 0 !important;
  }
</style>
