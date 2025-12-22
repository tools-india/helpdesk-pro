const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send verification email
exports.sendVerificationEmail = async (email, name, verificationUrl) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Helpdesk System <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Email Verification - Helpdesk System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Email Verification</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for signing up with Helpdesk System. Please verify your email address by clicking the button below:</p>
              <center>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </center>
              <p><small>Or copy this link: ${verificationUrl}</small></p>
              <p><strong>This link will expire in 24 hours.</strong></p>
            </div>
            <div class="footer">
              <p>If you didn't create an account, please ignore this email.</p>
              <p>&copy; ${new Date().getFullYear()} Helpdesk System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send OTP email
exports.sendOTPEmail = async (email, name, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Helpdesk System <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Login OTP - Helpdesk System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp { font-size: 32px; font-weight: bold; color: #667eea; text-align: center; letter-spacing: 10px; padding: 20px; background: white; border-radius: 10px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Login OTP</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Your One-Time Password (OTP) for login is:</p>
              <div class="otp">${otp}</div>
              <p><strong>This OTP will expire in 10 minutes.</strong></p>
              <p>Please do not share this OTP with anyone.</p>
            </div>
            <div class="footer">
              <p>If you didn't request this OTP, please ignore this email.</p>
              <p>&copy; ${new Date().getFullYear()} Helpdesk System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send ticket update notification
exports.sendTicketUpdateEmail = async (email, name, ticketId, status, comment) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Helpdesk System <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Ticket Update: ${ticketId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .status { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; background: #667eea; color: white; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎫 Ticket Update</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Your ticket <strong>${ticketId}</strong> has been updated.</p>
              <p><strong>New Status:</strong> <span class="status">${status}</span></p>
              ${comment ? `<p><strong>Comment:</strong> ${comment}</p>` : ''}
              <p>You can check your ticket status anytime by visiting the employee portal.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Helpdesk System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send new ticket alert to admin
exports.sendNewTicketAlert = async (adminEmail, ticket) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Helpdesk System <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Ticket Alert: ${ticket.ticketId} - ${ticket.issueType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; color: #555; }
            .priority { display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: bold; background: #ffeaa7; color: #d35400; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 New Ticket Received</h1>
            </div>
            <div class="content">
              <h2>Action Required</h2>
              <p>A new ticket has been submitted to your department.</p>
              
              <div class="field"><span class="label">Ticket ID:</span> ${ticket.ticketId}</div>
              <div class="field"><span class="label">Employee:</span> ${ticket.employeeName} (${ticket.employeeId})</div>
              <div class="field"><span class="label">Department:</span> ${ticket.issueType}</div>
              <div class="field"><span class="label">Priority:</span> <span class="priority">${ticket.priority}</span></div>
              
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              
              <div class="field">
                <span class="label">Description:</span>
                <p style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #eee;">${ticket.description}</p>
              </div>

              <center>
                <a href="${process.env.COMPANY_ADMIN_URL}/admin" style="display: inline-block; background: #EE5253; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px;">View Ticket</a>
              </center>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Helpdesk System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};
