<!--
 * @Author: LJH 52238648+cqLJH@users.noreply.github.com
 * @Date: 2022-10-27 11:03:16
 * @LastEditors: LJH 52238648+cqLJH@users.noreply.github.com
 * @LastEditTime: 2022-11-03 11:30:21
 * @FilePath: \GloryApp\src\views\blog\article\add.vue
 * @Description: 
-->
<template>
  <PageWrapper :title="title">
    <div class="form-container">
      <BasicForm @register="registerForm">
        <template #titleSlot="{ model, field }">
          <a-input
            :style="isUpdate ? 'width: 80%' : 'width: 70%'"
            v-model:value="model[field]"
            :rules="[{ required: true }]"
            placeholder="输入文章标题"
          />
          <div style="position: absolute; top: 0; right: 0">
            <a-button
              v-if="!isUpdate"
              type="default"
              preIcon="ant-design:edit-filled"
              @click="saveArticleDraft"
            >
              保存草稿
            </a-button>
            <a-button
              type="primary"
              preIcon="mdi:page-next-outline"
              class="ml-2"
              @click="handleSubmit"
            >
              发布文章
            </a-button>
          </div>
        </template>
      </BasicForm>
      <Loading :loading="loading" :absolute="absolute" :tip="tip" />
    </div>
  </PageWrapper>
  <ArticleModal @register="registerModal" @success="handleSuccess" />
</template>
<script lang="ts">
  import { defineComponent, h, reactive, toRefs } from 'vue';
  import { Loading } from '/@/components/Loading';
  import { useRoute } from 'vue-router';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { MarkdownEditor } from '/@/components/Markdown';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import ArticleModal from './ArticleModal.vue';
  import { getDetails } from '/@/api/blog/article';

  const schemas: FormSchema[] = [
    {
      field: 'articleTitle',
      component: 'Input',
      label: '文章标题',
      colProps: { span: 24 },
      rules: [{ required: true }],
      slot: 'titleSlot',
    },
    {
      field: 'articleContent',
      component: 'Input',
      label: '内容',
      colProps: { span: 24 },
      rules: [{ required: true, trigger: 'blur' }],
      render: ({ model, field }) => {
        return h(MarkdownEditor, {
          value: model[field],
          style: 'height: calc(100vh - 300px)',
          onChange: (value: string) => {
            model[field] = value;
          },
        });
      },
    },
  ];
  export default defineComponent({
    components: { BasicForm, PageWrapper, ArticleModal, Loading },
    setup() {
      const route = useRoute();
      const id = route.params?.id ?? '-1';
      const isUpdate = id != '-1';
      const title = id == '-1' ? '发布文章' : '修改文章';

      const { createMessage } = useMessage();
      const [registerModal, { openModal }] = useModal();
      const [registerForm, { validate, setFieldsValue }] = useForm({
        labelWidth: 100,
        schemas: schemas,
        showActionButtonGroup: false,
      });

      const compState = reactive({
        absolute: false,
        loading: false,
        tip: '加载中...',
      });
      // 修改加载数据
      if (id != '-1') {
        loadData();
      }
      let details = {};
      async function loadData() {
        compState.loading = true;
        let result = await getDetails(id);
        compState.loading = false;
        details = result.content;
        setFieldsValue({ ...result.content });
      }

      // 发布
      async function handleSubmit() {
        try {
          const values = await validate();
          openModal(true, {
            record: Object.assign(details, values),
            isUpdate: id != '-1',
          });
        } finally {
        }
      }
      // 保存草稿
      async function saveArticleDraft() {
        try {
          const values = await validate();
          createMessage.success('click search,values:' + JSON.stringify(values));
        } finally {
        }
      }

      function handleSuccess() {
        createMessage.success('success');
      }

      return {
        schemas,
        title,
        isUpdate,
        handleSubmit,
        saveArticleDraft,
        registerForm,
        registerModal,
        handleSuccess,
        ...toRefs(compState),
      };
    },
  });
</script>
<style lang="less" scoped>
  .form-container {
    width: 100%;
    margin-bottom: 16px;
    padding: 12px 10px 6px;
    border-radius: 2px;
    background-color: #fff;
  }

  /deep/ div[class='ant-form-item-control-input-content']:last-child > div {
    display: inline !important;
  }
</style>
