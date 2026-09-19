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
