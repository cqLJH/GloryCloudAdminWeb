## 特性

- **最新技术栈**：使用 Vue3/vite2 等前端前沿技术开发
- **TypeScript**: 应用程序级 JavaScript 的语言
- **主题**：可配置的主题
- **国际化**：内置完善的国际化方案
- **Mock 数据** 内置 Mock 数据方案
- **权限** 内置完善的动态路由权限生成方案
- **组件** 二次封装了多个常用的组件

## 预览

- [GloryAdmin](http://test.icqcore.com/) - 预览地址
- [vue-vben-admin](https://vben.vvbin.cn/) - 完整版中文站点
- [vue-vben-admin-gh-pages](https://anncwb.github.io/vue-vben-admin/) - 完整版 github 站点
- [vben-admin-thin-next](https://vben.vvbin.cn/thin/next/) - 简化版中文站点
- [vben-admin-thin-gh-pages](https://anncwb.github.io/vben-admin-thin-next/) - 简化版 github 站点

## 文档

后端整理中。。。

[前端文档地址](https://doc.vvbin.cn/)

## 准备

- [node](http://nodejs.org/) 和 [git](https://git-scm.com/) -项目开发环境
- [Vite](https://vitejs.dev/) - 熟悉 vite 特性
- [Vue3](https://v3.vuejs.org/) - 熟悉 Vue 基础语法
- [TypeScript](https://www.typescriptlang.org/) - 熟悉`TypeScript`基本语法
- [Es6+](http://es6.ruanyifeng.com/) - 熟悉 es6 基本语法
- [Vue-Router-Next](https://next.router.vuejs.org/) - 熟悉 vue-router 基本使用
- [Ant-Design-Vue](https://antdv.com/docs/vue/introduce-cn/) - ui 基本使用
- [Mock.js](https://github.com/nuysoft/Mock) - mockjs 基本语法

## 安装使用

- 获取项目代码

```bash
git clone https://github.com/cqLJH/GloryCloudAdminWeb.git
```

- 安装依赖

```bash
cd GloryCloudAdminWeb

pnpm install

```

- 运行

```bash
pnpm serve
```

- 打包

```bash
pnpm build
```

- docker

### dockerFile 位于项目根目录下 并且支持差异化部署

#### 构建镜像

```bash
docker build -t vue-vben-admin .
```

#### 动态使用环境变量实现容器差异化部署,通过不同的 VG_BASE_URL 环境变量，指向不同的后端服务地址，下面例子使用 http://localhost:3333 作为后端服务地址，并且将容器映射到 6666 端口

```bash
docker run --name vue-vben-admin -d -p 6666:80  -e VG_BASE_URL=http://localhost:3333 vue-vben-admin
```

而后可以打开 http://localhost:6666 访问

## 原 vben-admin 项目地址

- [vue-vben-admin](https://github.com/anncwb/vue-vben-admin) - 完整版
- [vue-vben-admin-thin-next](https://github.com/anncwb/vben-admin-thin-next) - 简化版

## Git 贡献提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中

## 浏览器支持

本地开发推荐使用`Chrome 80+` 浏览器

支持现代浏览器, 不支持 IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: | :-: |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 相关仓库

如果这些插件对你有帮助，可以给一个 star 支持下

- [vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock) - 用于本地及开发环境数据 mock
- [vite-plugin-html](https://github.com/anncwb/vite-plugin-html) - 用于 html 模版转换及压缩
- [vite-plugin-compression](https://github.com/anncwb/vite-plugin-compression) - 用于打包输出.gz|.brotil 文件
- [vite-plugin-svg-icons](https://github.com/anncwb/vite-plugin-svg-icons) - 用于快速生成 svg 雪碧图

## 维护者

[@Vben](https://github.com/anncwb) [@Jinmao](https://github.com/jinmao88)

## License

[MIT © 2024](./LICENSE)
