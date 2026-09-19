# 爪印留聲開發日誌

## 2026-09-19｜階段 1：工程初始化與頁面骨架

### 本輪範圍

- 建立全新的 Next.js、TypeScript、Tailwind CSS 工程。
- 建立 `/`、`/create`、`/m/[id]` 三個頁面骨架。
- 不串接 AI、檔案上傳、Supabase、3D 模型、QR Code 或動畫。
- 不讀取或遷移工作區內原有的 `stories/` 資料。

### 實際操作

1. 確認本機環境：Node.js v24.14.0、npm/npx 11.9.0、Git 2.53.0.windows.1。
2. 確認工作區原先沒有 `package.json`，且目前不在 Git repository 內。
3. 查詢 npm registry 的套件版本，建立工程設定並以精確版本安裝依賴。
4. `npm install --save-exact` 新增 49 個 packages；npm audit 回報 0 個 vulnerabilities。
5. 建立共用版面、全域樣式、產品首頁、建立流程預覽與公開回憶示例頁。
6. 將 `stories/`、環境檔、建置產物與常見大型媒體格式加入 `.gitignore`。

7. 啟動開發伺服器時發現 Next.js 因上層舊 lockfile 誤判 workspace root；在 `next.config.ts` 明確設定 `turbopack.root`，停止後重新啟動驗證，警告不再出現。
8. 建立開發日誌、測試清單、素材來源、AI 對話保存說明與專案 steering 規則。

### 實際驗證結果

- [x] `npm run typecheck`：Exit Code 0，沒有 TypeScript 錯誤。
- [x] `npm run dev -- --hostname 127.0.0.1 --port 3000`：Next.js 16.3.5 成功啟動；修正 workspace root 後 Ready in 553ms，無啟動錯誤。
- [x] PowerShell `Invoke-WebRequest`：`/`、`/create`、`/m/demo` 均回傳 HTTP 200。
- [x] 首輪路由 smoke test：三頁指定關鍵文字均存在於回應內容。
- [x] `npm run build`：Exit Code 0；production build 編譯、TypeScript、page data 與 static page generation 均成功。
- [x] 邊界檢查：應用程式與設定中未找到 Supabase、AI request、file input、model-viewer、qrcode 或動效套件實作。
- [x] 敏感資訊檢查：未找到常見 API key、access token 或 secret 指派，也沒有 `.env` 檔案。

未以瀏覽器實際檢查桌面與手機視覺配置，因此相關人工驗收仍保留為未通過狀態。

### 已知問題與未完成事項

- 上傳、資料保存、3D、影片、正式發布與 QR Code 均刻意留待後續階段。
- `/m/demo` 使用 emoji 與自行撰寫的介面作為明確標示的示例，不是 AI 模型結果或真實寵物資料。
- `npm ls --depth=0` 在建置後列出 `@emnapi/runtime` 與 `@img/sharp-wasm32` 為 extraneous；本輪未把它們加入直接依賴，production build 不受影響。
- AI 助手無法自動匯出完整原始會話，需由使用者手動匯出或完整複製到 `docs/ai-conversations/`。
- 尚未初始化 Git，也沒有建立 commit。

## 2026-09-19｜專案位置調整

### 實際操作

1. 停止在舊位置 `C:\Users\sheep\Desktop\代码\pawstory-web\.local-data` 執行的開發伺服器。
2. 檢查目標 `C:\Users\sheep\Desktop\代码\semantic-review`；保留其中原有的 `2026-09-19-010800-pr-local.md`，未讀取或修改該文件。
3. 將本階段建立的程式碼、設定與文件搬至目標資料夾。
4. 未搬移舊位置的 `stories/`、`node_modules/`、`.next/` 與 `tsconfig.tsbuildinfo`。
5. 在新位置以 `npm ci` 依照 lockfile 重新安裝 49 個 packages；npm audit 回報 0 個 vulnerabilities。

### 實際驗證結果

- [x] 新位置執行 `npm run typecheck`：Exit Code 0。
- [x] 新位置執行 `npm run build`：Exit Code 0，production build 成功。
- [x] 新位置啟動開發伺服器：Next.js 16.3.5 Ready in 759ms。
- [x] 從新位置提供的 `/`、`/create`、`/m/demo` 均回傳 HTTP 200，且指定關鍵文字存在。

### 未完成事項

