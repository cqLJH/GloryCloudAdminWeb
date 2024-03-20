<template>
  <div v-loading.fullscreen.lock="false" class="slideShadow">
    <transition>
      <div class="slideSty animated bounce">
        <div
          id="slideVerify"
          v-loading="state.slideVerifyLoading"
          class="slide-verify"
          onselectstart="return false;"
        >
          <div
            v-show="state.slideAttrTitleShow"
            class="module_slide_attr"
            :class="{
              show: state.slideAttrTitle,
              success: state.isSlideSuccess,
              fail: state.slideAttrTitle && !state.isSlideSuccess,
            }"
          >
            <Alert
              banner
              :message="state.slideAttrTitle"
              :type="countSlideAttrSuccess"
              center
              show-icon
              :closable="false"
            />
          </div>
          <canvas ref="canvas" :width="w" :height="h"></canvas>
          <div class="slide-verify-refresh-icon" @click="refresh"></div>
          <img
            ref="block"
            :width="state.sliderImgWidth"
            :height="state.sliderImgHeight"
            class="slide-verify-block"
            :src="state.sliderImg"
            v-show="state.sliderImg"
          />
          <!-- container -->
          <div
            class="slide-verify-slider"
            :class="{
              'container-active': state.containerActive,
              'container-success': state.containerSuccess,
              'container-fail': state.containerFail,
            }"
          >
            <div class="slide-verify-slider-mask" :style="{ width: `${state.sliderMaskWidth}px` }">
              <!-- slider -->
              <div
                class="slide-verify-slider-mask-item"
                :style="{ left: `${state.sliderLeft}px` }"
                @mousedown="sliderDown"
                @touchstart="sliderDown"
              >
                <!-- <div class="slide-verify-slider-mask-item-icon"></div> -->
                <!-- <i class="el-icon-arrow-right"></i> -->
              </div>
            </div>
            <span class="slide-verify-slider-text">{{ t('sys.captcha.sliderCaptcha') }}</span>
          </div>
        </div>
        <div class="iconBtn">
          <Icon
            class="icon"
            @click="onClose"
            size="24"
            icon="ant-design:close-outlined"
            style="margin-right: 20px"
          />
          <Icon class="icon" @click="refresh" size="24" icon="ant-design:sync-outlined" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { watch, reactive, computed, ref, onMounted } from 'vue';
  import { getCaptcha, checkCaptcha } from '@/api/sys/user';
  import { useI18n } from 'vue-i18n';
  import { useMessage } from '@/hooks/web/useMessage';
  import Icon from '@/components/Icon/Icon.vue';
  import { Alert } from 'ant-design-vue';
  defineOptions({
    name: 'SlideVerify',
  });
  interface Props {
    isPrintLog?: boolean;
    l?: number;
    r?: number;
    w?: number;
    h?: number;
  }
  interface Emits {
    (e: 'success', val: string): void;
    (e: 'close', val: boolean);
  }
  const { t } = useI18n();
  const props = withDefaults(defineProps<Props>(), {
    isPrintLog: false,
    l: 42,
    r: 10,
    w: 260,
    h: 159,
  });
  const emit = defineEmits<Emits>();
  const state = reactive({
    serverOffset: 8, // 后端接口验证有偏移值
    containerActive: false, // 容器活动类
    containerSuccess: false, // 成功样式 class
    containerFail: false, // 失败样式 fail class
    slideAttrTitle: '', // 提示层文字
    slideAttrTitleShow: false,
    isSlideSuccess: false, // 当前活动状态
    canvasCtx: null,
    // blockCtx: null,
    block: null,
    block_x: undefined, // container random position
    block_y: undefined,
    // L: this.l + this.r * 2 + 3, // block real lenght
    img: undefined,
    originX: undefined,
    originY: undefined,
    isMouseDown: false,
    trail: [],
    sliderLeft: 0, // block right offset
    sliderMaskWidth: 0, // mask width
    slideVerifyLoading: true,
    currentCaptchaId: null,
    bgImg: null,
    bgImgWidth: 0,
    bgImgHeight: 0,
    sliderImg: null,
    sliderImgWidth: 48,
    sliderImgHeight: 159,
  });
  const block = ref(null);
  const canvas = ref(null);
  let currentCaptchaConfig: any = {};
  const countScale = computed(() => {
    const { bgImgWidth, bgImgHeight } = state;
    const { w, h } = props;
    return {
      sw: w / bgImgWidth,
      sh: h / bgImgHeight,
    };
  });
  const countSlideAttrSuccess = computed(() => {
    const { isSlideSuccess } = state;
    return isSlideSuccess ? 'success' : 'error';
  });
  // watch(
  //   () => state.slideAttrTitle,
  //   (newValue) => {
  //     if (newValue) {
  //       setTimeout(() => {
  //         state.slideAttrTitle = '';
  //       }, 3 * 1000);
  //     }
  //   },
  // );
  const printLog = (...params: any) => {
    const { isPrintLog } = props;
    if (isPrintLog) {
      console.log(params);
    }
  };
  // 初始化dom
  const initDom = () => {
    state.canvasCtx = canvas?.value?.getContext('2d');
  };
  const initImg = () => {
    const { w, h } = props;
    const { bgImg } = state;
    const img = document.createElement('img');
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      state.canvasCtx.drawImage(img, 0, 0, w, h);
    };
    img.onerror = () => {
      img.src = bgImg;
    };
    img.src = bgImg;
    state.img = img;
  };
  const { createMessage } = useMessage();
  const { info, success, warning, error } = createMessage;

  // 获取验证码
  const getLoginCaptchaGen = () => {
    state.slideVerifyLoading = true;
    state.sliderImg = null;
    getCaptcha()
      .then((res: any) => {
        const { backgroundImage, id, sliderImage } = res;

        if (backgroundImage) {
          state.slideVerifyLoading = false;
        }
        var backgroundImageWidth = 590;
        var backgroundImageHeight = 360;
        var sliderImageWidth = 120;
        var sliderImageHeight = 360;

        state.currentCaptchaId = id;
        state.bgImg = backgroundImage;
        state.bgImgWidth = backgroundImageWidth;
        state.bgImgHeight = backgroundImageHeight;
        state.sliderImg = sliderImage;
        state.sliderImgWidth = Math.round(sliderImageWidth * countScale.value.sw);
        state.sliderImgHeight = sliderImageHeight * countScale.value.sh;
        currentCaptchaConfig = {
          startTime: new Date(),
          trackArr: [],
          movePercent: 0,
          bgImgWidth: props.w,
          bgImgHeight: props.h,
          sliderImgWidth: state.sliderImgWidth,
          sliderImgHeight: props.h,
          end: props.w,
        };
        printLog(currentCaptchaConfig);
        initImg();
      })
      .catch((err) => {
        console.log('error', err);
      });
  };
  const reset = () => {
    state.containerActive = false;
    state.containerSuccess = false;
    state.containerFail = false;
    state.isSlideSuccess = false;
    state.sliderLeft = 0;
    if (block.value) {
      block.value.style.left = 0;
    }
    state.sliderMaskWidth = 0;
    const { w, h } = props;
    state.canvasCtx.clearRect(0, 0, w, h);
    getLoginCaptchaGen();
  };

  const getLoginCaptchaCheck = () => {
    const { currentCaptchaId } = state;
    const {
      bgImgWidth,
      bgImgHeight,
      sliderImgWidth,
      sliderImgHeight,
      startTime,
      stopTime,
      trackArr,
    } = currentCaptchaConfig;
    state.isSlideSuccess = false;
    const data = {
      backgroundImageWidth: bgImgWidth,
      backgroundImageHeight: bgImgHeight,
      sliderImageWidth: sliderImgWidth,
      sliderImageHeight: sliderImgHeight,
      startTime: startTime,
      endTime: stopTime,
      tracks: trackArr,
      captchaId: currentCaptchaId,
    };
    state.slideVerifyLoading = true;
    state.slideAttrTitleShow = false;
    checkCaptcha(data)
      .then((res: any) => {
        state.slideAttrTitle = '验证成功';
        state.isSlideSuccess = true;
        state.slideAttrTitleShow = true;
        emit('success', currentCaptchaId);
      })
      .catch(() => {
        state.slideAttrTitleShow = true;
        state.slideAttrTitle = '效验失败';
        reset();
      })
      .finally(() => {
        state.slideVerifyLoading = true;
        setTimeout(() => {
          state.slideAttrTitleShow = false;
        }, 3 * 1000);
      });
  };
  const onClose = () => {
    reset();
    emit('close', false);
  };
  function deviceDetection() {
    var userAgentInfo = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(userAgentInfo);
  }
  const sliderDown = (event: any) => {
    const isMobile = deviceDetection();
    state.originX = isMobile ? event.changedTouches[0].clientX : event.clientX;
    state.originY = isMobile ? event.changedTouches[0].clientY : event.clientY;
    state.isMouseDown = true;
    if (!state.bgImg) return;
    let startX = isMobile ? Math.round(event.touches[0].pageX) : Math.round(event.pageX);
    let startY = isMobile ? Math.round(event.touches[0].pageY) : Math.round(event.pageY);

    currentCaptchaConfig.startX = startX;
    currentCaptchaConfig.startY = startY;

    const pageX = currentCaptchaConfig.startX;
    const pageY = currentCaptchaConfig.startY;
    const startTime = currentCaptchaConfig.startTime;
    const trackArr = currentCaptchaConfig.trackArr;
    trackArr.push({
      x: pageX - startX,
      y: pageY - startY,
      type: 'down',
      t: new Date().getTime() - startTime.getTime(),
    });
    printLog('start', startX, startY);
  };
  const refresh = () => {
    reset();
  };
  // 绑定事件
  const bindEvents = () => {
    const isMobile = deviceDetection();
    let move: string = 'mousemove';
    let up: string = 'mouseup';
    if (isMobile) {
      move = 'touchmove';
      up = 'touchend';
    }
    document.addEventListener(move, (e: any) => {
      if (!state.isMouseDown) return false;
      let originX = isMobile ? e.touches[0].clientX : e.clientX;
      let originY = isMobile ? e.touches[0].clientY : e.clientY;
      let moveX = originX - state.originX;
      let moveY = originY - state.originY;
      // 10 到 43是可滑动区域
      if (moveX < 1 || moveX + 45 >= props.w) return false;
      state.sliderLeft = moveX - 12;
      const blockLeft = ((props.w - 3) / props.w) * moveX;
      block.value.style.left = blockLeft + 'px';

      state.containerActive = true; // add active
      state.sliderMaskWidth = moveX;

      const startTime = currentCaptchaConfig.startTime;
      const end = currentCaptchaConfig.end;
      const bgImageWidth = currentCaptchaConfig.bgImageWidth;
      const trackArr = currentCaptchaConfig.trackArr;

      const track = {
        // x: pageX - startX,
        // y: pageY - startY,
        x: moveX,
        y: moveY,
        type: 'move',
        t: new Date().getTime() - startTime.getTime(),
      };
      trackArr.push(track);
      if (moveX < 0) {
        moveX = 0;
      } else if (moveX > end) {
        moveX = end;
      }
      currentCaptchaConfig.moveX = moveX;
      currentCaptchaConfig.movePercent = moveX / bgImageWidth;

      printLog('move', track);
    });
    document.addEventListener(up, (e: any) => {
      if (!state.isMouseDown) return false;
      state.isMouseDown = false;
      let originX = isMobile ? e.changedTouches[0].clientX : e.clientX;
      let originY = isMobile ? e.changedTouches[0].clientY : e.clientY;
      if (originX === state.originX) return false;
      state.containerActive = false; // remove active

      currentCaptchaConfig.stopTime = new Date();
      const pageX = Math.round(originX);
      const pageY = Math.round(originY);
      const startTime = currentCaptchaConfig.startTime;
      const trackArr = currentCaptchaConfig.trackArr;

      const track = {
        // x: pageX - startX,
        // y: pageY - startY,
        x: pageX - state.originX,
        y: pageY - state.originY,
        type: 'up',
        t: new Date().getTime() - startTime.getTime(),
      };
      trackArr.push(track);
      printLog('up', track);

      getLoginCaptchaCheck();
    });
  };
  const init = () => {
    initDom();
    getLoginCaptchaGen();
    bindEvents();
  };
  onMounted(() => {
    init();
  });
</script>
<style scoped lang="scss">
  @import './index.scss';
</style>
