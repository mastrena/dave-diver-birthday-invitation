# BLUE HOLE BIRTHDAY｜潜水冒险生日邀请函

一份专为手机设计的互动生日邀请函模板。访客会像接受游戏任务一样打开邀请函，经历下潜、接受生日委托、参加 20 秒生日补给打捞、查看派对日程和地图，最后完成赴约登记。

项目只使用 HTML、CSS 和 JavaScript，不需要安装软件包，也没有构建步骤。

## 新手只改一个文件

打开 [`config.js`](./config.js)，依次替换：

- 寿星姓名
- 日期和时间
- 地点、交通说明和地图链接
- 邀请文案、礼物说明和结尾文案
- 当天流程
- 角色来电、随机祝福、生日补给小游戏与通关彩蛋
- 与婚礼版一致的《潜水员戴夫》官方音乐试听链接，也可关闭或替换成自己的音乐

改完后双击 `index.html` 即可预览。页面结构、样式和交互都不需要修改。

## 项目结构

```text
dave-diver-birthday-invitation/
├── config.js               # 只改这里：所有个性化内容
├── index.html              # 页面结构，一般不用改
├── style.css               # 视觉样式，一般不用改
├── app.js                  # 页面交互，一般不用改
├── assets/                 # 场景、角色、音乐和分享图
├── GUIDE.zh-CN.md          # 零基础操作教程
├── AI_SETUP_PROMPT.md      # 交给 AI 自动定制的提示词
├── COPYRIGHT_NOTICE.md     # 版权提示
├── THIRD_PARTY_ASSETS.md   # 第三方素材说明
└── LICENSE                 # 原项目代码的 MIT 许可证
```

## 当前登记模式

赴约登记是安全演示：内容只保存在填写者自己的浏览器中，不会上传，也不会形成寿星可查看的名单。

如需真实收集，请另行接入合规的表单或后端，并明确告知访客数据用途。不要把数据库密码或密钥写在前端文件里。

## 发布

在线演示：[https://mastrena.github.io/dave-diver-birthday-invitation/](https://mastrena.github.io/dave-diver-birthday-invitation/)

可以直接上传到 GitHub Pages、Cloudflare Pages 或其他静态网站托管服务。发布、复制链接、微信分享、生成二维码和后续更新的零基础步骤，都写在 [`GUIDE.zh-CN.md`](./GUIDE.zh-CN.md) 中。

## 非官方声明

本项目为非官方粉丝创作模板，与游戏开发商、发行商或相关权利人无隶属、赞助或认可关系。公开传播或商业使用前，应将游戏角色、场景、Logo、字体和音乐替换为原创或已获授权素材。

项目代码沿用原仓库的 MIT 许可证；游戏相关图片等第三方素材不包含在该许可证中。
