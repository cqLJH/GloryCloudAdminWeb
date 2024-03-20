/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-12-15 21:51:13
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-15 21:52:47
 * @FilePath: \GloryCloudWeb\src\components\BatchButton\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { withInstall } from '@/utils';
import batchButton from './BatchButton.vue';
import batchDelete from './BatchDelete.vue';

export const BatchButton = withInstall(batchButton);
export const BatchDelete = withInstall(batchDelete);
