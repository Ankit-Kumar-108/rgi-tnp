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
                                Fatehpur, Ratibad,<br>
                                Bhopal, Madhya Pradesh 462044
                            </p>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #4d4355; padding-top: 20px;">
                                <tr>
                                    <td align="center" style="font-size: 11px;">
                                        &copy; ${new Date().getFullYear()} Radharaman Group of Institutes. All rights reserved.
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
// 1. VERIFICATION EMAIL
// Used by: student-register, external-student-register, alumni-register, resend-verification
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
            </div>
            
            <div style="margin-top: 40px; padding: 20px; background-color: #f1daff; border-radius: 16px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #2d004f; font-weight: 600;">
                    For any Queries, Please contact 
                </p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #5b2688;">
                    +91-9425609712
                    tpo@radharamanbhopal.com
                </p>
            </div>`;
    return premiumLayout("&#10003;", "Verify Your Identity", content);
};

// 2. PASSWORD RESET EMAIL
// Used by: forgot-password
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
            </div>
            
            <div style="margin-top: 40px; padding: 20px; background-color: #f1daff; border-radius: 16px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #2d004f; font-weight: 600;">
                    For any Queries, Please contact 
                </p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #5b2688;">
                    +91-9425609712
                    tpo@radharamanbhopal.com
                </p>
            </div>`;
    return premiumLayout("&#128274;", "Password Reset", content);
};

// ROLE-SPECIFIC VERIFICATION SUCCESS TEMPLATES

// 3A. VERIFICATION SUCCESS - STUDENT
export const verificationSuccessStudentTemplate = (name: string): string => {
    const dashboardLink = `https://${process.env.DOMAIN_NAME}/students/dashboard`;
    const content = `
            <p style="color: #9213ec; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px;">Account Activated</p>
            <h2 style="font-size: 22px; margin: 0 0 20px 0; color: #1f1924;">Welcome to your placement journey, ${name}!</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300;">
                Your email has been verified and your account is now fully active on the RGI Training &amp; Placement Portal. As an internal student, you have full access to our comprehensive placement ecosystem.
            </p>

            <h3 style="font-size: 16px; margin: 25px 0 15px 0; color: #1f1924; font-weight: 700;">Your Available Features:</h3>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
                <tr>
                    <td style="padding: 16px; background-color: #f7f6f8; border-radius: 12px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">📋 Browse Placement Drives</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Explore all active placement drives tailored for your branch and CGPA</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">💼 Apply for Drives</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">One-click registration for placement opportunities</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">📄 Resume Management</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Upload and maintain your resume for all applications</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">👤 Complete Your Profile</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Add academic records, LinkedIn, GitHub, and social profiles</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">📸 Memory Gallery</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Share and preserve your college memories with batches</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355;">
                                    <span style="font-weight: 700; color: #9213ec;">⭐ Feedback & Ratings</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Share your placement experience and help future batches</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ebdeee; border-radius: 16px; border-left: 4px solid #9213ec; margin: 20px 0;">
                <tr>
                    <td style="padding: 20px;">
                        <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: 700; color: #4d4355;">📌 Quick Start Tips</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #4d4355; font-weight: 300;">1. Upload your resume to stand out to recruiters</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #4d4355; font-weight: 300;">2. Complete all profile fields for better eligibility matching</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #4d4355; font-weight: 300;">3. Register early for drives to secure your spot</p>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 30px 0;">
                        <a href="${dashboardLink}" style="background-color: #9213ec; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(146, 19, 236, 0.3);">
                            Launch Your Dashboard &nbsp; →
                        </a>
                    </td>
                </tr>
            </table>`;
    return premiumLayout("🎓", "Welcome to RGI TnP - Student Portal", content);
};

