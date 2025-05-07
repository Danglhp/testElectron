import { google } from 'googleapis';

class SheetsService {
  constructor() {
    this.auth = null;
    this.sheets = null;
  }

  async initialize(credentials) {
    try {
      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      return true;
    } catch (error) {
      console.error('Error initializing Google Sheets:', error);
      return false;
    }
  }

  async readPendingEmails(spreadsheetId, range = 'A:E') {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values || [];
      const pendingEmails = rows
        .filter((row) => row[4] === 'pending')
        .map((row) => ({
          id: row[0],
          recipients: row[1].split(',').map(email => email.trim()),
          title: row[2],
          content: row[3],
          status: row[4],
          rowIndex: rows.indexOf(row) + 1, // 1-based index for sheets
        }));

      return pendingEmails;
    } catch (error) {
      console.error('Error reading pending emails:', error);
      throw error;
    }
  }

  async updateEmailStatus(spreadsheetId, rowIndex, status) {
    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `E${rowIndex}`,
        valueInputOption: 'RAW',
        resource: {
          values: [[status]],
        },
      });
      return true;
    } catch (error) {
      console.error('Error updating email status:', error);
      throw error;
    }
  }
}

export default new SheetsService(); 