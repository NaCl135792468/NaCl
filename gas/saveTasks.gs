/**
 * Google Apps Script Web App to accept POSTed tasks JSON and append to a Spreadsheet.
 * Usage:
 * 1. Create a Google Sheet and note its ID (from the URL).
 * 2. Set the SHEET_ID below or deploy as a webapp and pass sheetId via query.
 * 3. Deploy the script as Web App (Execute as: Me, Who has access: Anyone with the link).
 * 4. POST JSON to the webapp URL with body: { tasks: [ { title, time, priority, notes, tags, recurrence, done } ] }
 */

const SHEET_ID = 'REPLACE_WITH_YOUR_SHEET_ID';
const SHEET_NAME = 'Tasks';

function doPost(e) {
  try {
    const body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : null;
    if (!body || (!Array.isArray(body.tasks) && !Array.isArray(body))) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid payload, expected { tasks: [...] } or [...]' })).setMimeType(ContentService.MimeType.JSON);
    }

    const tasksPayload = Array.isArray(body.tasks) ? body.tasks : body;
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    const headers = ['title', 'time', 'priority', 'notes', 'tags', 'recurrence', 'done'];
    if (sheet.getLastRow() === 0) sheet.appendRow(headers);

    const rows = tasksPayload.map(t => [
      t.title || '',
      t.time || t.datetime || '',
      t.priority || '',
      t.notes || '',
      (t.tags || []).join(','),
      t.recurrence || '',
      t.done ? '1' : '0'
    ]);

    if (rows.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({ message: 'No tasks to insert', inserted: 0 })).setMimeType(ContentService.MimeType.JSON);
    }

    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    return ContentService.createTextOutput(JSON.stringify({ message: 'OK', inserted: rows.length })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}
