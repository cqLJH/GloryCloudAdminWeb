/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-12-13 15:16:29
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-13 15:16:40
 * @FilePath: \GloryCloudWeb\src\api\blog\config.ts
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  UpdateConfig = '/blog/api/config',
  GetConfig = '/blog/api/config',
}

// 更新配置
export const updateConfig = (params: any) => defHttp.put({ url: Api.UpdateConfig, params });

// 获取配置
export const getConfig = () => defHttp.get({ url: Api.GetConfig });