// 3B. VERIFICATION SUCCESS - EXTERNAL STUDENT
export const verificationSuccessExternalStudentTemplate = (name: string): string => {
    const dashboardLink = `https://${process.env.DOMAIN_NAME}/external-students/external-dashboard`;
    const content = `
            <p style="color: #9213ec; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px;">Account Activated</p>
            <h2 style="font-size: 22px; margin: 0 0 20px 0; color: #1f1924;">Welcome, ${name}! Your placement opportunities await.</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300;">
                Congratulations! Your email has been verified and your account is now fully active. As an external student, you now have access to our exclusive placement opportunities and resources designed for aspiring professionals from partner institutions.
            </p>

            <h3 style="font-size: 16px; margin: 25px 0 15px 0; color: #1f1924; font-weight: 700;">What You Can Access:</h3>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
                <tr>
                    <td style="padding: 16px; background-color: #f7f6f8; border-radius: 12px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">📋 External Placement Drives</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Exclusive job opportunities specifically open for external students</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">💼 Apply for Placements</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Register for drives with transparent eligibility criteria</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">📄 Resume Management</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Your resume is already on file from registration; update anytime</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">👤 Professional Profile</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Update your academic records and add LinkedIn/GitHub profiles</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355;">
                                    <span style="font-weight: 700; color: #9213ec;">⭐ Share Your Feedback</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Help us improve by sharing your placement experience</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ebdeee; border-radius: 16px; border-left: 4px solid #9213ec; margin: 20px 0;">
                <tr>
                    <td style="padding: 20px;">
                        <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: 700; color: #4d4355;">🚀 Get Started</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #4d4355; font-weight: 300;">✓ Complete your profile information for better job matches</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #4d4355; font-weight: 300;">✓ Add professional social media links (LinkedIn, GitHub, etc.)</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #4d4355; font-weight: 300;">✓ Browse available drives and apply for positions that interest you</p>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 30px 0;">
                        <a href="${dashboardLink}" style="background-color: #9213ec; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(146, 19, 236, 0.3);">
                            Access Your Dashboard &nbsp; →
                        </a>
                    </td>
                </tr>
            </table>`;
    return premiumLayout("🎯", "Welcome to RGI TnP - External Student Portal", content);
};

// 3C. VERIFICATION SUCCESS - ALUMNI
export const verificationSuccessAlumniTemplate = (name: string): string => {
    const dashboardLink = `https://${process.env.DOMAIN_NAME}/alumni/dashboard`;
    const content = `
            <p style="color: #9213ec; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px;">Welcome Back</p>
            <h2 style="font-size: 22px; margin: 0 0 20px 0; color: #1f1924;">Welcome to the RGI Alumni Network, ${name}!</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300;">
                Your email has been verified and your alumni account is now fully activated. Join a thriving community of RGI alumni and contribute to shaping the future of our institution. As a valued alumni member, you unlock exclusive opportunities to mentor, refer, and stay connected.
            </p>

            <h3 style="font-size: 16px; margin: 25px 0 15px 0; color: #1f1924; font-weight: 700;">Alumni Privileges & Features:</h3>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
                <tr>
                    <td style="padding: 16px; background-color: #f7f6f8; border-radius: 12px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">🤝 Referral Program</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Submit job referrals to connect outstanding candidates with your company (subject to admin approval)</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">👔 Professional Profile</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Showcase your current company, role, location, and career achievements</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">📸 Memory Gallery</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Upload and share memorable moments from your time at RGI</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">🌐 Alumni Network</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Connect with fellow alumni and build meaningful professional relationships</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355;">
                                    <span style="font-weight: 700; color: #9213ec;">⭐ Mentorship & Feedback</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Share insights and provide feedback to help current students and recent graduates</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ebdeee; border-radius: 16px; border-left: 4px solid #9213ec; margin: 20px 0;">
                <tr>
                    <td style="padding: 20px;">
                        <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: 700; color: #4d4355;">💡 Make an Impact</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #4d4355; font-weight: 300;">1. Complete your professional profile to stand out in the alumni community</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #4d4355; font-weight: 300;">2. Submit your first referral to help talented candidates get placed</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #4d4355; font-weight: 300;">3. Share memories and stay connected with your alma mater</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #4d4355; font-weight: 300;">4. Provide feedback based on your professional experiences</p>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 30px 0;">
                        <a href="${dashboardLink}" style="background-color: #9213ec; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(146, 19, 236, 0.3);">
                            Enter Alumni Portal &nbsp; →
                        </a>
                    </td>
                </tr>
            </table>`;
    return premiumLayout("🎓", "Welcome to RGI Alumni Network", content);
};

