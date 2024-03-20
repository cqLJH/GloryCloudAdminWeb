<template>
  <Row :gutter="10">
    <Col :span="4">
      <Menu
        id="userMessage"
        v-model:selected-keys="selectedKeys"
        mode="inline"
        @click="handleClick"
      >
        <MenuItem :key="messageCategory.value" v-for="messageCategory in messageCategoryList">{{
          messageCategory.label
        }}</MenuItem>
      </Menu>
    </Col>
    <Col :span="20">
      <div style="margin-top: -16px">
        <Table
          ref="table"
          :columns="columns"
          :data="loadData"
          bordered
          :row-key="(record) => record.id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'subject'">
              <Ellipsis :length="40" tooltip>
                {{ record.subject }}
              </Ellipsis>
            </template>
            <template v-if="column.dataIndex === 'read'">
              <span v-if="record.read" style="color: #d9d9d9">已读</span>
              <span v-else style="color: #ff4d4f">未读</span>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <Space>
                <a>详情</a>
              </Space>
            </template>
          </template>
        </Table>
      </div>
    </Col>
    <detail ref="detailRef" @refresh="refresh" />
  </Row>
</template>

<script setup name="userMessage">
  import detail from './userMessage/detail.vue';
  import { Row, Col, Menu, Table } from 'ant-design-vue';
  import { nextTick } from 'vue';

  import { Ellipsis } from '@/components/Ellipsis';
  // 分类字典
  import { dictList } from '@/utils/dictUtil';

  const messageCategoryList = dictList('MESSAGE_CATEGORY');
  const selectedKeys = ref(new Array(messageCategoryList[0].value));
  const table = ref();
  const detailRef = ref();
  const columns = [
    {
      title: '主题',
      dataIndex: 'subject',
    },
    {
      title: '发送时间',
      dataIndex: 'createTime',
      sorter: true,
    },
    {
      title: '是否已读',
      dataIndex: 'read',
      width: '100px',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '100px',
    },
  ];
  const loadData = (parameter) => {
    parameter.category = selectedKeys.value[0];
    return [];
  };
  const refresh = () => {
    table.value.refresh(false);
  };
  // 点击左侧菜单切换数据查询
  const handleClick = () => {
    // 先让上面的变量赋值，咱在查询
    nextTick(() => {
      table.value.refresh(true);
    });
  };
</script>
