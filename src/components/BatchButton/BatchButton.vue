<template>
  <Popconfirm
    title="批量处理此信息？"
    :open="batchVisible"
    @openChange="batchVisibleChange"
    @confirm="deleteBatch"
  >
    <Button
      class="ml-2"
      :type="props.buttonType"
      :danger="props.buttonDanger"
      :size="props.size"
      :loading="buttonLoading"
    >
      <template #icon v-if="props.icon">
        <component :is="props.icon" :style="{ color: props.color }" />
      </template>
      {{ props.buttonName }}
    </Button>
  </Popconfirm>
</template>

<script setup name="BatchButton">
  import { ref, reactive } from 'vue';
  import { message, Popconfirm, Button } from 'ant-design-vue';

  const batchVisible = ref(false);

  const emit = defineEmits(['batchCallBack']);

  defineOptions({
    name: 'BatchButton',
    inheritAttrs: false,
  });

  const buttonLoading = ref(false);
  const props = defineProps({
    buttonName: {
      type: String,
      default: () => '批量操作',
    },
    buttonDanger: {
      type: Boolean,
      default: () => false,
    },
    buttonType: {
      type: String,
      default: () => '',
    },
    icon: {
      type: String,
      default: () => '',
    },
    size: {
      type: String,
      default: () => 'middle',
    },
    selectedRowKeys: {
      type: Array,
      default: () => [],
    },
    color: {
      type: String,
      default: () => '',
    },
  });
  // 参数校验
  const batchVisibleChange = () => {
    if (batchVisible.value) {
      batchVisible.value = false;
      return false;
    }
    if (props.selectedRowKeys.length < 1) {
      message.warning('请选择一条或多条数据');
      batchVisible.value = false;
      return false;
    } else {
      batchVisible.value = true;
    }
  };
  // 批量操作
  const deleteBatch = () => {
    const params = props.selectedRowKeys.map((m) => {
      return {
        id: m,
      };
    });
    // 发起方法调用，谁的谁来实现
    emit('batchCallBack', params);
  };
  // 打开loading
  const loading = () => {
    buttonLoading.value = true;
  };
  // 关闭loading
  const closeLoading = () => {
    buttonLoading.value = true;
  };
</script>
