// Premium email layout wrapper matching the institutional design system
const premiumLayout = (heroIcon: string, heroTitle: string, content: string): string => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @media screen and (max-width: 600px) {
            .container { width: 100% !important; border-radius: 0 !important; }
            .hero-text { font-size: 24px !important; }
            .content { padding: 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #ebdeee; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                    
                    <tr>
                        <td align="center" style="padding: 25px 0; border-bottom: 1px solid #f1e4f4;">
                            <span style="font-size: 18px; font-weight: 900; color: #9213ec; letter-spacing: -0.5px;">
                                Radharaman Group of Institutes
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td bgcolor="#9213ec" align="center" style="padding: 40px 20px; background: linear-gradient(to top, #9213ec, #7200bc);">
                            <table border="0" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 16px; margin-bottom: 15px;">
                                <tr>
                                    <td style="padding: 12px; color: #ffffff; font-size: 24px; font-weight: bold;">${heroIcon}</td>
                                </tr>
                            </table>
                            <h1 class="hero-text" style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">${heroTitle}</h1>
                        </td>
                    </tr>

                    <tr>
                        <td class="content" style="padding: 40px 50px; color: #1f1924;">
                            ${content}
                        </td>
                    </tr>

                    <tr>
                        <td bgcolor="#1a1022" style="padding: 40px; color: #7f7387; text-align: center;">
                            <p style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff;">Radharaman Group</p>
                            <p style="margin: 5px 0 20px 0; font-size: 12px; line-height: 1.5;">
                                Fatehpur Biabani, Ratibad,<br>
                                Bhopal, Madhya Pradesh 462044
                            </p>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #4d4355; padding-top: 20px;">
                                <tr>
                                    <td align="center" style="font-size: 11px;">
                                        &copy; 2026 Radharaman Group of Institutes. All rights reserved.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

// ──────────────────────────────────────────────────
// 1. VERIFICATION EMAIL
// Used by: student-register, external-student-register, alumni-register, resend-verification
// ──────────────────────────────────────────────────
export const verificationEmailTemplate = (name: string, verificationLink: string): string => {
  const content = `
            <p style="color: #9213ec; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px;">Welcome to the Vanguard</p>
            <h2 style="font-size: 22px; margin: 0 0 20px 0; color: #1f1924;">Confirm your institutional access</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300;">
                Dear ${name},<br><br>
                Welcome to the Radharaman Group of Institutes digital ecosystem. To ensure the security of your academic records, we require a one-time verification of your email address.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 30px 0;">
                        <a href="${verificationLink}" style="background-color: #9213ec; color: #ffffff; padding: 16px 35px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block;">
                            Verify Account &nbsp; &rarr;
                        </a>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ebdeee; border-radius: 16px; border-left: 4px solid #9213ec;">
                <tr>
                    <td style="padding: 20px;">
                        <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: 700; color: #4d4355;">Why is this necessary?</p>
                        <p style="margin: 0; font-size: 13px; color: #4d4355; font-weight: 300;">This link will expire in 30 minutes. Verification helps us protect your sensitive academic data.</p>
                    </td>
                </tr>
            </table>

            <p style="font-size: 11px; color: #7f7387; margin-top: 30px; margin-bottom: 5px;">Button not working? Copy and paste this URL:</p>
            <div style="padding: 10px; background-color: #f7f6f8; border: 1px solid #ebdeee; border-radius: 8px; font-family: monospace; font-size: 11px; word-break: break-all; color: #9213ec;">
                ${verificationLink}
            </div>`;
  return premiumLayout("&#10003;", "Verify Your Identity", content);
};

// ──────────────────────────────────────────────────
// 2. PASSWORD RESET EMAIL
// Used by: forgot-password
// ──────────────────────────────────────────────────
export const passwordResetEmailTemplate = (name: string, resetLink: string): string => {
  const content = `
            <p style="color: #9213ec; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px;">Security Alert</p>
            <h2 style="font-size: 22px; margin: 0 0 20px 0; color: #1f1924;">Reset your password</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300;">
                Dear ${name},<br><br>
                We received a request to reset your password for the RGI Training &amp; Placement Portal. Click the button below to create a new password.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 30px 0;">
                        <a href="${resetLink}" style="background-color: #9213ec; color: #ffffff; padding: 16px 35px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block;">
                            Reset Password &nbsp; &rarr;
                        </a>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ebdeee; border-radius: 16px; border-left: 4px solid #9213ec;">
                <tr>
                    <td style="padding: 20px;">
                        <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: 700; color: #4d4355;">Didn't request this?</p>
                        <p style="margin: 0; font-size: 13px; color: #4d4355; font-weight: 300;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged. This link expires in 30 minutes.</p>
                    </td>
                </tr>
            </table>

            <p style="font-size: 11px; color: #7f7387; margin-top: 30px; margin-bottom: 5px;">Button not working? Copy and paste this URL:</p>
            <div style="padding: 10px; background-color: #f7f6f8; border: 1px solid #ebdeee; border-radius: 8px; font-family: monospace; font-size: 11px; word-break: break-all; color: #9213ec;">
                ${resetLink}
            </div>`;
  return premiumLayout("&#128274;", "Password Reset", content);
};

// ──────────────────────────────────────────────────
// 3. VERIFICATION SUCCESS / WELCOME EMAIL
// Used by: verify-email (sent to user after successful verification)
// ──────────────────────────────────────────────────
export const verificationSuccessTemplate = (name: string): string => {
  const content = `
            <p style="color: #9213ec; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px;">Account Activated</p>
            <h2 style="font-size: 22px; margin: 0 0 20px 0; color: #1f1924;">Welcome aboard, ${name}!</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300;">
                Your email has been verified and your account is now fully active on the RGI Training &amp; Placement Portal. You now have access to:
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
                <tr>
                    <td style="padding: 12px 16px; background-color: #f7f6f8; border-radius: 12px; margin-bottom: 8px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr><td style="padding: 8px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">&#128188; &nbsp; Placement drive registrations</td></tr>
                            <tr><td style="padding: 8px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">&#128203; &nbsp; Application tracking</td></tr>
                            <tr><td style="padding: 8px 0; font-size: 14px; color: #4d4355;">&#128247; &nbsp; Campus memory gallery</td></tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <a href="https://ankitdevprojects.qzz.io/portal/dashboard" style="background-color: #9213ec; color: #ffffff; padding: 16px 35px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block;">
                            Go to Dashboard &nbsp; &rarr;
                        </a>
                    </td>
                </tr>
            </table>`;
  return premiumLayout("&#127881;", "Welcome to RGI TnP", content);
};

// ──────────────────────────────────────────────────
// 4. DRIVE REGISTRATION CONFIRMATION
// Used by: future drive registration feature
// ──────────────────────────────────────────────────
export const driveRegistrationTemplate = (name: string, companyName: string, date: string, role: string): string => {
  const content = `
            <p style="color: #9213ec; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px;">Registration Confirmed</p>
            <h2 style="font-size: 22px; margin: 0 0 20px 0; color: #1f1924;">You're all set, ${name}!</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300;">
                Your registration for the upcoming placement drive has been confirmed. Here are the details:
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0; border: 2px solid #9213ec; border-radius: 16px; overflow: hidden;">
                <tr>
                    <td style="padding: 20px; background-color: #f7f6f8;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr><td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;"><strong style="color: #9213ec;">Company</strong><br>${companyName}</td></tr>
                            <tr><td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;"><strong style="color: #9213ec;">Role</strong><br>${role}</td></tr>
                            <tr><td style="padding: 10px 0; font-size: 14px; color: #4d4355;"><strong style="color: #9213ec;">Date</strong><br>${date}</td></tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ebdeee; border-radius: 16px; border-left: 4px solid #9213ec;">
                <tr>
                    <td style="padding: 20px;">
                        <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: 700; color: #4d4355;">Important Reminders</p>
                        <p style="margin: 0; font-size: 13px; color: #4d4355; font-weight: 300;">Please arrive in formal attire and carry 3 copies of your resume. Late arrivals may not be permitted.</p>
                    </td>
                </tr>
            </table>`;
  return premiumLayout("&#128188;", "Drive Registration", content);
};

// ──────────────────────────────────────────────────
// 5. ADMIN NOTIFICATION — NEW USER VERIFIED
// Sent to admin when a user successfully verifies their account
// ──────────────────────────────────────────────────
export const adminVerificationNotifyTemplate = (userName: string, userEmail: string, userRole: string): string => {
  const roleLabel = userRole === "external_student" ? "External Student" : userRole === "alumni" ? "Alumni" : "Internal Student";
  const content = `
            <p style="color: #9213ec; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px;">Admin Notification</p>
            <h2 style="font-size: 22px; margin: 0 0 20px 0; color: #1f1924;">New account verified</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300;">
                A new user has successfully verified their email and activated their account on the RGI Training &amp; Placement Portal.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0; border: 2px solid #9213ec; border-radius: 16px; overflow: hidden;">
                <tr>
                    <td style="padding: 20px; background-color: #f7f6f8;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr><td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;"><strong style="color: #9213ec;">Name</strong><br>${userName}</td></tr>
                            <tr><td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;"><strong style="color: #9213ec;">Email</strong><br>${userEmail}</td></tr>
                            <tr><td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;"><strong style="color: #9213ec;">Role</strong><br>${roleLabel}</td></tr>
                            <tr><td style="padding: 10px 0; font-size: 14px; color: #4d4355;"><strong style="color: #9213ec;">Verified At</strong><br>${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td></tr>
                        </table>
                    </td>
                </tr>
            </table>`;
  return premiumLayout("&#128276;", "New User Alert", content);
};