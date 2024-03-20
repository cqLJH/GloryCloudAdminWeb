/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-11-15 18:00:12
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-25 12:23:19
 * @FilePath: \GloryCloudWeb\src\components\Markdown\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { withInstall } from '@/utils';
import markDown from './src/Markdown.vue';
import markDownViewer from './src/MarkdownViewer.vue';
import markdownEditor from './src/MarkdownEditor.vue';

export const MarkDown = withInstall(markDown);
export const MarkdownViewer = withInstall(markDownViewer);
export const MarkdownEditor = withInstall(markdownEditor);
export * from './src/typing';
