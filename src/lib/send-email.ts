
interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  const GMAIL_USER = process.env.GMAIL_USER;
  const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
  const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

  if (!GMAIL_USER || !CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.warn("[EMAIL] Gmail API credentials not fully set. Skipping email send.");
    return { success: false, error: "Gmail API credentials not configured" };
  }

  try {
    // 1. Get fresh access token via OAuth 2.0
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("[EMAIL] Failed to get Gmail access token:", errorText);
      return { success: false, error: `Auth Error: ${tokenResponse.status}` };
    }

    const { access_token } = await tokenResponse.json() as { access_token: string };

    // 2. Construct the email in RFC 2822 format (MIME)
    const senderEmail = from || GMAIL_USER;
    const base64Subject = Buffer.from(subject).toString('base64');
    
    // Cloudflare Workers support Buffer via their 'nodejs_compat' compatibility flag
    const rawMessage = [
      `From: RGI T&P <${senderEmail}>`,
      `To: ${to}`,
      `Subject: =?utf-8?B?${base64Subject}?=`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=utf-8`,
      '',
      html,
    ].join('\r\n');

    // Gmail API requires base64url encoding (not standard base64)
    const encodedEmail = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // 3. Send email using Gmail REST API
    const sendResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: encodedEmail,
      }),
    });

    if (!sendResponse.ok) {
      const sendError = await sendResponse.text();
      console.error("[EMAIL] Gmail API send error:", sendError);
      return { success: false, error: `Gmail Send Error: ${sendResponse.status}` };
    }

    console.log("[EMAIL] Sent successfully via Gmail REST API to:", to);
    return { success: true };
  } catch (error) {
    console.error("[EMAIL] Failed to send via Gmail API:", error);
    return { success: false, error: String(error) };
  }
}
