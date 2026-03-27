export const otpEmailTemplate = (otp: string, name: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #9213ec; color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .content { padding: 20px; background: #f5f5f5; margin: 20px 0; border-radius: 8px; }
          .otp-box { font-size: 32px; font-weight: bold; color: #9213ec; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
          .timer { color: #d32f2f; font-weight: bold; text-align: center; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification - RGI TnP Portal</h1>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for registering with RGI Training & Placement Portal. To complete your registration, please verify your email using the OTP below:</p>
            
            <div class="otp-box">${otp}</div>
            
            <div class="timer">⏰ Valid for 10 minutes only</div>
            
            <p><strong>Important:</strong> Do not share this OTP with anyone. RGI staff will never ask for your OTP.</p>
            
            <p>If you didn't register for this account, you can safely ignore this email.</p>
          </div>
          
          <div class="footer">
            <p>© 2024 RGI Training & Placement. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const externalVerificationEmailTemplate = (name: string, verificationLink: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #9213ec; color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .content { padding: 20px; background: #f5f5f5; margin: 20px 0; border-radius: 8px; }
          .button { display: inline-block; background: #9213ec; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0; font-weight: bold; }
          .timer { color: #d32f2f; font-weight: bold; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email - RGI TnP Portal</h1>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for registering as an external student with RGI Training & Placement Portal. To activate your account, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            
            <p class="timer">⏰ This link expires in 30 minutes</p>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #9213ec; font-size: 12px;">${verificationLink}</p>
            
            <p>If you didn't register for this account, you can safely ignore this email.</p>
          </div>
          
          <div class="footer">
            <p>© 2024 RGI Training & Placement. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const verificationSuccessTemplate = (name: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #9213ec; color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .content { padding: 20px; background: #f5f5f5; margin: 20px 0; border-radius: 8px; }
          .success-badge { background: #4caf50; color: white; padding: 10px; border-radius: 8px; text-align: center; margin: 20px 0; font-weight: bold; }
          .button { display: inline-block; background: #9213ec; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to RGI TnP Portal! ✓</h1>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            <div class="success-badge">Your email has been verified successfully!</div>
            <p>Your account is now active. You can now:</p>
            <ul>
              <li>View upcoming placement drives</li>
              <li>Register for drives that match your branch and CGPA</li>
              <li>Track your applications and registrations</li>
              <li>Upload memories and images</li>
              <li>Receive notifications about drives and referrals</li>
            </ul>
            <a href="https://yourdomain.com/portal/students/dashboard" class="button">Go to Dashboard</a>
          </div>
          
          <div class="footer">
            <p>© 2024 RGI Training & Placement. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const driveRegistrationTemplate = (
  name: string,
  companyName: string,
  date: string,
  role: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #9213ec; color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .drive-card { border: 2px solid #9213ec; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .drive-detail { margin: 10px 0; }
          .drive-detail strong { color: #9213ec; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Drive Registration Confirmed!</h1>
          </div>
          
          <div class="drive-card">
            <p>Hi ${name},</p>
            <p>You have successfully registered for:</p>
            
            <div class="drive-detail"><strong>Company:</strong> ${companyName}</div>
            <div class="drive-detail"><strong>Role:</strong> ${role}</div>
            <div class="drive-detail"><strong>Date:</strong> ${date}</div>
            
            <p>Please make sure to attend on time. Check your dashboard for more details.</p>
          </div>
          
          <div class="footer">
            <p>© 2024 RGI Training & Placement. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const passwordResetTemplate = (name: string, resetLink: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #9213ec; color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .content { padding: 20px; background: #f5f5f5; margin: 20px 0; border-radius: 8px; }
          .button { display: inline-block; background: #9213ec; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0; }
          .timer { color: #d32f2f; font-weight: bold; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <a href="${resetLink}" class="button">Reset Password</a>
            
            <p class="timer">⏰ This link expires in 30 minutes</p>
            
            <p>If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
          </div>
          
          <div class="footer">
            <p>© 2024 RGI Training & Placement. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const memoryApprovalTemplate = (name: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #9213ec; color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .content { padding: 20px; background: #f5f5f5; margin: 20px 0; border-radius: 8px; }
          .success-badge { background: #4caf50; color: white; padding: 10px; border-radius: 8px; text-align: center; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Memory Approved! 📸</h1>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            <div class="success-badge">Your uploaded memory has been approved!</div>
            <p>Your image is now visible in the public memories gallery. Thank you for sharing your RGI experience!</p>
          </div>
          
          <div class="footer">
            <p>© 2024 RGI Training & Placement. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};