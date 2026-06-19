GAS 部署說明

此資料夾包含 `saveTasks.gs`，用於將 POST 傳來的 tasks 寫入 Google 試算表。

快速部署（用 Apps Script 編輯器）
1. 進入 https://script.google.com/ ，建立專案。
2. 貼上 `saveTasks.gs` 的程式碼。
3. 修改 `SHEET_ID` 常數為你的試算表 ID（或在程式中改成從請求取得）。
4. `Deploy -> New deployment`，選擇 `Web app`。
   - `Execute as`: Me
   - `Who has access`: Anyone（或 Anyone with link）
5. 部署並複製 Web app URL。
6. 在應用的 `GAS Webapp URL` 欄位貼上此 URL，按「備份到 Google Sheets」。

使用 `clasp`（命令列）
1. 安裝 clasp：

```bash
npm install -g @google/clasp
clasp login
```

2. 初始化或連結到專案：

```bash
clasp create --type webapp --title "NaCl Tasks Backup" --rootDir ./gas
# 或：
clasp clone <scriptId>
```

3. 推送：

```bash
clasp push
```

4. 在 Apps Script 編輯器部署 Web app，並設定存取權限。

安全性與注意事項
- 若將 Web app 設為公開，任何拿到 URL 的人都能寫入試算表，請評估風險。
- 若需要驗證，考慮在 GAS 中檢查一個簡單的 API key 或在前端使用 OAuth 流程。