// 3D. VERIFICATION SUCCESS - RECRUITER
export const verificationSuccessRecruiterTemplate = (name: string, companyName: string): string => {
    const dashboardLink = `https://${process.env.DOMAIN_NAME}/recruiters/dashboard`;
    const content = `
            <p style="color: #9213ec; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px;">Partnership Activated</p>
            <h2 style="font-size: 22px; margin: 0 0 20px 0; color: #1f1924;">Welcome, ${name}! Partnership confirmed for ${companyName}.</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300;">
                Your recruiter account has been verified and is now fully operational. You are now part of an elite network of 500+ leading companies recruiting top talent from Radharaman Group of Institutes. Your organization is ready to access our pool of skilled, motivated, and industry-ready professionals.
            </p>

            <h3 style="font-size: 16px; margin: 25px 0 15px 0; color: #1f1924; font-weight: 700;">Your Recruiting Capabilities:</h3>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
                <tr>
                    <td style="padding: 16px; background-color: #f7f6f8; border-radius: 12px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">🎯 Create Placement Drives</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Post job openings with detailed criteria (CGPA, branch, batch eligibility)</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">📊 Manage Multiple Drives</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Create, edit, and track all your active placement drives in one dashboard</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">👥 Applicant Management</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">View, filter, and manage all applicants for each of your drives</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">📈 Recruitment Analytics</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Track placement statistics and hiring metrics in dedicated section</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355; border-bottom: 1px solid #ebdeee;">
                                    <span style="font-weight: 700; color: #9213ec;">💬 Corporate Feedback</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Provide performance feedback on students to help their development</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 14px; color: #4d4355;">
                                    <span style="font-weight: 700; color: #9213ec;">🔍 Advanced Search & Filter</span><br>
                                    <span style="font-size: 13px; color: #7f7387;">Easily find drives, applicants, and candidates matching your requirements</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ebdeee; border-radius: 16px; border-left: 4px solid #9213ec; margin: 20px 0;">
                <tr>
                    <td style="padding: 20px;">
                        <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: 700; color: #4d4355;">🚀 Next Steps</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #4d4355; font-weight: 300;">1. Log in to your recruiter dashboard</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #4d4355; font-weight: 300;">2. Create your first placement drive with detailed job specifications</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #4d4355; font-weight: 300;">3. Set eligibility criteria and interview process details</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #4d4355; font-weight: 300;">4. Start receiving applications from pre-screened candidates</p>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1daff; border-radius: 16px; margin: 20px 0;">
                <tr>
                    <td style="padding: 20px;">
                        <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #2d004f;">📞 Dedicated Support</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #5b2688; font-weight: 300;">Our TPO (Training & Placement Officer) team is here to assist you:</p>
                        <p style="margin: 8px 0 0 0; font-size: 12px; color: #5b2688;">📧 tpo@radharamanbhopal.com | ☎️ +91-9425609712</p>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 30px 0;">
                        <a href="${dashboardLink}" style="background-color: #9213ec; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(146, 19, 236, 0.3);">
                            Launch Recruiter Dashboard &nbsp; →
                        </a>
                    </td>
                </tr>
            </table>`;
    return premiumLayout("💼", `Welcome to RGI Recruiter Portal - ${companyName}`, content);
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
                        <p style="margin: 0; font-size: 13px; color: #4d4355; font-weight: 300;">Please arrive in formal attire and carry 3 copies of your resume and related documents. Late arrivals may not be permitted.</p>
                    </td>
                </tr>
            </table>
            
            <div style="margin-top: 40px; padding: 20px; background-color: #f1daff; border-radius: 16px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #2d004f; font-weight: 600;">
                    For any Queries, Please contact 
                </p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #5b2688;">
                    +91-9425609712
                    tpo@radharamanbhopal.com
                </p>
            </div>`;
    return premiumLayout("&#128188;", "Drive Registration", content);
};

// 5. ADMIN NOTIFICATION — NEW USER VERIFIED
// Sent to admin when a user successfully verifies their account (Currently Un-used)
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
    confirmUrl: string = `https://${process.env.DOMAIN_NAME}/students/dashboard`
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
                            For more Details &nbsp; &rarr;
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
            </table>
            
            <div style="margin-top: 40px; padding: 20px; background-color: #f1daff; border-radius: 16px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #2d004f; font-weight: 600;">
                    For any Queries, Please contact 
                </p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #5b2688;">
                    +91-9425609712
                    tpo@radharamanbhopal.com
                </p>
            </div>`;

    return premiumLayout("&#127882;", "You're Shortlisted!", content);
};

export const offerSelectionEmailTemplate = (
    studentName: string,
    jobRole: string,
    companyName: string,
    packageAmount: string,
    roleName: string,
): string => {
    const content = `
            <div style="text-align: center; margin-bottom: 30px;">
                <p style="color: #9213ec; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px;">New Milestone Achieved</p>
                <h2 style="font-size: 28px; margin: 0; color: #1f1924; font-weight: 900; line-height: 1.2;">Fantastic news, ${studentName}!</h2>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300; text-align: center;">
                We are happy to announce that you have been selected for the next round for <strong style="color: #9213ec;">${jobRole}</strong> position at <strong style="color: #9213ec;">${companyName}</strong>. 
                Please reach RITS seminar hall in 10 minutes.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0; border: 1px solid #ebdeee; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <tr>
                    <td style="padding: 30px;">
                        <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #1f1924; font-weight: 700; border-bottom: 2px solid #f1daff; display: inline-block; padding-bottom: 5px;">Details</h3>
                        
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f7f6f8;">
                                    <span style="font-size: 11px; font-weight: 700; color: #7f7387; text-transform: uppercase; tracking-widest;">Company</span><br>
                                    <span style="font-size: 12px; font-weight: 600; color: #9213ec;">${companyName}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0;">
                                    <span style="font-size: 11px; font-weight: 700; color: #7f7387; text-transform: uppercase; tracking-widest;">Position</span><br>
                                    <span style="font-size: 12px; font-weight: 600; color: #9213ec;">${roleName}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f7f6f8;">
                                    <span style="font-size: 11px; font-weight: 700; color: #7f7387; text-transform: uppercase; tracking-widest;">Annual Package (CTC)</span><br>
                                    <span style="font-size: 12px; font-weight: 800; color: #9213ec;">${packageAmount}</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <div style="margin-top: 40px; padding: 20px; background-color: #f1daff; border-radius: 16px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #2d004f; font-weight: 600;">
                    For any Queries, Please contact 
                </p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #5b2688;">
                    +91-9425609712
                    tpo@radharamanbhopal.com
                </p>
            </div>`;

    return premiumLayout("&#127881;", "Congratulations!", content);
};

export const rejectionEmailTemplate = (
    studentName: string,
    jobRole: string,
    companyName: string,
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
                            The Training and Placement Cell remains committed to your success. We encourage you to check out our upcoming workshops to sharpen your skills for future opportunities.
                        </p>
                    </td>
                </tr>
            </table>

            <p style="font-size: 12px; color: #7f7387; text-align: center; margin-top: 30px;">
                Every experience is a step forward. Keep pushing your boundaries!
            </p>

            <div style="margin-top: 40px; padding: 20px; background-color: #f1daff; border-radius: 16px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #2d004f; font-weight: 600;">
                    For any Queries, Please contact 
                </p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #5b2688;">
                    +91-9425609712
                    tpo@radharamanbhopal.com
                </p>
            </div> `;

    return premiumLayout("&#9888;", "Application Update", content);
};