- 舊位置仍保留未搬移的舊資料、依賴、建置產物、型別快取與空目錄；本輪未執行刪除，以免誤刪舊專案資料。
- Kiro 目前開啟的 workspace 仍指向舊位置；後續開發前，使用者需在 IDE 開啟 `C:\Users\sheep\Desktop\代码\semantic-review` 作為新 workspace。
- Git commit 與完整 AI 原始對話保存仍需由使用者處理。

## 2026-09-19｜留檔檢查、首次提交與部署準備

### 本輪範圍

- 核對完整 AI 對話是否已保存。
- 將豆包示例改為不預設寵物離世的日常情境。
- 檢查 Git 忽略規則與未來示例媒體部署方式。
- 準備首次 Git commit、GitHub repository 與公網部署。
- 不實作上傳、3D 或動畫。

### 實際操作與結果

1. 確認工作目錄為 `C:\Users\sheep\Desktop\代码\semantic-review`。
2. 检查使用者提供的转贴记录并保存为 `docs/ai-conversations/2026-09-19-transferred-excerpts.md`；文件保留来源与完整性说明。**已保存部分转贴记录，完整原始会话尚未归档。**
3. 未讀取 `stories/`，也未讀取或修改原有的 `2026-09-19-010800-pr-local.md`；已將該檔案加入精確忽略規則。
4. 從 `/m/demo` 移除 `2012 — 2025`，改為「和豆包一起的日常」與現在式描述。
5. 保留 `.env*`、`node_modules/`、`.next/`、`out/`、`build/` 與媒體副檔名等忽略規則。
6. 在 `docs/deployment.md` 明定後續示例影片與 GLB 由 Supabase Storage 提供公開唯讀 URL，不從 Git 或 Vercel deployment bundle 取得。
7. `npm run typecheck`：Exit Code 0。
8. `npm run build`：Exit Code 0；Next.js production build 成功，`/` 與 `/create` 為 static route，`/m/[id]` 為 dynamic route。

### 部署與提交狀態

- 使用者已提供本次 commit 的真實作者名稱與信箱；提交時僅使用單次参数，不修改全域 Git 設定。
- 部分转贴记录已归档；完整原始会话仍未归档。
- `gh` 與 `vercel` CLI 未安裝，亦未偵測到 GitHub／Vercel token。
- GitHub repository、production deployment 與公開 URL 尚未建立。
- Production `/`、`/create`、`/m/demo` 直接訪問、重新整理及免登入狀態均尚未驗證。

## 2026-09-19｜固定示例影片与真实二维码

### 本轮范围

- 只实现固定示例影片、指向既有 production 域名的二维码、下载与复制入口。
- 不接数据库、用户上传、3D 或动画。

### 实际改动

1. 检查 `public/demo/pet-memory.mp4`：31,307,151 bytes，ISO Base Media（`isom`）MP4，检测到 `avc1`（H.264）与 `mp4a`（AAC）标签。
2. 检查 `public/demo/pet-cover.jpg`：2,489,293 bytes，实际格式为 `image/jpeg`；画面是穿黄色雨衣、站在雨天街道上的狗狗。
3. 保留全局媒体忽略规则，只新增 `!/public/demo/pet-memory.mp4` 精确例外；其他 MP4 仍被忽略。
4. 精确安装 `qrcode@1.5.4` 与型别，并加入 `jsqr@1.4.0`、`pngjs@7.0.0` 作为本地二维码实际解码验证工具。
5. 使用 `qrcode` 生成 `public/demo/paw-memory-demo-qr.png`：360 × 360、黑白、H 纠错、4 模块静区，内容固定为 `https://paw-memory404.vercel.app/m/demo`。
6. `/m/demo` 改为移动端先显示豆包名字和真实 video；video 使用 `controls`、`playsInline`、`preload="metadata"`、封面 poster，不自动播放，加载失败时显示提示和直接视频链接。
7. 首页新增“手机扫码体验”，提供二维码 PNG 下载、复制固定链接与当前手机直接体验入口。
8. 页面明确标注固定示例，不宣称 AI 实时生成。

### 实际验证结果

- [x] `npm run generate:qr`：成功。
- [x] `npm run verify:qr`：jsQR 实际解码结果等于 `https://paw-memory404.vercel.app/m/demo`。
- [x] `npm run typecheck`：Exit Code 0。
- [x] `npm run build`：Exit Code 0。
- [x] 本地 production `/`、`/create`、`/m/demo` 均回传 HTTP 200 且关键内容存在。
- [x] 本地封面响应为 `image/jpeg`、2,489,293 bytes。
- [x] 本地影片响应为 `video/mp4`、31,307,151 bytes；Range `bytes=0-63` 回传 HTTP 206 与 64 bytes，不是 HTML 错误页。
- [x] 本地二维码响应为 `image/png`、3,073 bytes。
- [x] 暂存区敏感凭证扫描无命中，`stories/` 与原有本地 Markdown 均未提交。

