/*
 * @Author: LJH 424122999@qq.com
 * @Date: 2023-12-15 14:27:31
 * @LastEditors: LJH 424122999@qq.com
 * @LastEditTime: 2023-12-19 17:08:16
 * @FilePath: \GloryCloudWeb\src\utils\dictUtil.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Persistent } from '/@/utils/cache/persistent';
import { CacheTypeEnum, DICT_TYPE_TREE_DATA } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';
import type { App } from 'vue';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

/**
 * 设置缓存字典集合
 */
export function setDictCache(value) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(DICT_TYPE_TREE_DATA, value, true);
}

/**
 * 获取缓存字典集合
 */
export function getDictCache<T>() {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(DICT_TYPE_TREE_DATA) as T;
}

export function getDict() {
  return getDictCache();
}

/**
 * 字典翻译方法，界面插槽使用方法 {{ $TOOL.dictType('sex', record.sex) }}
 * @param dictValue 字典类型
 * @param value 字典值
 * @returns 字典文本
 */
export function dictTypeData(dictValue: string, value: any) {
  value = value.toString();
  const dictTypeTree = getDictCache<any>();
  if (!dictTypeTree) {
    return '需重新登录';
  }
  const tree = dictTypeTree.find((item) => item.dictValue === dictValue);
  if (!tree) {
    return '无此字典';
  }
  const children = tree.children;
  const dict = children.find((item) => item.dictValue === value);
  return dict ? dict.dictLabel : '无此字典项';
}

/**
 * 获取某个code下字典的列表
 * @param dictValue 字典code
 * @returns 集合
 */
export function dictList(dictValue: string) {
  const dictTypeTree = getDictCache<any>();
  if (!dictTypeTree) {
    return [];
  }
  const tree = dictTypeTree.find((item) => item.dictValue === dictValue);
  if (tree) {
    return tree.children.map((item) => {
      return {
        value: item['dictValue'],
        label: item['dictLabel'],
      };
    });
  }
  return [];
}

/**
 * 挂载字典翻译全局函数
 * @param app
 */
export default function dictFilters(app: App) {
  app.config.globalProperties.$filters = {
    /**
     * 字典翻译方法，界面插槽使用方法 {{ $TOOL.dictType('sex', record.sex) }}
     * @param dictValue 字典类型
     * @param value 字典值
     * @returns 字典文本
     */
    dictFormat: (dictValue: string, value: string) => {
      return dictTypeData(dictValue, value);
    },

    /**
     * 获取某个code下字典的列表
     * @param dictValue 字典code
     * @returns 集合
     */
    dictList: (dictValue: string) => {
      return dictList(dictValue);
    },
  };
}