export const placementOpportunityTemplate = (
    studentName: string,
    companyName: string,
    driveType: string, // e.g., "Full Time", "Internship", "Contract/Bond"
    packageRange: string,
    batch: string,
    course: string,
    branch: string,
    deadlineDate: string,
    applyUrl: string,
): string => {
    const content = `
            <p style="color: #9213ec; font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 2px; margin-bottom: 10px;">Immediate Opening</p>
            <h2 style="font-size: 26px; margin: 0 0 15px 0; color: #1f1924; font-weight: 900; line-height: 1.2;">
                🚀 New Opportunity: <span style="color: #9213ec;">${companyName}</span> is hiring!
            </h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4d4355; font-weight: 300;">
                Hello <strong>${studentName}</strong>, based on your academic profile, you are eligible for the upcoming campus recruitment drive. 
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0; background-color: #ffffff; border: 1px solid #ebdeee; border-radius: 20px; overflow: hidden;">
                <tr>
                    <td style="padding: 25px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="padding-bottom: 15px; border-bottom: 1px solid #f7f6f8;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td>
                                                <span style="font-size: 11px; font-weight: 700; color: #7f7387; text-transform: uppercase;">Company</span><br>
                                                <span style="font-size: 18px; font-weight: 800; color: #1f1924;">${companyName}</span>
                                            </td>
                                            <td align="right" valign="top">
                                                <span style="background-color: #f1daff; color: #9213ec; padding: 4px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; border: 1px solid #dfb7ff;">
                                                    ${driveType}
                                                </span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 15px 0; border-bottom: 1px solid #f7f6f8;">
                                 <span style="font-size: 11px; font-weight: 700; color: #7f7387; text-transform: uppercase;">Package (CTC)</span><br>
                                 <span style="font-size: 15px; font-weight: 700; color: #9213ec;">${packageRange}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 15px 0; border-bottom: 1px solid #f7f6f8;">
                                   <span style="font-size: 11px; font-weight: 700; color: #7f7387; text-transform: uppercase;">Eligibility</span>
                                    <div style="margin-top: 5px; font-size: 13px; color: #4d4355; line-height: 1.5;">
                                      <strong>Batch:</strong> ${batch}<br>
                                      <strong>Course:</strong> ${course}<br>
                                      <strong>Branch:</strong> ${branch}
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding-top: 15px;">
                                    <span style="font-size: 11px; font-weight: 700; color: #ba1a1a; text-transform: uppercase;">Registration Deadline</span><br>
                                    <span style="font-size: 16px; font-weight: 800; color: #ba1a1a;">${deadlineDate}</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 10px 0 30px 0;">
                        <a href="${applyUrl}" style="background-color: #9213ec; color: #ffffff; padding: 18px 45px; text-decoration: none; border-radius: 14px; font-weight: 900; font-size: 16px; display: inline-block; box-shadow: 0 10px 20px rgba(146, 19, 236, 0.2);">
                            Details & Apply Link &nbsp; &rarr;
                        </a>
                    </td>
                </tr>
            </table>
            
            <div style="margin-top: 40px; padding: 20px; background-color: #f1daff; border-radius: 16px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #2d004f; font-weight: 600;">
                    For any Queries, Please contact 
                </p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #5b2688;">
                    +91-9425609712
                    tpo@radharamanbhopal.com
                </p>
            </div>`;

    return premiumLayout("&#128188;", "New Placement Drive", content);
};

