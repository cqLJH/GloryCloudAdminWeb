<template>
  <Drawer
    ref="signModel"
    v-model:open="open"
    :width="700"
    title="电子签名"
    @close="handleClear"
    @ok="handleOk"
  >
    <Row :gutter="5">
      <Col :span="15">
        <div style="border: 1px solid rgb(236 236 236)">
          <vue-esign
            ref="esign"
            v-model:bgColor="bgColor"
            :width="800"
            :height="400"
            :quality="1"
            :is-crop="isCrop"
            :line-width="lineWidth"
            :line-color="lineColor"
          />
        </div>
      </Col>
      <Col :span="9">
        <div style="width: auto; height: 90px">
          <img
            :src="resultImg"
            v-if="resultImg"
            style="width: 100%; height: 90px; border: 1px solid rgb(236 236 236)"
          />
        </div>
      </Col>
    </Row>
    <div style="margin-top: 10px">
      <Space>
        <Form>
          <Row :gutter="16">
            <Col :span="12">
              <FormItem label="画笔粗细：">
                <InputNumber v-model:value="lineWidth" :min="1" :max="20" />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem>
                <div style="padding-right: 50px"
                  >是否裁剪：<Checkbox v-model:checked="isCrop"></Checkbox
                ></div>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <a-button type="primary" @click="handleGenerate">预览</a-button>
        <a-button @click="handleReset">清屏</a-button>
      </Space>
    </div>
    <template #footer>
      <a-button style="margin-right: 8px" @click="handleClear">取消</a-button>
      <a-button type="primary" @click="handleOk">确定</a-button>
    </template>
  </Drawer>
</template>

<script setup>
  import { ref } from 'vue';
  import {
    Drawer,
    message,
    Row,
    Col,
    Space,
    Form,
    FormItem,
    InputNumber,
    Checkbox,
  } from 'ant-design-vue';

  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import vueEsign from './vueEsign.vue';

  const open = ref(false);

  const show = () => {
    open.value = true;
  };

  const signModel = ref(false);

  const esign = ref(false);
  const resultImg = ref('');
  const isCrop = ref(false);
  const lineWidth = ref(6);
  const lineColor = ref('#000000');
  const bgColor = ref('');
  const props = defineProps(['image']);

  // const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
  //   console.log(data);
  // });

  // eslint-disable-next-line vue/no-setup-props-destructure
  resultImg.value = props.image;
  const emit = defineEmits(['successful']);

  const handleReset = () => {
    esign.value.reset();
    resultImg.value = '';
  };
  const handleGenerate = () => {
    esign.value
      .generate()
      .then((res) => {
        resultImg.value = res;
      })
      .catch(() => {
        message.warning('无任何签字');
      });
  };
  const handleClear = () => {
    closeDrawer();
  };
  const handleOk = () => {
    esign.value
      .generate()
      .then((res) => {
        emit('successful', res);
        handleClear();
      })
      .catch(() => {
        message.warning('无任何签字');
      });
  };

  defineExpose({
    show,
  });
</script>

<style scoped>
  .ant-form-item {
    margin-bottom: 0 !important;
  }
</style>
