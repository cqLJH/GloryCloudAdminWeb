<!--
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-12-15 21:14:16
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-15 22:37:55
 * @FilePath: \GloryCloudWeb\src\components\BatchButton\BatchDelete.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <Popconfirm
    title="删除此信息？"
    :open="deleteVisible"
    @openChange="deleteVisibleChange"
    @confirm="deleteBatch"
  >
    <Button danger class="ml-2">
      <template #icon>
        <Icon icon="ant-design:delete-outlined" />
      </template>
      {{ props.buttonName }}
    </Button>
  </Popconfirm>
</template>

<script setup name="BatchDelete">
  import { ref, reactive } from 'vue';
  import { message, Popconfirm, Button } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';

  defineOptions({
    name: 'BatchDelete',
    inheritAttrs: false,
  });

  const deleteVisible = ref(false);

  const emit = defineEmits(['batchDelete']);

  const props = defineProps({
    buttonName: {
      type: String,
      default: () => '批量删除',
    },
    selectedRowKeys: {
      type: Array,
      default: () => [],
    },
  });
  // 参数校验
  const deleteVisibleChange = () => {
    if (deleteVisible.value) {
      deleteVisible.value = false;
      return false;
    }
    if (props.selectedRowKeys.length < 1) {
      message.warning('请选择一条或多条数据');
      deleteVisible.value = false;
      return false;
    } else {
      deleteVisible.value = true;
    }
  };
  // 批量删除
  const deleteBatch = () => {
    const params = props.selectedRowKeys.map((m) => {
      return {
        id: m,
      };
    });
    // 发起方法调用，谁的谁来实现
    emit('batchDelete', params);
  };
</script>
