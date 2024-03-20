<!--
 * @Author: LJH 52238648+cqLJH@users.noreply.github.com
 * @Date: 2022-10-27 14:36:29
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-11-16 16:21:36
 * @FilePath: \GloryApp\src\components\Markdown\src\MavonEditor.vue
-->
<template>
  <div id="mavon-editor-id">
    <mavon-editor v-model="editor_value" :style="style" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Mavon from 'mavon-editor';
  import 'mavon-editor/dist/css/index.css';

  export default defineComponent({
    name: 'MarkdownEditor',
    components: {
      'mavon-editor': Mavon.mavonEditor,
    },

    props: {
      value: { type: String, default: '' },
      style: { type: String, default: '' },
    },
    emits: ['change', 'get', 'update:value'],
    data() {
      return {
        editor_value: '',
      };
    },
    watch: {
      value: function (c: string) {
        this.editor_value = c;
      },
      editor_value: function (v: string) {
        this.$emit('change', v);
        this.$emit('update:value', v);
      },
    },
  });
</script>

<style>
  #mavon-editor-id .shadow.v-note-wrapper.markdown-body {
    z-index: 1;
    word-wrap: break-word !important;
    word-break: break-all !important;
  }

  #mavon-editor-id .v-note-wrapper.fullscreen {
    height: 100vh !important;
  }

  #mavon-editor-id .fullscreen.shadow.v-note-wrapper.markdown-body {
    z-index: 1000;
  }
</style>
