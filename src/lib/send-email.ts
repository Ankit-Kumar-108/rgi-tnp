
interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn("[EMAIL] BREVO_API_KEY not set. Skipping email send.");
    return { success: false, error: "BREVO_API_KEY not configured" };
  }

  const senderEmail = from || process.env.EMAIL_FROM

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "accept": "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: "RGI T&P" },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,

        headers: {
        "List-Unsubscribe": "<https://ankit.dpdns.org/unsubscribe>",
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
      }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[EMAIL] Brevo API error:", response.status, errorData);
      return { success: false, error: `Brevo API error: ${response.status}` };
    }

    const data = (await response.json()) as { messageId: string };
    console.log("[EMAIL] Sent successfully, id:", data.messageId);
    return { success: true };
  } catch (error) {
    console.error("[EMAIL] Failed to send:", error);
    return { success: false, error: String(error) };
  }
}
