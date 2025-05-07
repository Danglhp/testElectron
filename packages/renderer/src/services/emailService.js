import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
  }

  async initialize(config) {
    try {
      this.transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.user,
          pass: config.password,
        },
      });

      // Verify connection configuration
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Error initializing email service:', error);
      return false;
    }
  }

  async sendEmail(emailData) {
    try {
      const { recipients, title, content } = emailData;
      
      const mailOptions = {
        from: this.transporter.options.auth.user,
        to: recipients.join(','),
        subject: title,
        text: content,
        html: content, // Assuming content might be HTML
      };

      const info = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendBulkEmails(emails) {
    const results = [];
    
    for (const email of emails) {
      const result = await this.sendEmail(email);
      results.push({
        id: email.id,
        ...result,
      });
    }

    return results;
  }
}

export default new EmailService(); 