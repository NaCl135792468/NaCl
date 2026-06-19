# NaCl

此專案為純前端的「任務日程規劃器」，可在本地或 GitHub Pages 上部署。主要功能包含：任務 CRUD、標籤、進階重複排程、日曆與週檢視，並支援匯入/匯出（JSON/CSV/XLSX）。

快速上手
1. 開啟 `index.html` 即可在瀏覽器使用（建議透過本機 server 或 GitHub Pages）。
2. 新增任務時可填寫 `標籤`（以逗號分隔）與 `重複`（可設定間隔、每週星期、結束日期）。

API 自動匯入
- 在頁面右上輸入 `API URL`（該 API 需回傳 JSON 陣列或 { tasks: [...] }），按 `從 API 匯入` 即可把任務匯入到本地應用。

備份到 Google Sheets（使用 Google Apps Script）
1. 開啟 Google Drive，建立一個新的 Google Sheet，記下網址中的 Sheet ID。
2. 在 [gas/saveTasks.gs](gas/saveTasks.gs) 將 `SHEET_ID` 改為你的試算表 ID，或在部署時改寫程式以從請求參數取得。
3. 在 Apps Script 編輯器貼上 `gas/saveTasks.gs`，然後 `Deploy -> New deployment`，選擇 `Web app`，`Execute as`: Me，`Who has access`: Anyone（或根據需求調整）。取得 Web app URL。
4. 回到應用，在 `GAS Webapp URL` 欄位貼上該 URL，按 `備份到 Google Sheets`，即可把目前 `tasks` 以 POST 傳送到你的試算表。

注意：若 Web App 設為需要登入，則需以 OAuth 授權流程或把授權改為 Anyone with link（視安全需求）。

部署到 GitHub Pages
1. 將專案推到 GitHub（例如 `youruser/NaCl`）。
2. 到該 repository 的 `Settings -> Pages`，選擇 `Branch`: `main` 並選 `/(root)` 作為資料夾，儲存。
3. 幾分鐘後會產生一個 GitHub Pages 網址（類似 `https://youruser.github.io/NaCl/`）。把網址提供給我或直接在瀏覽器開啟。

自動部署到 GitHub Pages（CI）
1. 此專案已包含 GitHub Actions workflow：`.github/workflows/gh-pages.yml`，會在每次 push 到 `main` 時自動執行，使用 `peaceiris/actions-gh-pages` 把網站內容發佈到 `gh-pages` 分支。
2. 發佈成功後，GitHub Pages 網址通常為 `https://<youruser>.github.io/<repo>/`（或在 repository Settings -> Pages 查看）。
3. 若你需要我代為觸發或協助設定 repo 的 Pages 選項，我可以協助。

Apps Script 範例
請參見 `gas/saveTasks.gs` 與 `gas/README.md` 取得 GAS 部署與 `clasp` 使用說明。

安全性與 CORS
- 若要直接從瀏覽器呼叫外部 API，API 必須允許 CORS（回應 header `Access-Control-Allow-Origin: *`），否則瀏覽器會阻擋請求。

如需我替你：
- 把應用部署到 GitHub Pages（我可以幫你建立 `gh-pages` 分支或指引完整步驟）。
- 幫你設置 Apps Script 的 OAuth 與更安全的寫入流程。

有任何想先做的步驟嗎？例如：我幫你把 repo 自動發佈到 GitHub Pages，或示範如何在 Apps Script 取得並顯示已備份紀錄。