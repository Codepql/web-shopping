# 舒隅 · Cozy Corner

面向桌面与居家生活场景的 React 商品选购演示。按本次确认的要求，首版使用中文界面和人民币价格。

预期部署地址：<https://codepql.github.io/web-shopping/>。是否已上线以实际部署结果为准。

## 本地启动

需要 Node.js 22.12+（本次本地验证使用 Node.js 24）。

```bash
npm ci
npm run dev
```

打开终端打印的本地地址，默认是 <http://127.0.0.1:5173/>。

```bash
npm test
npm run build
npm run preview
```

生产预览地址默认是 <http://127.0.0.1:4173/web-shopping/>。Vite 配置对生产构建和生产预览使用 `/web-shopping/`，开发环境使用 `/`。

## 已实现

- 12 件模拟商品，按桌面好物、居家氛围、日常器物浏览。
- 按专注办公、晚间放松、300 元以内心意礼物选购。
- 关键词搜索、分类与场景组合筛选、价格升降序、无结果提示和一键恢复。
- 商品详情：图片、介绍、材质、规格、颜色及购买数量。
- 商品卡片快捷加购；重复加购合并同一行；每款限 20 件。
- 购物车修改数量、删除与 9 秒内撤销、单品金额和商品合计。
- `localStorage` 保存购物车；异常或过期数据自动校验；保存失败时显示提示。
- “立即购买”弹出友好说明，不创建订单、不请求支付，关闭后保留购物车。
- 桌面四列、平板三列、手机双列；手机筛选面板、全屏商品详情、固定购买操作区。
- URL 保留搜索、分类、场景、排序与商品详情链接。
- 键盘焦点、Esc 关闭、弹窗焦点约束与返回、辅助标签和减少动态效果支持。
- 商品图片与中文标题字体本地保存，页面运行不依赖外部图片或字体请求。

## 技术与结构

React 19 + TypeScript + Vite，使用 Radix Dialog 处理弹窗焦点和键盘行为，Lucide 提供图标。

```text
src/
  App.tsx                    页面与选购状态协调
  components/                商品、详情、购物车、购买提示等独立组件
  data/products.ts           商品数据与分类、场景
  lib/shop.ts                纯函数：购物车、金额、筛选、URL 状态
  lib/shop.test.ts           业务规则测试
  styles.css                 视觉变量与响应式样式
public/
  images/                    本地 WebP 图片
  fonts/                     中文标题字体子集与 OFL 许可证
tests/
  e2e.py                     桌面与手机实际选购流程
  accessibility.py           axe-core 自动无障碍检查
.github/workflows/deploy.yml  验证、构建与 GitHub Pages 部署
```

金额以整数“分”存储计算，合计由购物车与商品数据派生；使用 `Intl.NumberFormat` 显示人民币价格。界面状态与购物车 reducer 分离，无后端或密钥配置。

## 实际验证

`npm test`：6 项测试通过，覆盖重复加购合并、金额计算、数量边界、删除恢复、异常保存数据、组合筛选和排序。

浏览器端到端验证使用无头 Chromium，覆盖桌面和手机模拟视口的完整选购流程；检查 320、375、390、768、844、1024、1440px 宽度下的横向溢出。已对 `/web-shopping/` 生产构建运行相同流程。

无障碍自动检查使用 axe-core，对首页、商品详情、购物车、购买提示、手机筛选和手机详情执行 WCAG 2 A/AA 与 2.1 AA 规则检查；已检查页面未发现自动化规则违规。自动化检查不等同于完整无障碍认证或真实设备覆盖。

可选复现浏览器检查（需要 Python 3）：

```bash
python -m pip install playwright
python -m playwright install chromium
# 先在另一个终端运行 npm run dev
python tests/e2e.py
python tests/accessibility.py
# 或先 npm run build 与 npm run preview，再检查生产路径
python tests/e2e.py http://127.0.0.1:4173/web-shopping/
```

## GitHub Pages 部署

1. 将源码推送至公开仓库 `Codepql/web-shopping` 的 `main` 分支。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. `main` 分支推送会触发工作流，也可在 Actions 手动执行部署。
4. 工作流依次执行 `npm ci`、`npm test`、`npm run build` 并发布 `dist/`。
5. 等待工作流成功后，在未登录的浏览器访问 <https://codepql.github.io/web-shopping/>，检查图片、搜索、详情、加购、刷新和购买提示。

GitHub Actions 使用仓库自动提供的 `GITHUB_TOKEN`，不需要在源码中添加个人访问令牌。若仓库更名或改部署路径，需要修改 `vite.config.ts` 的生产 `base`。

## 取舍与限制

- 这是选购流程演示：商品、规格、价格和数量上限为模拟数据，图片为风格示意。
- 不包含后端、登录、真实库存、订单、支付、配送、税费或运费计算。
- 购物车仅在当前浏览器保存；未实现账号同步、跨标签页即时同步或离线应用安装。
- 首版按用户要求采用中文与人民币；未实现英语、多语言与多币种切换。
- 浏览器验收为 Chromium 与触屏视口模拟，未覆盖真实 iPhone、Safari、Firefox 或完整读屏体验。
- 12 件商品不需要分页或虚拟列表；优先保证查找与加购正确性、移动端体验和交付完整度。
- 没有使用网站或商城模板；代码从空目录编写。

## 素材与许可

照片来自 Unsplash，各文件原始地址记录于 `IMAGE-SOURCES.json`。图片仅用于本演示的风格展示，不代表实际售卖商品或品牌背书。正式商用应复核所用素材与具体用途的权利要求。

中文标题字体为 Noto Serif SC 子集，许可证位于 `public/fonts/OFL.txt`；普通正文使用系统字体。第三方依赖遵循各自许可证。

本项目不需要 API Key、`.env` 或其他敏感配置。源码交付不包含 `node_modules`。
