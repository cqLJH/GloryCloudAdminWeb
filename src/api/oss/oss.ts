import { UploadApiResult } from './model/uploadModel';
import { defHttp } from '/@/utils/http/axios';
import { AxiosProgressEvent } from 'axios';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';
const glob = useGlobSetting();

enum Api {
  // oss接口
  UpdateConfig = '/oss/api/config',
  GetConfig = '/oss/api/config',
  GetFlieList = '/oss/api/file',
  DeleteFiles = '/oss/api/file',
  Upload = '/oss/api/upload',
}

/**
 * oss上传接口
 */
export const getOssUrl = Api.Upload;

/**
 * 上传url
 */
const uploadUrl = `${glob.uploadUrl}${getOssUrl}`;

// 更新配置
export const updateConfig = (params: any) => defHttp.put({ url: Api.UpdateConfig, params });

// 获取配置
export const getConfig = () => defHttp.get({ url: Api.GetConfig });

// 获取分页列表
export const getFlieList = (params?: any) => defHttp.get<any>({ url: Api.GetFlieList, params });

// 批量删除文件
export const deleteFlies = (params: any) => defHttp.delete({ url: Api.DeleteFiles, params });

/**
 * 删除用户
 */
export const deleteFile = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.DeleteFiles, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      onUploadProgress,
    },
    params,
  );
}
