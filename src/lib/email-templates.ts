// 1. THE BASE WRAPPER (Handles CSS, Header, and Compliance Footer)
const baseLayout = (content: string, title: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; }
          .container { max-width: 600px; margin: 20px auto; padding: 20px; background: #ffffff; border-radius: 12px; border: 1px solid #e0e0e0; }
          .header { background: #9213ec; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; line-height: 1.6; color: #333; }
          .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; padding: 20px; }
          .button { display: inline-block; background: #9213ec; color: #ffffff !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .success-badge { background: #4caf50; color: white; padding: 12px; border-radius: 8px; text-align: center; font-weight: bold; }
          .timer { color: #d32f2f; font-weight: bold; background: #ffebee; padding: 5px 10px; border-radius: 4px; display: inline-block; }
          a { color: #9213ec; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>&copy; 2026 RGI Training &amp; Placement. All rights reserved.</p>
            <p>Radharaman Group of Institutes, Bhopal</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// 2. THE SPECIFIC TEMPLATES

// Used by: student-register, external-student-register, alumni-register, resend-verification
export const verificationEmailTemplate = (name: string, verificationLink: string): string => {
  const content = `
    <p>Hi ${name},</p>
    <p>To activate your account on the <strong>RGI TnP Portal</strong>, please click the button below:</p>
    <div style="text-align: center;">
      <a href="${verificationLink}" class="button">Verify Email Address</a>
    </div>
    <p class="timer">&#9200; This link expires in 30 minutes</p>
    <p>If the button doesn't work, copy this link: <br>
    <span style="word-break: break-all; font-size: 11px; color: #9213ec;">${verificationLink}</span></p>
    <p><strong>Security Tip:</strong> Never share this link with anyone. RGI staff will never ask for it.</p>
  `;
  return baseLayout(content, "Verify Your Account");
};

// Used by: forgot-password
export const passwordResetEmailTemplate = (name: string, resetLink: string): string => {
  const content = `
    <p>Hi ${name},</p>
    <p>We received a request to reset your password for the <strong>RGI TnP Portal</strong>.</p>
    <div style="text-align: center;">
      <a href="${resetLink}" class="button">Reset Password</a>
    </div>
    <p class="timer">&#9200; This link expires in 30 minutes</p>
    <p>If the button doesn't work, copy this link: <br>
    <span style="word-break: break-all; font-size: 11px; color: #9213ec;">${resetLink}</span></p>
    <p>If you did not request this, you can safely ignore this email. Your password will not change.</p>
  `;
  return baseLayout(content, "Reset Your Password");
};

// Used by: verify-email (sent after successful verification)
export const verificationSuccessTemplate = (name: string): string => {
  const content = `
    <p>Hi ${name},</p>
    <div class="success-badge">Verification Successful! &#10003;</div>
    <p>Your account is now active. You can now access:</p>
    <ul>
      <li>Placement drive registrations</li>
      <li>Application tracking</li>
      <li>Campus memory gallery</li>
    </ul>
    <div style="text-align: center;">
      <a href="https://ankitdevprojects.qzz.io/portal/dashboard" class="button">Go to Dashboard</a>
    </div>
  `;
  return baseLayout(content, "Welcome to RGI TnP!");
};

// Used by: future drive registration feature
export const driveRegistrationTemplate = (name: string, companyName: string, date: string, role: string): string => {
  const content = `
    <p>Hi ${name},</p>
    <p>Your registration for the upcoming drive is <strong>Confirmed</strong>.</p>
    <div style="border: 2px solid #9213ec; padding: 20px; border-radius: 8px;">
      <p><strong>Company:</strong> ${companyName}</p>
      <p><strong>Role:</strong> ${role}</p>
      <p><strong>Date:</strong> ${date}</p>
    </div>
    <p>Please ensure you are present in formal attire and carry 3 copies of your resume.</p>
  `;
  return baseLayout(content, "Drive Registration Confirmed");
};