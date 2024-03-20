<template>
  <BasicModal
    v-bind="$attrs"
    title="用户选择"
    :width="1000"
    :mask-closable="false"
    @register="register"
    :destroy-on-close="true"
    @ok="handleSubmit"
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
                <Form-item name="searchKey">
                  <a-input v-model:value="searchFormState.searchKey" placeholder="请输入用户名" />
                </Form-item>
              </Col>
              <Col :span="12">
                <a-button type="primary" class="primarySele" @click="loadData()"> 查询 </a-button>
                <a-button class="snowy-buttom-left" @click="reset()"> 重置 </a-button>
              </Col>
            </Row>
          </Form>
        </div>
        <div class="user-table">
          <Table
            ref="tableRef"
            size="small"
            :columns="commons"
            :data-source="tableData"
            :expand-row-by-click="true"
            :loading="pageLoading"
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
                <a-button
                  type="dashed"
                  :disabled="record.id == 1600000000000"
                  size="small"
                  @click="addRecord(record)"
                  >添加</a-button
                >
              </template>
              <!-- <template v-if="column.dataIndex === 'category'">
                {{ $TOOL.dictTypeData('ROLE_CATEGORY', record.category) }}
              </template> -->
            </template>
          </Table>
          <div class="mt-2">
            <Pagination
              v-if="!isEmpty(tableData)"
              v-model:current="pageIndex"
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
        <div class="user-table">
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

<script setup name="userSelectorPlus">
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

  // 主表格common
  const commons = [
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '账号',
      dataIndex: 'account',
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
      title: '用户名',
      dataIndex: 'name',
      ellipsis: true,
    },
  ];
  // 主表格的ref 名称
  const tableRef = ref();
  // 选中表格的ref 名称
  const selectedTable = ref();
  const tableRecordNum = ref();
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
  const recordIds = ref();

  const props = defineProps(['radioModel', 'orgTreeApi', 'userPageApi', 'checkedUserListApi']);

  // 是否是单选
  const radioModel = props.radioModel || false;

  // 分页相关
  const pageIndex = ref(0); // 当前页数
  const pageSize = ref(20); // 每页条数
  const total = ref(0); // 数据总数

  // 打开弹框
  const [register, { setModalProps, closeModal }] = useModalInner((data) => {
    recordIds.value = data.ids;

    // 加载机构树
    if (props.orgTreeApi) {
      // 获取机构树
      props.orgTreeApi().then((res) => {
        cardLoading.value = false;
        if (res !== null) {
          treeData.value = res;
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
    }

    // 获取用户列表
    searchFormState.value.pageSize = pageSize.value;
    loadData();

    // 获取已有的用户
    if (props.checkedUserListApi) {
      if (isEmpty(recordIds.value)) {
        return;
      }

      selectedTableListLoading.value = true;
      props
        .checkedUserListApi(recordIds.value)
        .then((data) => {
          selectedData.value = data;
        })
        .finally(() => {
          selectedTableListLoading.value = false;
        });
    }
  });

  // 获取用户列表
  const loadData = () => {
    pageLoading.value = true;
    props
      .userPageApi(searchFormState.value)
      .then((res) => {
        pageIndex.value = res.pageIndex;
        total.value = res.totalCount;

        // 重置、赋值
        tableData.value = [];
        tableRecordNum.value = 0;
        tableData.value = res.data;
        if (res.data) {
          tableRecordNum.value = res.data.length;
        } else {
          tableRecordNum.value = 0;
        }
      })
      .finally(() => {
        pageLoading.value = false;
      });
  };

  // pageSize改变回调分页事件
  const paginationChange = (page, pageSize) => {
    searchFormState.value.pageIndex = page;
    searchFormState.value.pageSize = pageSize;
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
    searchFormState.value.pageIndex = 0;
    if (selectedKeys.length > 0) {
      searchFormState.value.orgId = selectedKeys.toString();
    } else {
      delete searchFormState.value.orgId;
    }
    loadData();
  };
  // 确定
  const handleSubmit = () => {
    const value = [];
    selectedData.value.forEach((item) => {
      const obj = {
        id: item.id,
        name: item.name,
        account: item.account,
      };
      value.push(obj);
    });

    emit('onBack', value);

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
    pageIndex.value = 0;
    pageSize.value = 20;
    total.value = 0;
    selectedData.value = [];
    closeModal();
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
    obj.key = 'USER';
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
    margin-left: 10px;
  }

  .primarySele {
    margin-right: 10px;
  }

  .ant-form-item {
    margin-bottom: 0 !important;
  }

  .user-table {
    max-height: 450px;
    overflow: auto;
  }
</style>