export const alumniTransferTemplate = (studentName: string, placementDetails: { currentCompany?: string | null, jobTitle?: string | null } | undefined, alumniLoginLink: string): string => {
    const content = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #1a1a2e;">Congratulations, ${studentName}! 🎉</h2>
              ${placementDetails?.currentCompany
                ? `<p style="font-size: 16px; line-height: 1.6;">
                    Your placement at <strong>${placementDetails.currentCompany}</strong>
                    as <strong>${placementDetails.jobTitle}</strong> has been recorded.
                  </p>`
                : `<p style="font-size: 16px; line-height: 1.6;">
                    Your student account has been upgraded to an alumni account.
                  </p>`
              }
              <p style="font-size: 15px; line-height: 1.6;">
                Your account has been moved to the <strong>Alumni Portal</strong>.
                Your existing password still works — just login from the alumni page:
              </p>
              <a href="${alumniLoginLink}"
                style="display: inline-block; padding: 12px 24px; background: #6366f1;
                       color: white; text-decoration: none; border-radius: 8px;
                       font-weight: bold; margin: 16px 0;">
                Login as Alumni →
              </a>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #999;">RGI Training & Placement Cell</p>
            </div>
          `;
    return premiumLayout("🎉", "Alumni Account Upgraded", content);
};

export const driveRejectionTemplate = (recruiterName: string, companyName: string, roleName: string): string => {
    const content = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #D32F2F; margin-bottom: 20px;">Placement Drive Rejected</h2>
              <p>Hello <strong>${recruiterName}</strong>,</p>
              <p style="line-height: 1.6; font-size: 15px;">Your submitted placement drive for <strong>${companyName}</strong> (${roleName} role) has been reviewed and was <strong>not approved</strong> at this time.</p>
              <p style="line-height: 1.6; font-size: 15px;">Please review the job details or contact the placement coordinator for more information.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #999;">Radharaman Group of Institutes (RGI) Training & Placement Cell.</p>
            </div>
          `;
    return premiumLayout("❌", "Placement Drive Rejected", content);
};

