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

// 3. VERIFICATION SUCCESS / WELCOME EMAIL
// Used by: verify-email (sent to user after successful verification)
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
                        <a href="https://ankit-dev.me/portal/dashboard" style="background-color: #9213ec; color: #ffffff; padding: 16px 35px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block;">
                            Go to Dashboard &nbsp; &rarr;
                        </a>
                    </td>
                </tr>
            </table>`;
  return premiumLayout("&#127881;", "Welcome to RGI TnP", content);
};

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
                            <tr><td style="padding: 10px 0; font-size: 14px; color: #4d4355;"><strong style="color: #9213ec;">Date</strong><br>${date}<br><span>Expected</span></td></tr>
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

// 5. ADMIN NOTIFICATION — NEW USER VERIFIED
// Sent to admin when a user successfully verifies their account
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

export const shortlistedEmailTemplate = (
    studentName: string,
    jobRole: string,
    companyName: string,
    interviewDate: string,
    location: string,
    coordinatorName: string,
    confirmUrl: string = "https://ankit-dev.me/portal/dashboard"
): string => {
    const content = `
            <p style="color: #9213ec; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px;">Status Update</p>
            <h2 style="font-size: 22px; margin: 0 0 20px 0; color: #1f1924;">Congratulations, ${studentName}!</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300;">
                We are pleased to inform you that your application for the <strong style="color: #9213ec;">${jobRole}</strong> position at <strong style="color: #9213ec;">${companyName}</strong> has successfully passed the initial screening. You have been shortlisted for the next round.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0; border: 2px solid #9213ec; border-radius: 16px; overflow: hidden; background-color: #f7f6f8;">
                <tr>
                    <td style="padding: 25px;">
                        <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #1f1924; font-weight: 700;">Next Steps</h3>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="padding: 8px 0; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-size: 11px; font-weight: 700; color: #9213ec; text-transform: uppercase;">Event</span><br>
                                    <span style="font-size: 14px; color: #1f1924;">Technical Interview / Assessment</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-size: 11px; font-weight: 700; color: #9213ec; text-transform: uppercase;">Date & Time</span><br>
                                    <span style="font-size: 14px; color: #1f1924;">${interviewDate}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-size: 11px; font-weight: 700; color: #9213ec; text-transform: uppercase;">Location / Link</span><br>
                                    <span style="font-size: 14px; color: #1f1924;">${location}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;">
                                    <span style="font-size: 11px; font-weight: 700; color: #9213ec; text-transform: uppercase;">T&P Coordinator</span><br>
                                    <span style="font-size: 14px; color: #1f1924;">${coordinatorName}</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 10px 0 30px 0;">
                        <a href="${confirmUrl}" style="background-color: #9213ec; color: #ffffff; padding: 16px 35px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(146, 19, 236, 0.3);">
                            Confirm Attendance &nbsp; &rarr;
                        </a>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ebdeee; border-radius: 16px; border-left: 4px solid #9213ec;">
                <tr>
                    <td style="padding: 20px;">
                        <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: 700; color: #4d4355;">Preparation Tip</p>
                        <p style="margin: 0; font-size: 13px; color: #4d4355; font-weight: 300;">Review the job description and keep a digital copy of your resume ready. We wish you the very best!</p>
                    </td>
                </tr>
            </table>`;

    return premiumLayout("&#127882;", "You're Shortlisted!", content);
};

export const offerSelectionEmailTemplate = (
    studentName: string,
    jobRole: string,
    companyName: string,
    packageAmount: string,
    joiningDate: string,
): string => {
    const content = `
            <div style="text-align: center; margin-bottom: 30px;">
                <p style="color: #9213ec; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px;">New Milestone Achieved</p>
                <h2 style="font-size: 28px; margin: 0; color: #1f1924; font-weight: 900; line-height: 1.2;">Fantastic news, ${studentName}!</h2>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300; text-align: center;">
                We are absolutely thrilled to announce that you have been selected for the <strong style="color: #9213ec;">${jobRole}</strong> position at <strong style="color: #9213ec;">${companyName}</strong>. 
                Your hard work and excellence have truly paid off.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0; border: 1px solid #ebdeee; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <tr>
                    <td style="padding: 30px;">
                        <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #1f1924; font-weight: 700; border-bottom: 2px solid #f1daff; display: inline-block; padding-bottom: 5px;">Offer Breakdown</h3>
                        
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f7f6f8;">
                                    <span style="font-size: 11px; font-weight: 700; color: #7f7387; text-transform: uppercase; tracking-widest;">Company</span><br>
                                    <span style="font-size: 16px; font-weight: 600; color: #1f1924;">${companyName}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f7f6f8;">
                                    <span style="font-size: 11px; font-weight: 700; color: #7f7387; text-transform: uppercase; tracking-widest;">Annual Package (CTC)</span><br>
                                    <span style="font-size: 18px; font-weight: 800; color: #9213ec;">${packageAmount}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0;">
                                    <span style="font-size: 11px; font-weight: 700; color: #7f7387; text-transform: uppercase; tracking-widest;">Joining Date</span><br>
                                    <span style="font-size: 16px; font-weight: 600; color: #1f1924;">${joiningDate}</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <div style="margin-top: 40px; padding: 20px; background-color: #f1daff; border-radius: 16px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #2d004f; font-weight: 600;">
                    Welcome to the professional world! 
                </p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #5b2688;">
                    The T&P Cell is proud of your achievement. Please complete the formal acceptance on the portal.
                </p>
            </div>`;

    return premiumLayout("&#127881;", "Congratulations!", content);
};

export const rejectionEmailTemplate = (
    studentName: string,
    jobRole: string,
    companyName: string,
    dashboardUrl: string = "https://ankit-dev.me/portal/dashboard"
): string => {
    const content = `
            <p style="color: #7f7387; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px;">Application Update</p>
            <h2 style="font-size: 22px; margin: 0 0 20px 0; color: #1f1924;">Update on your application for ${jobRole}</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300;">
                Dear ${studentName},<br><br>
                Thank you for participating in the recruitment drive for <strong style="color: #1f1924;">${companyName}</strong>. After careful consideration, we regret to inform you that we will not be moving forward with your application for the ${jobRole} position at this time.
            </p>

            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300;">
                We truly appreciate the effort you invested in the process and your interest in the role.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0; background-color: #f7f6f8; border-radius: 20px; border-left: 4px solid #7f7387;">
                <tr>
                    <td style="padding: 25px;">
                        <h3 style="margin: 0 0 10px 0; font-size: 17px; color: #1f1924; font-weight: 700;">Career Growth Hub</h3>
                        <p style="margin: 0 0 20px 0; font-size: 14px; color: #4d4355; line-height: 1.5;">
                            The T&amp;P Cell remains committed to your success. We encourage you to check out our upcoming workshops to sharpen your skills for future opportunities.
                        </p>
                    </td>
                </tr>
            </table>

            <p style="font-size: 12px; color: #7f7387; text-align: center; margin-top: 30px;">
                Every experience is a step forward. Keep pushing your boundaries!
            </p>`;

    return premiumLayout("&#9888;", "Application Update", content);
};

