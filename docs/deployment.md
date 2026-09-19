# 公網部署與媒體資產策略

## Web 應用部署

- 原始碼預計推送到 GitHub repository。
- Next.js 應用預計部署到 Vercel；目前不需要額外的 `vercel.json`。
- Production deployment 必須允許未登入的評委直接瀏覽 `/`、`/create` 與 `/m/demo`，不可啟用 Vercel Deployment Protection 或其他平台登入限制。
- GitHub repository 與 Vercel project 尚未建立或連結；實際 URL 在成功建立後補記。

## 示例影片與 GLB

未來的示例影片和 GLB **不放入 Git repository，也不依賴 Vercel 靜態打包**。本專案保留 `*.mp4`、`*.mov`、`*.webm`、`*.glb`、`*.gltf` 的忽略規則，避免不必要的大型媒體進入 Git history。

後續媒體階段採用以下方式：

1. 在 Supabase 建立專用 Storage bucket，例如 `demo-assets`。
2. 將經授權、壓縮後的示例影片與 GLB 上傳到該 bucket。
3. Demo 若要讓評委免登入直接播放，示例 bucket／物件需提供公開唯讀 URL；私人寵物資料不得沿用公開策略。
4. 應用程式只保存並引用 Supabase Storage URL，不引用開發者電腦上的本機路徑。
5. 部署後以無痕視窗或未登入手機驗證 URL 可讀、CORS 正確、影片可播放且 GLB 可載入。
6. 若媒體尚未上傳，介面必須維持明確佔位，不得顯示為已可播放或已載入。

如此即使 Git 忽略媒體副檔名，production 也不會期待從部署包取得這些檔案。若未來改採 `public/` 內建示例素材，必須先修改 `.gitignore`、確認素材已被 Git 追蹤，並檢查 GitHub 與部署平台的檔案大小限制後才能部署。

## 部署後驗收

- [ ] Production 首頁可在未登入狀態直接開啟。
- [ ] 直接輸入 production `/create` 可開啟，重新整理後仍正常。
- [ ] 直接輸入 production `/m/demo` 可開啟，重新整理後仍正常。
- [ ] 評委不需要 GitHub、Vercel 或 Supabase 平台帳號。
- [ ] 手機行動網路可開啟 production URL。

以上項目必須在取得 production URL 並實際驗證後才能勾選。
