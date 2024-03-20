<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <RadioGroup
          v-model:value="status"
          @change="changeStatus"
          name="radioGroup"
          style="position: absolute; left: 80px"
        >
          <Radio value="">全部</Radio>
          <Radio value="1">公开</Radio>
          <Radio value="2">私密</Radio>
          <Radio value="3">草稿</Radio>
        </RadioGroup>
      </template>
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>

        <template v-else-if="column.key === 'articleTitle'">
          <Ellipsis :value="text" :length="20"></Ellipsis>
        </template>

        <template v-else-if="column.key === 'articleCover'">
          <TableImg :size="120" :simpleShow="true" :imgList="[record.articleCover]" />
          <eye-outlined v-if="record.status == 1" class="article-status-icon" />
          <lock-outlined v-if="record.status == 2" class="article-status-icon" />
          <form-outlined v-if="record.status == 3" class="article-status-icon" />
        </template>

        <template v-else-if="column.key === 'tags'">
          <a-tag v-for="tag in record.tags" :key="tag" color="green">
            {{ tag }}
          </a-tag>
        </template>

        <template v-else-if="column.key === 'type'">
          <a-tag :color="articleType(record.type).tagType">
            {{ articleType(record.type).name }}
          </a-tag>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup name="blogArticleIndex">
  import { defineComponent, ref } from 'vue';
  import { Radio, RadioGroup, Tag } from 'ant-design-vue';
  import { EyeOutlined, LockOutlined, FormOutlined } from '@ant-design/icons-vue';
  import { BasicTable, useTable, TableAction, TableImg } from '/@/components/Table';
  import { getList, deleteArticle } from '/@/api/blog/article';
  import { useGo } from '/@/hooks/web/usePage';
  import { columns, searchFormSchema } from './article.data';
  import { Ellipsis } from '@/components/Ellipsis';

  const status = ref<string>('');

  const [registerTable, { reload, setLoading }] = useTable({
    title: '文章列表',
    api: getList,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    searchInfo: { status: status },
    rowKey: 'id',
    size: 'small',
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    striped: true,
    showIndexColumn: false,
    canResize: false,
    actionColumn: {
      width: 150,
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: undefined,
    },
  });
  // 路由跳转
  const go = useGo();
  function handleEdit(record: Recordable) {
    go(`/article/${record.id}`);
  }

  async function handleDelete(record: Recordable) {
    setLoading(true);
    await deleteArticle(record.id);
    reload();
  }

  function handleSuccess() {
    reload();
  }

  function changeStatus() {
    reload();
  }

  function articleType(type: Number) {
    var tagType = '';
    var name = '';
    switch (type) {
      case 1:
        tagType = '#2db7f5';
        name = '原创';
        break;
      case 2:
        tagType = '#87d068';
        name = '转载';
        break;
      case 3:
        tagType = '#108ee9';
        name = '翻译';
        break;
    }
    return {
      tagType: tagType,
      name: name,
    };
  }
</script>
<style scoped>
  .vben-basic-table .ant-tag {
    margin-right: 6px;
  }

  .vben-basic-table-img {
    height: 70px !important;
  }

  .article-status-icon {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    color: rgb(255 255 255);
    font-size: 1.2rem;
  }
</style>
