# 測試與驗收清單

> 本文件是待執行的驗收清單。只有實際驗證後才能勾選，不可將預期結果當作已通過結果。

## 階段 1：工程初始化與三頁骨架

### 自動檢查

- [x] `npm run typecheck` 無 TypeScript 錯誤。
- [x] `npm run build` 成功完成 production build。
- [x] 開發伺服器可啟動，且修正 workspace root 後沒有啟動錯誤。
- [x] `GET /` 回傳 HTTP 200。
- [x] `GET /create` 回傳 HTTP 200。
- [x] `GET /m/demo` 回傳 HTTP 200。

實際執行日期：2026-09-19。路由狀態以本機開發伺服器及 PowerShell `Invoke-WebRequest` 驗證。

### 瀏覽器手動驗收

- [ ] 首頁清楚呈現產品用途。
- [ ] 首頁同時有「體驗示例」與「開始製作」入口。
- [ ] 「體驗示例」可前往 `/m/demo`。
- [ ] 「開始製作」可前往 `/create`。
- [ ] `/create` 顯示照片、模型、影片與暖心話、發布與回憶牌的流程。
- [ ] `/create` 明確說明目前未開放上傳，且不可真的提交。
- [ ] `/m/demo` 明確標示為示例，不把素材或功能偽裝成真實結果。
- [ ] `/m/not-published` 顯示尚未發布狀態。
- [ ] 桌面寬度下沒有明顯溢位或內容遮擋。
- [ ] 手機寬度下可閱讀、按鈕可點擊且沒有水平捲動。

### 本階段邊界

- [x] 確認沒有 Supabase 或其他後端連線。
- [x] 確認沒有 AI API 呼叫。
- [x] 確認沒有檔案上傳、3D viewer、QR Code 產生或動效套件。
- [x] 確認掃描範圍沒有硬編碼 API 密鑰，且工作區沒有 `.env` 檔案。

以上以直接依賴清單、應用程式／設定關鍵字掃描、常見敏感指派模式掃描與環境檔案搜尋核對。

## 留檔、提交與公網部署準備

### 已執行

- [x] 確認工作目錄為 `C:\Users\sheep\Desktop\代码\semantic-review`。
- [x] 確認 `docs/ai-conversations/` 只有 `README.md`，不可認定完整對話已保存。
- [x] `/m/demo` 不含 `2012 — 2025`，並呈現「和豆包一起的日常」。
- [x] `.gitignore` 保留密鑰、環境檔、依賴與建置產物忽略規則。
- [x] 後續示例影片與 GLB 部署方式已記錄於 `docs/deployment.md`。
- [x] 修改後 `npm run typecheck` 通過。
- [x] 修改後 `npm run build` 通過。

### 待完成／待驗證

- [x] 已保存使用者提供的部分转贴记录，并保留非完整会话说明。
- [ ] 完整原始 AI 對話已由使用者手動匯出或完整複製。
- [ ] 已使用真實 Git 作者資訊建立首次 commit。
- [ ] 已建立並推送 GitHub repository。
- [ ] 已建立不要求評委登入的 production deployment。
- [ ] Production `/`、`/create`、`/m/demo` 可直接訪問並可重新整理。
- [ ] 使用未登入瀏覽器與手機行動網路完成 production 驗收。
