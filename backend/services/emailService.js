const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    const emailUser = (process.env.EMAIL_USER || 'sagar.kiaan12@gmail.com').trim();
    const emailPassword = (process.env.EMAIL_PASSWORD || 'unwd ukpb xgbf psdj').trim();
    
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    // Silent initialization - only log in development if needed
    if (process.env.NODE_ENV === 'development' && process.env.VERBOSE_LOGS === 'true') {
      console.log('📧 Email Service initialized');
    }
  }

  /**
   * Send password reset email
   * @param {string} email - Recipient email
   * @param {string} resetToken - Password reset token
   * @param {string} userType - Type of user (admin, employee, pm, sales)
   * @returns {Promise<Object>} - Email sending result
   */
  async sendPasswordResetEmail(email, resetToken, userType = 'user') {
    try {
      // Verify transporter connection
      await this.transporter.verify();
      
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&type=${userType}`;
      
      const mailOptions = {
        from: `"Appzeto" <${process.env.EMAIL_USER || 'sagar.kiaan12@gmail.com'}>`,
        to: email,
        subject: 'Password Reset Request - Appzeto',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 20px 0; text-align: center; background-color: #14b8a6;">
                  <h1 style="color: #ffffff; margin: 0;">Appzeto</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 20px; background-color: #ffffff;">
                  <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto;">
                    <tr>
                      <td>
                        <h2 style="color: #333333; margin-top: 0;">Password Reset Request</h2>
                        <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                          Hello,
                        </p>
                        <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                          We received a request to reset your password for your Appzeto account. Click the button below to reset your password:
                        </p>
                        <table role="presentation" style="margin: 30px 0;">
                          <tr>
                            <td style="text-align: center;">
                              <a href="${resetUrl}" 
                                 style="display: inline-block; padding: 12px 30px; background-color: #14b8a6; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="color: #666666; font-size: 14px; line-height: 1.6;">
                          Or copy and paste this link into your browser:
                        </p>
                        <p style="color: #14b8a6; font-size: 14px; word-break: break-all;">
                          ${resetUrl}
                        </p>
                        <p style="color: #999999; font-size: 12px; line-height: 1.6; margin-top: 30px;">
                          This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
                        </p>
                        <p style="color: #999999; font-size: 12px; line-height: 1.6;">
                          For security reasons, never share this link with anyone.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
                  <p style="color: #999999; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} Appzeto. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log(`Password reset email sent to ${email}:`, info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        message: 'Password reset email sent successfully'
      };
    } catch (error) {
      console.error('Email Service Error:', error);
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }
}

module.exports = new EmailService();
