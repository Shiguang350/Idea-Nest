# 灵感收集（PWA）

一个纯前端灵感收集工具，支持想法、计划、图片、回收站，可以像手机 APP 一样安装到主屏幕。

## 部署

项目是纯静态文件，部署到任意 HTTPS 静态托管即可：

- GitHub Pages
- Vercel / Netlify
- Cloudflare Pages
- 自己的服务器

也可以本地预览：

```bash
python -m http.server 8080
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
- `manifest.webmanifest`：手机安装配置
- `sw.js`：离线缓存
- `icons/`：应用图标
