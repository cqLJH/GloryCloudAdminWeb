<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable">
      <!--插槽:table标题-->
      <template #tableTitle>
        <Upload
          name="file"
          :showUploadList="false"
          :action="ossAction"
          :headers="tokenHeader"
          :beforeUpload="beforeUpload"
          @change="handleChange"
        >
          <a-button type="primary" preIcon="ant-design:upload-outlined">OSS文件上传</a-button>
        </Upload>
      </template>

      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'fileName'">
          <Ellipsis :value="text" :length="20"></Ellipsis>
        </template>
        <template v-if="column.key === 'url'">
          <Ellipsis :value="text" :length="20"></Ellipsis>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction :actions="getTableAction(record)" />
        </template>
      </template>
    </BasicTable>
    <FileDrawer @register="registerFileDrawer" />
  </div>
</template>

<script lang="ts" name="ossFileIndex" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Upload } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, searchFormSchema } from './file.data';
  import { getFlieList, deleteFlies, getOssUrl, getMinioUrl } from '/@/api/oss/oss';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getToken } from '/@/utils/auth';
  import { createImgPreview } from '/@/components/Preview/index';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useDrawer } from '/@/components/Drawer';
  import FileDrawer from './fileDrawer.vue';
  import { Ellipsis } from '@/components/Ellipsis';

  const { hasPermission } = usePermission();
  const { createMessage } = useMessage();
  const glob = useGlobSetting();
  const tokenHeader = { Authorization: getToken() };

  //注册table数据
  const [registerTable, { reload, setLoading }] = useTable({
    api: getFlieList,
    recordKey: 'id',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    striped: true,
    useSearchForm: true,
    showTableSetting: true,
    clickToRowSelect: false,
    bordered: true,
    showIndexColumn: false,
    tableSetting: { fullScreen: true },
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
  });

  const [registerFileDrawer, { openDrawer }] = useDrawer();
  /**
   * 上传url
   */
  const ossAction = computed(() => `${glob.uploadUrl}${getOssUrl}`);

  /**
   * 预览
   */
  function handleView(record) {
    if (['.pdf', '.docx', '.xlsx'].findIndex((e) => e == record.suffix) > -1) {
      openDrawer(true, {
        url: record.url,
        suffix: record.suffix,
        fileName: record.fileName,
      });
    } else if (['.jpg', '.png', '.jpeg', '.bmp'].findIndex((e) => e == record.suffix) > -1) {
      createImgPreview({ imageList: [record.url], maskClosable: true });
    } else {
      createMessage.error('此文件格式不支持预览');
    }
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteFlies({ value: [record.id] });
    reload();
  }

  /**
   * 上传前事件
   */
  function beforeUpload(file) {
    var fileType = file.type;
    if (fileType === 'image') {
      if (fileType.indexOf('image') < 0) {
        createMessage.warning('请上传图片');
        return false;
      }
    } else if (fileType === 'file') {
      if (fileType.indexOf('image') >= 0) {
        createMessage.warning('请上传文件');
        return false;
      }
    }
    setLoading(true);
    return true;
  }

  /**
   * 文件上传事件
   */
  function handleChange(info) {
    if (info.file.status === 'done') {
      reload();
      createMessage.success(`${info.file.name} 上传成功!`);
    } else if (info.file.status === 'error') {
      createMessage.error(`${info.file.response.detail}`);
      setLoading(false);
    }
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '预览',
        onClick: handleView.bind(null, record),
      },
      {
        label: '删除',
        ifShow: hasPermission('sysOSS:deleteFile'),
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
  }
</script>

<style scoped></style>
