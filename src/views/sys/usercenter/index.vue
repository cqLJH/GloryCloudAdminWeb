<template>
  <PageWrapper>
    <Row :gutter="10">
      <Col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb-3">
        <Card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <CropperAvatar
                :uploadApi="uploadApi"
                :value="userInfo.avatar"
                btnText="更换头像"
                :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
                @change="updateAvatar"
                width="150"
              />
            </div>
            <div class="username">{{ userInfo.profile.name }}</div>
            <div class="bio">{{ userInfo.profile.nickname }}</div>
          </div>
          <div class="account-center-detail">
            <p><i class="title"></i>{{ userInfo.profile.positionName }}</p>
            <p><i class="group"></i>{{ userInfo.profile.orgName }}</p>
            <p>
              <i class="address"></i>
              <span>{{
                userInfo.profile.homeAddress ? userInfo.profile.homeAddress : '暂无地址'
              }}</span>
            </p>
          </div>
          <Divider />
          <div class="account-center-team">
            <div class="mb-2" v-if="userInfo.profile.signature" style="width: 100%">
              <Image
                :src="userInfo.profile.signature"
                width="100%"
                style="height: 120px; border: 1px solid rgb(236 236 236)"
              />
            </div>
            <!-- <a-button @click="SignNameRef.show()">打开签名板</a-button>
            <SignName
              ref="SignNameRef"
              :image="userInfo.profile.signature"
              @register="registerDrawer"
              @successful="signSuccess"
            /> -->
          </div>
        </Card>
      </Col>
      <Col :xs="24" :sm="24" :md="17" :lg="17" :xl="17">
        <Card
          :bordered="false"
          style="width: 100%"
          :tab-list="tabList"
          :active-tab-key="noTitleKey"
          @tabChange="(key) => onTabChange(key, 'key')"
        >
          <p v-if="noTitleKey === 'accountBasic'">
            <accountBasic />
          </p>
          <p v-if="noTitleKey === 'accountBind'">
            <accountBind />
          </p>
          <!-- <p v-if="noTitleKey === 'organizationChart'">
          <organizationChart />
        </p>
        <p v-if="noTitleKey === 'accountBind'">
          <accountBind />
        </p>
        <p v-if="noTitleKey === 'shortcutSetting'">
          <shortcutSetting />
        </p>
        <p v-if="noTitleKey === 'userMessage'">
          <userMessage />
        </p> -->
        </Card>
      </Col>
    </Row>
  </PageWrapper>
</template>

<script setup name="UserCenterPage">
  import { onMounted, ref, computed } from 'vue';
  import { Avatar, Row, Col, Card, Spin, Divider, Image } from 'ant-design-vue';

  // 用户信息
  import { useUserStore } from '/@/store/modules/user';
  import { useDrawer } from '/@/components/Drawer';
  import { PageWrapper } from '/@/components/Page';
  // import SignName from '@/components/SignName/index.vue';
  import { CropperAvatar } from '/@/components/Cropper';

  import { uploadApi } from '/@/api/oss/oss';
  import accountBasic from './userTab/accountBasic.vue';
  // import organizationChart from './userTab/organizationChart.vue';
  // import shortcutSetting from './userTab/shortcutSetting.vue';
  import accountBind from './userTab/accountBind.vue';
  // import userMessage from './userTab/userMessage.vue';

  /**
   * 本地个人信息
   */
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;

  const avatarLoading = ref(false);

  const [registerDrawer, { openDrawer }] = useDrawer();

  // const SignNameRef = ref();
  const tabList = [
    {
      key: 'accountBasic',
      tab: '基本信息',
    },
    {
      key: 'organizationChart',
      tab: '组织架构',
    },
    {
      key: 'accountBind',
      tab: '账号相关',
    },
    {
      key: 'shortcutSetting',
      tab: '快捷方式',
    },
    {
      key: 'userMessage',
      tab: '我的消息',
    },
  ];

  const noTitleKey = ref('accountBasic');
  const onTabChange = (key) => {
    noTitleKey.value = key;
  };

  onMounted(() => {});

  /**
   * 头像裁剪图片回调
   */
  function updateAvatar({ src, data }) {
    userInfo.profile.avatar = src;
    userInfo.avatar = src;
    userStore.setUserInfo(userInfo);
    console.log('data', data);
  }

  /**
   * 打开签名版
   */
  function openSignName() {
    openDrawer(true);
  }

  /**
   * 签名板组件回调
   */
  const signSuccess = (value) => {
    const param = {
      signature: value,
    };
    // userCenterApi.userUpdateSignature(param).then(() => {
    //   userInfo.value.signature = value;
    //   // 更新缓存
    //   // tool.data.set('USER_INFO', userInfo.value);
    //   // global_store.setUserInfo(userInfo.value);
    // });
  };
</script>

<style lang="less" scoped>
  .account-center-avatarHolder {
    margin-bottom: 24px;
    text-align: center;

    & > .avatar {
      width: 150px;
      height: 150px;
      margin: 0 auto;
      margin-bottom: 20px;
      overflow: hidden;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .mask {
      display: flex;
      position: absolute;
      align-items: center;
      justify-content: center;
      width: 104px;
      height: 104px;
      margin-top: -104px;
      border-radius: 50%;
      opacity: 0;
      background: rgb(101 101 101 / 60%);
      color: #fff;
      font-size: 25px;
    }

    .mask-notImg {
      display: flex;
      position: absolute;
      align-items: center;
      justify-content: center;
      width: 104px;
      height: 104px;
      margin-top: -24px;
      border-radius: 50%;
      opacity: 0;
      background: rgb(101 101 101 / 60%);
      color: #fff;
      font-size: 25px;
    }

    .avatar a:hover .mask {
      opacity: 1;
    }

    .avatar a:hover .mask-notImg {
      opacity: 1;
    }

    .username {
      margin-bottom: 4px;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
    }
  }

  .account-center-detail {
    p {
      position: relative;
      margin-bottom: 8px;
      padding-left: 26px;
    }

    i {
      position: absolute;
      top: 4px;
      left: 0;
      width: 14px;
      height: 14px;
      background: url('https://gw.alipayobjects.com/zos/rmsportal/pBjWzVAHnOOtAUvZmZfy.svg');
    }

    .title {
      background-position: 0 0;
    }

    .group {
      background-position: 0 -22px;
    }

    .address {
      background-position: 0 -44px;
    }
  }

  .teamTitle {
    margin-bottom: 12px;
    font-weight: 500;
  }

  .account-center-team {
    .members {
      a {
        display: block;
        height: 24px;
        margin: 12px 0;
        line-height: 24px;

        .member {
          display: inline-block;
          max-width: 100px;
          margin-left: 12px;
          transition: all 0.3s;
          font-size: 14px;
          line-height: 24px;
          vertical-align: top;
        }
      }
    }
  }
</style>
