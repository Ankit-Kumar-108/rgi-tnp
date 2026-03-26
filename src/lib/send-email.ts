
interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[EMAIL] RESEND_API_KEY not set. Skipping email send.");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  const senderEmail = from || process.env.EMAIL_FROM || "onboarding@resend.dev"; // fallback

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `RGI T&P <${senderEmail}>`,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[EMAIL] Resend API error:", response.status, errorData);
      return { success: false, error: `Resend API error: ${response.status}` };
    }

    const data = (await response.json()) as { id: string };
    console.log("[EMAIL] Sent successfully, id:", data.id);
    return { success: true };
  } catch (error) {
    console.error("[EMAIL] Failed to send:", error);
    return { success: false, error: String(error) };
  }
}
