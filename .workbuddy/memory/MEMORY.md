# 项目长期约定：dave-diver-birthday-invitation

## 仓库与发布

- GitHub 仓库：mastrena/dave-diver-birthday-invitation（Public，默认分支 main）。
- 在线地址：https://mastrena.github.io/dave-diver-birthday-invitation/ （GitHub Pages，源为 main 分支根目录，含 `.nojekyll`）。
- 姊妹项目：mastrena/dave-diver-wedding-invitation（婚礼请柬，同为 Public）。
- 更新方式：本地改完 `config.js` 等文件后 git commit + push 到 main，Pages 约 40 秒后自动生效。

## 项目结构约定

- 只需改 `config.js`（寿星信息、时间、地点、文案、流程、角色来电、祝福、音乐）；`index.html` / `style.css` / `app.js` 不改。
- 纯静态、无构建步骤，双击 index.html 即可预览。
- 赴约登记为纯前端演示，数据只存浏览器，不上传。

## 部署工具链约束

- GitHub MCP 连接器无法创建仓库（403），且不支持二进制文件上传；含图片的全量部署必须走 classic PAT + git push。
- 本机无 gh CLI、无全局 gitconfig、无钥匙串凭据，commit 需内联指定 user.name / user.email。

## 合规

- 非官方粉丝创作，assets 内游戏素材未获授权；公开传播或商用前须替换为原创/已授权素材（详见 COPYRIGHT_NOTICE.md）。