### Git

- 功能 commit：`37cda0e41283fe0f3306661a1680b04f9ea70ca7`（`Add demo video and QR experience`）。
- 提交使用单次作者参数，没有修改全局 Git 配置。

### 待验证

- Production deployment 是否已更新，以及 production 页面、封面、影片与二维码 URL 的直接访问／刷新待部署完成后检查。
- 实际手机扫码、影片画面、声音与微信内播放未由本地自动验证，必须由使用者实测。
- 已有部分 AI 对话转贴记录继续保留；完整原始会话仍未归档。

## 2026-09-19｜Supabase 真實發布流程

### 本輪範圍

- 新增真實回憶的資料表、私有媒體儲存、建立表單上傳與公開讀取流程。
- 保留既有 `/m/demo` 固定示例，不以示例資料冒充真實發布結果。
- 本輪只完成程式與 SQL 準備；尚未連接或操作真實 Supabase 專案，也未驗證 Vercel production 流程。

### 實際改動

1. 新增 `supabase/setup.sql`：建立 `memories` 資料表、擁有者與已發布資料的 RLS、`pet-images`／`pet-videos` 兩個私有 bucket，以及驗證擁有者、草稿狀態、物件路徑、size 與 MIME 後原子發布的 `publish_memory` RPC。
2. 新增 `.env.example`，列出 `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 與固定 production `NEXT_PUBLIC_SITE_URL`；未填妥時建立頁會明確停用真實發布，不顯示假成功。
3. 新增 Supabase browser／server clients 與公開設定讀取；前端使用 publishable key，不加入 service role key。
4. `/create` 先驗證名字、暖心話、分享確認、檔案類型／大小及瀏覽器可解碼或載入，再進行 anonymous auth 與建立／更新 draft，無效輸入不會先建立匿名身分或草稿。
5. 照片與影片透過 TUS 直接上傳到各自私有 bucket；同一次頁面操作中手動重試會復用 draft、物件路徑及 TUS fingerprint／既有 upload，不重新建立已確認的上傳。
6. 每個物件上傳後先由 client 比對 Storage 回報的 size 與 MIME；發布前再次確認兩個物件，`publish_memory` RPC 也會再次核對 Storage object metadata，避免只有副檔名或前端宣告相符就發布。
7. 只有 `publish_memory` 回傳同一筆 `published` 記錄且照片、影片路徑完整後，介面才設定發布結果並進入成功狀態；失敗時保留可重試狀態。
8. 真實 `/m/[id]` 強制動態、每次 request 僅查詢 `published` 記錄，並為私有照片與影片即時建立短效 signed URL；`/m/demo` 分支與固定示例內容保持保留。

### 實際驗證結果

- [x] 獨立執行 `npm run typecheck`：Exit Code 0。
- [x] 獨立執行 `npm run build`：Exit Code 0。

### 尚未驗證

- [ ] `supabase/setup.sql` 尚未在真實 Supabase 專案執行。
- [ ] Supabase Authentication 的 Anonymous Sign-Ins 尚未在真實專案開啟或驗證。
- [ ] 本機與 Vercel 的三個必要環境變數尚未填入真實值並驗證。
- [ ] 尚未以兩筆不同擁有者記錄驗證資料列與 Storage object 隔離。
- [ ] 尚未在全新／未登入瀏覽器驗證已發布 `/m/[id]` 與其 signed media 可公開讀取。
- [ ] 尚未使用真實照片與影片驗證完整上傳、TUS 中斷恢復、size／MIME 確認及 RPC 發布。
- [ ] 尚未部署並驗證 Vercel production `/create` 的真實上傳按鈕與完成流程。

## 2026-09-19｜PawStory 穿戴式回忆展示升级

### 本轮范围

- 将网站展示主线更新为“把回忆穿在身上”，串联宠物穿戴、专属回忆牌、手机扫码与照片／影片。
- 保留现有 Supabase 匿名建立者、草稿、TUS 上传与重试复用、Storage 检查、`publish_memory` RPC、真实记录 URL 和动态 QR Code 流程。
- 未修改 `/m/[id]` 页面、not-found 页面、固定示例影片组件或 `/m/demo` 固定示例内容。
- 未新增套件、动效库、commit 或 push。

### 实际改动

1. 重做首页 hero、四段穿戴回忆路径、真实 demo QR 区与行动入口；移除“仅为界面 Demo、尚未启用上传”的过时说明，继续保留 `/create` 与 `/m/demo` 入口。
2. 新增可复用 `WearablePreview`：以 SVG／CSS 分层绘制穿背心的宠物与背部回忆牌，提供珊瑚橙、鼠尾草绿、晴空蓝三种服装换色、名字预览，以及点击牌子展开扫码说明与固定示例入口。
3. 穿戴预览明确标示为“穿戴概念预览”，并说明不是照片生成 3D、宠物模型、可打印文件或实际尺寸适配结果；示例二维码保持静止，不参与宠物浮动。
4. 新增轻量 `IntersectionObserver` reveal；加入 hero 分层入场、穿戴轻浮动、换色与按钮 hover，并用 `prefers-reduced-motion` 停止非必要动效。页面没有开场遮罩或操作阻挡。
5. 在建立表单侧栏复用轻量穿戴预览，名字直接绑定既有 `petName` state；未改动验证后才 auth／draft、TUS 上传重试、Storage 验证及 RPC 发布逻辑。
6. 发布成功区继续使用真实 `result.shareUrl` 与对应动态 QR Code，明确任何持有链接者均可访问，并保留“查看回忆页”“下载二维码”；新增打印、防水封装、平整安全固定与多手机扫码测试说明。
7. 更新站点 metadata、建立页标题说明与 footer，使文案与“把回忆穿在身上”一致，导航路由不变。

### 实际验证结果

- [x] `npm run typecheck`：Exit Code 0。
- [x] `npm run verify:qr`：实际解码为 `https://paw-memory404.vercel.app/m/demo`，图片尺寸 360 × 360。
- [x] `npm run build`：Exit Code 0；production build 编译与 TypeScript 检查成功，`/`、`/create` 静态生成，`/m/[id]` 保持动态渲染。

