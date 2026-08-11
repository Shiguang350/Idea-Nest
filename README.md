# 灵感收集（PWA）

一个灵感收集工具，支持想法、计划、图片、回收站、想法/计划编辑和 AI 配图，可以像手机 APP 一样安装到主屏幕。

## 功能

- 想法：新建、查看、编辑、删除、转为计划
- 计划：新建、查看、编辑、删除、标记完成
- 图片：手动上传、AI 配图、详情页预览
- 回收站：误删恢复、永久删除、清空
- PWA：手机安装、离线使用

## 部署（推荐 Vercel）

AI 配图需要一个轻量 Serverless 接口，建议用 Vercel 部署：

1. 把项目推到 GitHub 仓库
2. 打开 https://vercel.com/new
3. 导入这个仓库，框架选择 `Other`，直接部署
4. 部署完成后会得到一个 HTTPS 地址

AI 配图默认使用免费的 Pollinations 图像接口，不需要配置 API Key。
以后想换成付费接口，只需要在 Vercel 环境变量里设置 `IMAGE_API_BASE`。

纯静态部署（GitHub Pages）也能打开应用，但 AI 配图按钮不可用。

## 本地预览

```bash
node server.js
```

然后打开 `http://localhost:8080`。

## 安装到手机

1. 把项目部署到 HTTPS 地址
2. 用手机浏览器打开该地址
3. Android Chrome：右上角菜单 →「安装应用」或「添加到主屏幕」
4. iPhone Safari：分享按钮 →「添加到主屏幕」

安装后可以全屏打开，首次访问后也能离线使用。

## 数据说明

- 数据保存在手机浏览器的 `localStorage` 中
- 换手机或清理浏览器数据会丢失，请自行留意
- 图片会压缩后保存，个人使用足够，但不要塞太多大图

## 文件

- `index.html`：应用主体
- `api/generate-image.js`：AI 配图代理接口
- `manifest.webmanifest`：手机安装配置
- `sw.js`：离线缓存
- `icons/`：应用图标