export const referralStatusUpdateTemplate = (alumniName: string, position: string, companyName: string, action: "approve" | "reject"): string => {
    const content = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: ${action === "approve" ? "#388E3C" : "#D32F2F"}; margin-bottom: 20px;">Referral Status Update</h2>
              <p>Hello <strong>${alumniName}</strong>,</p>
              <p style="line-height: 1.6; font-size: 15px;">Your submitted referral for <strong>${position}</strong> at <strong>${companyName}</strong> has been <strong>${action === "approve" ? "approved and published" : "rejected"}</strong> by the administration.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #999;">Radharaman Group of Institutes (RGI) Training & Placement Cell.</p>
            </div>
          `;
    return premiumLayout(action === "approve" ? "✅" : "❌", "Referral Status Update", content);
};

export const volunteerApprovedTemplate = (studentName: string): string => {
    const content = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #388E3C; margin-bottom: 20px;">Volunteer Approved!</h2>
              <p>Hello <strong>${studentName}</strong>,</p>
              <p style="line-height: 1.6; font-size: 15px;">Congratulations! You have been approved as a student volunteer for Training & Placement cell events.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #999;">Radharaman Group of Institutes (RGI) Training & Placement Cell.</p>
            </div>
          `;
    return premiumLayout("🌟", "Volunteer Approved", content);
};

export const externalVerificationSuccessTemplate = (studentName: string): string => {
    const content = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #388E3C; margin-bottom: 20px;">Account Verified Successfully</h2>
              <p>Hello <strong>${studentName}</strong>,</p>
              <p style="line-height: 1.6; font-size: 15px;">Your external student registration is verified!</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #999;">Radharaman Group of Institutes (RGI) Training & Placement Cell.</p>
            </div>
          `;
    return premiumLayout("✅", "Account Verified", content);
};

export const studentVerificationSuccessTemplate = (studentName: string): string => {
    const content = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #388E3C; margin-bottom: 20px;">Account Verified Successfully</h2>
              <p>Hello <strong>${studentName}</strong>,</p>
              <p style="line-height: 1.6; font-size: 15px;">Your student account has been verified by the administrator.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #999;">Radharaman Group of Institutes (RGI) Training & Placement Cell.</p>
            </div>
          `;
    return premiumLayout("✅", "Account Verified", content);
};