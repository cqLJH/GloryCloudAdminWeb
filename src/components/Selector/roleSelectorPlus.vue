<template>
  <BasicModal
    v-bind="$attrs"
    title="角色选择"
    :width="1000"
    :mask-closable="false"
    @register="register"
    :destroy-on-close="true"
    @ok="handleOk"
    @cancel="handleClose"
  >
    <Row :gutter="10">
      <Col :span="7">
        <Card size="small" :loading="cardLoading" class="selectorTreeDiv">
          <Tree
            v-if="treeData"
            v-model:expandedKeys="defaultExpandedKeys"
            :tree-data="treeData"
            :field-names="treeFieldNames"
            @select="treeSelect"
          >
          </Tree>
          <Empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE" />
        </Card>
      </Col>
      <Col :span="11">
        <div class="table-operator" style="margin-bottom: 10px">
          <Form
            ref="searchFormRef"
            name="advanced_search"
            class="ant-advanced-search-form"
            :model="searchFormState"
          >
            <Row :gutter="24">
              <Col :span="12">
                <FormItem name="searchKey">
                  <a-input v-model:value="searchFormState.searchKey" placeholder="请输入角色名" />
                </FormItem>
              </Col>
              <Col :span="12">
                <a-button type="primary" class="primarySele" @click="loadData()"> 查询 </a-button>
                <a-button class="snowy-buttom-left" @click="() => reset()"> 重置 </a-button>
              </Col>
            </Row>
          </Form>
        </div>
        <div class="role-table">
          <Table
            ref="table"
            size="small"
            :columns="commons"
            :data-source="tableData"
            :expand-row-by-click="true"
            :loading="pageLoading"
            rowKey="id"
            bordered
            :pagination="false"
          >
            <template #title>
              <span>待选择列表 {{ tableRecordNum }} 条</span>
              <div v-if="!radioModel" style="float: right">
                <a-button type="dashed" size="small" @click="addAllPageRecord"
                  >添加当前数据</a-button
                >
              </div>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'action'">
                <a-button type="dashed" size="small" @click="addRecord(record)">添加</a-button>
              </template>
              <template v-if="column.dataIndex === 'category'">
                {{ $filters.dictFormat('ROLE_CATEGORY', record.category) }}
              </template>
            </template>
          </Table>
          <div class="mt-2">
            <Pagination
              v-if="!isEmpty(tableData)"
              v-model:current="current"
              v-model:page-size="pageSize"
              :total="total"
              size="small"
              showSizeChanger
              @change="paginationChange"
            />
          </div>
        </div>
      </Col>
      <Col :span="6">
        <div class="role-table">
          <Table
            ref="selectedTable"
            size="small"
            :columns="selectedCommons"
            :data-source="selectedData"
            :expand-row-by-click="true"
            :loading="selectedTableListLoading"
            bordered
          >
            <template #title>
              <span>已选择: {{ selectedData.length }}</span>
              <div v-if="!radioModel" style="float: right">
                <a-button type="dashed" danger size="small" @click="delAllRecord"
                  >全部移除</a-button
                >
              </div>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'action'">
                <a-button type="dashed" danger size="small" @click="delRecord(record)"
                  >移除</a-button
                >
              </template>
            </template>
          </Table>
        </div>
      </Col>
    </Row>
  </BasicModal>
</template>

