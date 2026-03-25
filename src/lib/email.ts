import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface WaitlistSignup {
  name: string;
  email: string;
  practice: string;
  role: string;
}

export async function sendWaitlistNotification(data: WaitlistSignup) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured — skipping email");
    return false;
  }

  const roleLabels: Record<string, string> = {
    physician: "Physician (MD/DO)",
    np: "Nurse Practitioner",
    pa: "Physician Assistant",
    "practice-owner": "Practice Owner / Administrator",
    "clinical-director": "Clinical Director",
    other: "Other",
  };

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f8fafb;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:12px;border:1px solid #e2e8ec;">
    <tr>
      <td style="padding:32px 32px 24px;">
        <h1 style="margin:0 0 4px;font-size:22px;color:#1a7a6a;">New Waitlist Signup</h1>
        <p style="margin:0;font-size:14px;color:#94a3b2;">proveniq.health</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9f7;border-radius:8px;border:1px solid #adddd5;">
          <tr>
            <td style="padding:20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;width:100px;">Name</td>
                  <td style="padding:6px 0;font-size:14px;color:#1e293b;font-weight:600;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;">Email</td>
                  <td style="padding:6px 0;font-size:14px;color:#1e293b;">
                    <a href="mailto:${data.email}" style="color:#1a7a6a;text-decoration:none;">${data.email}</a>
                  </td>
                </tr>
                ${data.practice ? `<tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;">Practice</td>
                  <td style="padding:6px 0;font-size:14px;color:#1e293b;">${data.practice}</td>
                </tr>` : ""}
                ${data.role ? `<tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;">Role</td>
                  <td style="padding:6px 0;font-size:14px;color:#1e293b;">${roleLabels[data.role] || data.role}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;">Time</td>
                  <td style="padding:6px 0;font-size:14px;color:#1e293b;">${new Date().toLocaleString("en-US", { timeZone: "America/Indiana/Indianapolis" })}</td>
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

  try {
    const result = await getResend().emails.send({
      from: "ProvenIQ <proveniq@thefortaiagency.ai>",
      to: "aoberlin@thefortaiagency.ai",
      subject: `ProvenIQ Waitlist: ${data.name}${data.practice ? ` — ${data.practice}` : ""}`,
      html: htmlContent,
      text: `New ProvenIQ waitlist signup:\n\nName: ${data.name}\nEmail: ${data.email}\nPractice: ${data.practice || "N/A"}\nRole: ${roleLabels[data.role] || data.role || "N/A"}\nTime: ${new Date().toISOString()}`,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return false;
    }

    console.log("Waitlist notification sent:", result.data?.id);
    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}