### Git

- 功能 commit：`9fd7cd7a0d95ffe9b70f26e33ed744ac907667e2`（`Redesign PawStory wearable memory experience`）。
- 提交使用单次作者参数，未修改全局 Git 配置。

### 明确未实现与待验证

- 未实现照片转 3D、宠物 3D 模型、STL／可打印文件导出或服装尺寸适配。
- 未在真实手机检查首页与建立页的视觉、触控、展开互动、reduced-motion 表现及横向溢出。
- 本轮未连接真实 Supabase 项目执行照片／影片上传、TUS 中断恢复、RPC 发布、真实动态 QR 下载或跨设备公开访问；这些云端流程仍待实际环境验证。
- 未制作或测试实体回忆牌；打印清晰度、防水封装、固定安全性与实际扫码距离仍需实物验证。
- 既有部分 AI 对话转贴记录继续保留；完整原始会话仍未归档。

## 2026-09-19｜3D 打印＋激光雕刻＋数字回忆制造展示

### 本轮范围

- 新增 `/make/[id]` 制造工作台、真实 Three.js 组合／分解预览、共享参数几何与 STL／SVG／ZIP 输出。
- 保留既有 Supabase、TUS、`publish_memory`、真实 shareUrl 和动态二维码流程；没有修改 `/m/demo` 固定分支或固定示例资源。
- 未读取或修改 `stories/`、`2026-09-19-010800-pr-local.md` 或临时审查目录；未 commit/push。

### 实际实现