<script setup lang="ts" name="roleSelectorPlus">
  import { ref } from 'vue';
  import {
    message,
    Tree,
    Row,
    Col,
    Empty,
    Card,
    Table,
    Form,
    FormItem,
    Pagination,
  } from 'ant-design-vue';
  import { remove, isEmpty } from 'lodash-es';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getOrgTree } from '/@/api/usr/org';
  import { getRoleListByIds, getRoleList } from '/@/api/usr/role';

  // 主表格common
  const commons = [
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 80,
    },
    {
      title: '角色名',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
    },
  ];

  // 选中表格的表格common
  const selectedCommons = [
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 80,
    },
    {
      title: '角色名',
      dataIndex: 'name',
      ellipsis: true,
    },
  ];

  // 主表格的ref 名称
  const table = ref();
  // 选中表格的ref 名称
  const selectedTable = ref();
  const tableRecordNum = ref(0);

  // 角色分页查询
  const searchFormState = ref({});

  const searchFormRef = ref();
  const cardLoading = ref(true);
  const pageLoading = ref(false);
  const selectedTableListLoading = ref(false);

  // 替换treeNode 中 title,key,children
  const treeFieldNames = { children: 'children', title: 'fullName', key: 'id' };

  // 获取机构树数据
  const treeData = ref();

  //  默认展开二级树的节点id
  const defaultExpandedKeys = ref([]);

  /**
   * 声明Emits
   */
  const emit = defineEmits(['onBack', 'register']);

  const tableData = ref([]);
  const selectedData = ref([]);

  //  已有的角色集合
  const recordIds = ref();

  const props = defineProps({
    // 是否是单选
    radioModel: {
      type: Boolean,
      default: false,
      required: false,
    },
  });

  // 是否是单选
  const radioModel = props.radioModel;

  // 分页相关
  const current = ref(0); // 当前页数
  const pageSize = ref(20); // 每页条数
  const total = ref(0); // 数据总数

  let rowId = 0;
  let ids = [];

  // 打开弹框
  const [register, { setModalProps, closeModal }] = useModalInner((data) => {
    rowId = data.record.id;
    recordIds.value = data.record.roleIds.split(',').map((e) => e * 1);

    // 获取机构树
    cardLoading.value = true;
    getOrgTree().then((data) => {
      cardLoading.value = false;
      if (data !== null) {
        treeData.value = data;

        // 树中插入全局角色类型
        const globalRoleType = [
          {
            id: 'GLOBAL',
            parentId: '-1',
            fullName: '全局',
          },
        ];
        treeData.value = globalRoleType.concat(data);

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
    });

    searchFormState.value.size = pageSize.value;
    loadData();

    // 根据id集合获取角色集合
    if (isEmpty(recordIds.value)) {
      return;
    }
    const param = {
      value: recordIds.value,
    };
    selectedTableListLoading.value = true;
    getRoleListByIds(param)
      .then((data) => {
        selectedData.value = data;
      })
      .finally(() => {
        selectedTableListLoading.value = false;
      });
  });

  // 查询主表格数据
  const loadData = () => {
    pageLoading.value = true;
    getRoleList(searchFormState.value)
      .then((res) => {
        current.value = res.pageIndex;
        total.value = res.totalCount;
        // 重置、赋值
        tableData.value = res.data;
        tableRecordNum.value = res.data.length;
      })
      .finally(() => {
        pageLoading.value = false;
      });
  };

  // pageSize改变回调分页事件
  const paginationChange = (page, pageSize) => {
    searchFormState.value.current = page;
    searchFormState.value.size = pageSize;
    loadData();
  };
  const judge = () => {
    if (radioModel && selectedData.value.length > 0) {
      return false;
    }
    return true;
  };

  // 添加记录
  const addRecord = (record) => {
    if (!judge()) {
      message.warning('只可选择一条');
      return;
    }
    const selectedRecord = selectedData.value.filter((item) => item.id === record.id);
    if (selectedRecord.length === 0) {
      selectedData.value.push(record);
    } else {
      message.warning('该记录已存在');
    }
  };

  // 添加全部
  const addAllPageRecord = () => {
    let newArray = selectedData.value.concat(tableData.value);
    let list = [];
    for (let item1 of newArray) {
      let flag = true;
      for (let item2 of list) {
        if (item1.id === item2.id) {
          flag = false;
        }
      }
      if (flag) {
        list.push(item1);
      }
    }
    selectedData.value = list;
  };
  // 删减记录
  const delRecord = (record) => {
    remove(selectedData.value, (item) => item.id === record.id);
  };
  // 删减记录
  const delAllRecord = () => {
    selectedData.value = [];
  };
  // 点击树查询
  const treeSelect = (selectedKeys) => {
    searchFormState.value.current = 0;
    if (selectedKeys.length > 0) {
      if (selectedKeys[0] === 'GLOBAL') {
        searchFormState.value.category = selectedKeys[0];
        delete searchFormState.value.orgId;
      } else {
        searchFormState.value.orgId = selectedKeys.toString();
        delete searchFormState.value.category;
      }
    } else {
      delete searchFormState.value.category;
      delete searchFormState.value.orgId;
    }
    loadData();
  };
  // 确定
  const handleOk = () => {
    const value = [];

    selectedData.value.forEach((item) => {
      value.push(item.id);
    });

    console.log(value);

    handleClose();
  };

  // 重置
  const reset = () => {
    delete searchFormState.value.searchKey;
    loadData();
  };

  const handleClose = () => {
    searchFormState.value = {};
    tableRecordNum.value = 0;
    tableData.value = [];
    current.value = 0;
    pageSize.value = 20;
    total.value = 0;
    selectedData.value = [];
    closeModal();
  };

  // 数据进入后转换
  const goDataConverter = (data) => {
    const resultData = [];
    if (data.length > 0) {
      const values = data[0].value.split(',');
      if (JSON.stringify(values) !== '[""]') {
        for (let i = 0; i < values.length; i++) {
          resultData.push(values[i]);
        }
      }
    }
    return resultData;
  };
  // 数据出口转换器
  const outDataConverter = (data) => {
    const obj = {};
    let label = '';
    let value = '';
    for (let i = 0; i < data.length; i++) {
      if (data.length === i + 1) {
        label = label + data[i].name;
        value = value + data[i].id;
      } else {
        label = label + data[i].name + ',';
        value = value + data[i].id + ',';
      }
    }
    obj.key = 'ROLE';
    obj.label = label;
    obj.value = value;
    obj.extJson = '';
    return obj;
  };
</script>

<style lang="less" scoped>
  .selectorTreeDiv {
    max-height: 500px;
    overflow: auto;
  }

  .cardTag {
    margin-left: 20px;
  }

  .primarySele {
    margin-right: 20px;
  }

  .ant-form-item {
    margin-bottom: 0 !important;
  }

  .role-table {
    max-height: 450px;
    overflow: auto;
  }
</style>
