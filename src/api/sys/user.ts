/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-11-15 18:00:12
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2024-02-28 16:54:43
 * @FilePath: \vue-vben-admin-main\src\api\sys\user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/auth/api/session',
  Logout = '/auth/api/session',
  GetCaptcha = '/auth/api/session/getCaptcha',
  CheckCaptcha = '/auth/api/session/checkCaptcha',
  GetUserInfo = '/usr/api/users/current',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

/**
 * @description: getCaptcha
 */
export function getCaptcha() {
  return defHttp.get<any>({ url: Api.GetCaptcha }, { errorMessageMode: 'none' });
}
/**
 * @description: checkCaptcha
 */
export function checkCaptcha(params: any) {
  return defHttp.post<any>({ url: Api.CheckCaptcha, params }, { errorMessageMode: 'none' });
}

// export function getPermCode() {
//   return defHttp.get<string[]>({ url: Api.GetPermCode });
// }

export function doLogout() {
  return defHttp.delete({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