1. 精确加入 `three@0.186.0`、`@types/three@0.186.0`、`jszip@3.10.2`、`sharp@0.35.4`、`tsx@4.23.13`；没有加入动画库。
2. 建立唯一 `TagParameters`（mm）与共享 geometry builder。Three.js 预览和 STLExporter 使用同一带双贯穿孔的圆角底座 BufferGeometry；默认 60 × 42 × 3 mm，面板同宽高、同孔位。
3. Three.js 预览提供 OrbitControls、镜头复位、自动旋转暂停、部件显隐、3D 打印／激光雕刻切换与分解／合拢；支持 reduced motion。QR 以独立静止检查图显示，不参加部件动画；失败时显示静态结构图和错误。
4. 柔性链接面料参照网格与透明宠物身体均为项目自建展示几何，只解释组合关系，不提供服装／面料 STL 下载，不宣称照片还原或合身设计。
5. `/make/demo` 明确为演示文件。真实 UUID 制作页只查询 `published` 记录的 `pet_name`，share URL 固定为 `https://paw-memory404.vercel.app/m/{id}`。
6. ASCII A–Z／0–9 标签使用 5×7 点阵轮廓，不输出 SVG `<text>`。中文名字不会被冒充为可靠轮廓；标签为空时禁用雕刻 SVG／ZIP。
7. SVG 使用 mm 尺寸、同值 viewBox、`cut-outline`／`engraving-content` 图层、真实 H 纠错 QR 与至少 4 modules 静区；红线只标示切割轮廓约定，黑色标示雕刻内容。
8. ZIP 包含底座 STL、雕刻 SVG、scadqr 原 MIT LICENSE 与 `MODIFICATIONS.md`。客户端会重导 STL、检查闭合与尺寸，并实际渲染 SVG 解码 QR；只有验证通过才显示对应下载按钮。
9. 首页主视觉改为真实 Three.js 制造组合；真实发布成功区新增 `/make/{id}` 入口，原“查看回忆页”“下载二维码”保留。
10. 新增 `/sources`、`docs/model-sources.md`、`docs/fabrication-modifications.md` 与 `THIRD_PARTY_LICENSES/scadqr-MIT.txt`。

### Git

- 功能 commit：`a1fe6cc27231182c5bd4ad8a4b088d8ee92769f9`（`Add fabrication model and engraving workbench`）。
- 提交使用单次作者参数，未修改全局 Git 配置。

### 来源与许可决定

- scadqr `demo_tag.scad`：固定 commit `a27e1feeed8b048b730fcd2620c0021b3b52a283`，Darwin Schuppan and contributors，MIT；采用圆角底板、固定孔、QR padding 结构思路并明确标示“基于开源模型改编”。未直接分发上游 SCAD。
- parametric-fabric-generator：固定 commit `2075e9a89a97850fd1732e9b2b7a3f9c7d933c01`，Hanno Witzleb／Xipit；无仓库级 LICENSE 且嵌入模型许可不同，只有评估，没有复制／分发，不提供其面料下载。
- openscad-web-gui：固定 commit `759feee04f5dbf846f4608c3359d5c157256fef3`，Clemens，GPL-3.0；是工具而非模型，只有评估，没有集成或复制代码。

### 自动验证结果

- [x] `npm run generate:fabrication`：生成 `demo-base.stl`（39,484 bytes）、`demo-panel.svg`（33,867 bytes）、`demo-fabrication-kit.zip`（11,877 bytes）。
- [x] `npm run verify:fabrication`：Three.js STLLoader 重导成功；bounding box 60 × 42 × 3 mm；788 triangles、1,182 unique edges、0 open edges、0 non-manifold edges。
- [x] 固定孔不侵入 QR 区，面板与底座宽高匹配；另验证 50 × 36 × 2、67 × 48 × 3.5、90 × 65 × 6 mm 参数样本。
- [x] SVG 为 60 mm × 42 mm、`viewBox="0 0 60 42"`，包含两个指定图层且不含 `<text>`。
- [x] 使用 Sharp 实际渲染 SVG，再以 jsQR 解码为 `https://paw-memory404.vercel.app/m/demo`。
- [x] ZIP 检查确认包含 STL、SVG、scadqr MIT LICENSE 与修改说明。

### 待实物／环境验证

- 未验证打印机、材料与激光设备公差；未提供激光功率、速度或 G-code。
- 未验证固定强度、防水、耐用、宠物舒适度、服装合身性或实体扫码距离。
- 没有实现照片转 3D、宠物精细模型、服装 STL 或尺寸适配。
- 真实 Supabase production 记录的 `/make/{uuid}` 查询、跨设备下载与实物制造仍需在已配置环境和目标设备验证。

### 最终工程验证补记

- [x] `npm run typecheck`：Exit Code 0。
- [x] 既有 `npm run verify:qr`：解码仍为 `https://paw-memory404.vercel.app/m/demo`，360 × 360；固定示例资源未修改。
- [x] 再次执行 `npm run generate:fabrication` 与 `npm run verify:fabrication`：结果保持通过，验证 manifest 已更新为 `verified: true`。
- [x] `npm run build`：Next.js 16.3.5 production build 成功；`/make/[id]` 为动态路由，`/sources` 静态生成。
