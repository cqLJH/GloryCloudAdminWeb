<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="授权资源"
    width="500px"
    @ok="handleSubmit"
  >
    <div v-loading="treeLoading">
      <BasicForm @register="registerForm">
        <template #menu>
          <BasicTree
            :treeData="treeData"
            rowKey="id"
            :fieldNames="{ title: 'name', key: 'id' }"
            :checkedKeys="ownMenuData"
            checkable
            toolbar
            search
            title="资源列表"
            ref="treeAction"
            @check="handleCheck"
          />
        </template>
      </BasicForm>
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, unref, reactive, toRefs, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree';
  import { Loading } from '/@/components/Loading';
  import { ownMenuList, grantRoleMenu } from '/@/api/usr/role';
  import { useMessage } from '/@/hooks/web/useMessage';

  /**
   * 声明Emits
   */
  const emit = defineEmits(['success', 'register']);

  const treeData = ref<TreeItem[]>([]);
  let rowId: number;
  const ownMenuData = ref<number[]>([]);
  const treeAction = ref<Nullable<TreeActionType>>(null);
  let checkKeys: number[] = []; // 子节点集合(勾选)
  let halfCheckKeys: number[] = []; // 父节点集合(半勾选)
  const { createMessage } = useMessage();

  const treeLoading = ref(true);

  const [registerForm, { validate }] = useForm({
    labelWidth: 90,
    schemas: [
      {
        label: '',
        field: 'menu',
        slot: 'menu',
        colProps: { span: 24 },
        component: 'Input',
      },
    ],
    showActionButtonGroup: false,
  });

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (r) => {
    setDrawerProps({ confirmLoading: true });

    ownMenuData.value = [];
    checkKeys = [];
    halfCheckKeys = [];

    rowId = r.record.id;

    treeLoading.value = true;
    var data = await ownMenuList(rowId);
    treeLoading.value = false;
    setDrawerProps({ confirmLoading: false });

    if (unref(treeData).length === 0) {
      treeData.value = data.treeData as any as TreeItem[];
      nextTick(() => {
        unref(treeAction)?.filterByLevel(1);
      });
    }

    handleKeys(data.treeData, data.checkedIds);
    ownMenuData.value = data.checkedIds;
  });

  // 节点勾选事件
  function handleCheck(_checkedKeys, e) {
    checkKeys = _checkedKeys;
    halfCheckKeys = e.halfCheckedKeys;
  }

  // 提交
  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });

      values.menuIdList = checkKeys.concat(halfCheckKeys); // 将勾选和半勾选节点合并
      values.id = rowId;

      await grantRoleMenu(rowId, values.menuIdList);
      createMessage.success(`操作成功`);
      // closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }

  // 递归遍历已选树区分父子节点集合
  function handleKeys(menuTree: any[], checkedIds: any[]) {
    menuTree.map((item) => {
      if (item.checked) {
        if (item.children && item.children.length > 0) {
          halfCheckKeys.push(item.id);
          handleKeys(item.children, checkedIds);
        } else {
          checkKeys.push(item.id);
        }
      }
    });
  }
</script>
