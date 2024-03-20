<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: LJH
 * @Date: 2022-05-30 11:37:06
 * @LastEditors: LJH 52238648+cqLJH@users.noreply.github.com
 * @LastEditTime: 2022-11-02 11:20:21
 * @FilePath: \GloryApp\src\views\usr\dept\DeptModal.vue
 * Copyright (C) 2022 LJH. All rights reserved.
-->
<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #articleCoverSlot="{ model, field }">
        <a-upload-dragger
          v-model:fileList="fileList"
          name="file"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          @change="handleChangeUpload"
          :before-upload="beforeUpload"
          @drop="handleDrop"
        >
          <template v-if="model[field] == ''">
            <p class="ant-upload-drag-icon">
              <inbox-outlined />
            </p>
            <p class="ant-upload-text">单击或拖动图片到此区域进行上传</p>
          </template>
          <img
            v-else
            :src="model[field]"
            style="
              width: 360px;
              height: 180px;
              margin-top: -15px;
              margin-left: 1px;
              object-fit: 'cover';
            "
          />
        </a-upload-dragger>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './article.data';
  import { addArticle, updateArticle } from '/@/api/blog/article';
  import { InboxOutlined } from '@ant-design/icons-vue';
  import type { UploadChangeParam } from 'ant-design-vue';
  import { Upload } from 'ant-design-vue';
  // utils
  import { buildUUID } from '/@/utils/uuid';
  import { useI18n } from '/@/hooks/web/useI18n';

  const AUploadDragger = Upload.Dragger;
  export default defineComponent({
    name: 'ArticleModal',
    components: { BasicModal, BasicForm, InboxOutlined, AUploadDragger },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const { createMessage } = useMessage();

      const { t } = useI18n();

      let rowId: number;
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      let basicData = {};
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        basicData = data.record;
        setFieldsValue({
          ...{
            articleCover:
              'https://qzonestyle.gtimg.cn/qzone/qzactStatics/imgs/20171122191630_ff8fef.jpg',
          },
        });
        if (unref(isUpdate)) {
          rowId = data.record.id;
          setFieldsValue({
            ...basicData,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '发布文章' : '编辑文章'));

      async function handleSubmit() {
        try {
          const values = await validate();
          var data = Object.assign(basicData, values);
          setModalProps({ confirmLoading: true });
          if (!unref(isUpdate)) {
            await addArticle(data);
          } else {
            values.id = rowId;
            await updateArticle(data.id, data);
          }
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      // 图片上传
      const handleChangeUpload = (info: UploadChangeParam) => {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          createMessage.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          createMessage.error(`${info.file.name} file upload failed.`);
        }
      };

      const fileListRef = ref<FileItem[]>([]);
      // 上传前校验
      function beforeUpload(file: File) {
        const { size, name } = file;
        const maxSize = 10;
        // 设置最大值，则判断
        if (maxSize && file.size / 1024 / 1024 >= maxSize) {
          createMessage.error(t('component.upload.maxSizeMultiple', [maxSize]));
          return false;
        }

        const commonItem = {
          uuid: buildUUID(),
          file,
          size,
          name,
          percent: 0,
          type: name.split('.').pop(),
        };
        // 生成图片缩略图
        if (checkImgType(file)) {
          // beforeUpload，如果异步会调用自带上传方法
          // file.thumbUrl = await getBase64(file);
          getBase64WithFile(file).then(({ result: thumbUrl }) => {
            fileListRef.value = [
              ...unref(fileListRef),
              {
                thumbUrl,
                ...commonItem,
              },
            ];
          });
        } else {
          createMessage.error('You can only upload JPG file!');
          return false;
        }
      }

      function checkImgType(file: File) {
        return isImgTypeByName(file.name);
      }

      function isImgTypeByName(name: string) {
        return /\.(jpg|jpeg|png|gif)$/i.test(name);
      }

      function getBase64WithFile(file: File) {
        return new Promise<{
          result: string;
          file: File;
        }>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve({ result: reader.result as string, file });
          reader.onerror = (error) => reject(error);
        });
      }

      return {
        registerModal,
        registerForm,
        getTitle,
        handleSubmit,
        fileList: ref([]),
        handleChangeUpload,
        beforeUpload,
        handleDrop: (e: DragEvent) => {
          console.log(e);
        },
      };
    },
  });

  export enum UploadResultStatus {
    SUCCESS = 'success',
    ERROR = 'error',
    UPLOADING = 'uploading',
  }

  export interface FileItem {
    thumbUrl?: string;
    name: string;
    size: string | number;
    type?: string;
    percent: number;
    file: File;
    status?: UploadResultStatus;
    responseData?: '';
    uuid: string;
  }
</script>
<style>
  .ant-upload-drag {
    width: 364px !important;
    height: 184px !important;
  }
</style>
