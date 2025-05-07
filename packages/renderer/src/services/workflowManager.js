import sheetsService from './sheetsService';
import emailService from './emailService';

class WorkflowManager {
  constructor() {
    this.isRunning = false;
    this.currentState = null;
  }

  async initialize(config) {
    try {
      // Initialize Google Sheets service
      const sheetsInitialized = await sheetsService.initialize(config.sheetsCredentials);
      if (!sheetsInitialized) {
        throw new Error('Failed to initialize Google Sheets service');
      }

      // Initialize Email service
      const emailInitialized = await emailService.initialize(config.emailConfig);
      if (!emailInitialized) {
        throw new Error('Failed to initialize Email service');
      }

      return true;
    } catch (error) {
      console.error('Error initializing workflow:', error);
      return false;
    }
  }

  async startWorkflow(spreadsheetId) {
    if (this.isRunning) {
      throw new Error('Workflow is already running');
    }

    this.isRunning = true;
    this.currentState = 'reading_sheets';

    try {
      // Step 1: Read pending emails from sheets
      const pendingEmails = await sheetsService.readPendingEmails(spreadsheetId);
      this.currentState = 'processing_emails';

      if (pendingEmails.length === 0) {
        this.isRunning = false;
        return { success: true, message: 'No pending emails found' };
      }

      // Step 2: Send emails
      this.currentState = 'sending_emails';
      const results = await emailService.sendBulkEmails(pendingEmails);

      // Step 3: Update status in sheets
      this.currentState = 'updating_status';
      for (const result of results) {
        const email = pendingEmails.find(e => e.id === result.id);
        if (email && result.success) {
          await sheetsService.updateEmailStatus(
            spreadsheetId,
            email.rowIndex,
            'finished'
          );
        }
      }

      this.isRunning = false;
      return {
        success: true,
        message: `Processed ${results.length} emails`,
        results,
      };
    } catch (error) {
      this.isRunning = false;
      console.error('Workflow error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  getCurrentState() {
    return {
      isRunning: this.isRunning,
      state: this.currentState,
    };
  }
}

export default new WorkflowManager(); 