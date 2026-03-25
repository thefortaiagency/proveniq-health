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

export async function sendWaitlistConfirmation(data: WaitlistSignup) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured — skipping confirmation email");
    return false;
  }

  const firstName = data.name.split(" ")[0];

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f8fafb;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:12px;border:1px solid #e2e8ec;">
    <!-- Header with brand bar -->
    <tr>
      <td style="padding:0;">
        <div style="background:linear-gradient(135deg,#1a7a6a 0%,#22917f 50%,#d4a843 100%);height:6px;border-radius:12px 12px 0 0;"></div>
      </td>
    </tr>
    <tr>
      <td style="padding:40px 32px 24px;text-align:center;">
        <h1 style="margin:0 0 4px;font-size:24px;color:#1a7a6a;font-weight:700;">ProvenIQ</h1>
        <p style="margin:0;font-size:13px;color:#94a3b2;letter-spacing:0.5px;">CLINICAL INTELLIGENCE</p>
      </td>
    </tr>

    <!-- Main content -->
    <tr>
      <td style="padding:0 32px;">
        <h2 style="margin:0 0 16px;font-size:20px;color:#1e293b;font-weight:600;">You're on the list, ${firstName}.</h2>
        <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
          Thank you for your interest in ProvenIQ. We're building clinical intelligence that turns your EHR data into evidence-based treatment recommendations — ranked by what actually works for patients like yours.
        </p>
        <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
          We're onboarding a limited number of practices for our initial launch, and you've secured your spot in line.
        </p>
      </td>
    </tr>

    <!-- What to expect -->
    <tr>
      <td style="padding:0 32px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9f7;border-radius:8px;border:1px solid #adddd5;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#1a7a6a;">What happens next:</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#334155;line-height:1.5;">
                    <span style="color:#1a7a6a;font-weight:700;margin-right:8px;">1.</span>
                    We'll reach out to schedule a brief intro call
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#334155;line-height:1.5;">
                    <span style="color:#1a7a6a;font-weight:700;margin-right:8px;">2.</span>
                    We'll review your EHR setup and data compatibility
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#334155;line-height:1.5;">
                    <span style="color:#1a7a6a;font-weight:700;margin-right:8px;">3.</span>
                    You'll get a personalized demo with your practice's data
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding:0 32px 32px;text-align:center;">
        <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
          In the meantime, learn more about what ProvenIQ can do for your practice:
        </p>
        <a href="https://proveniq.health/#how-it-works" style="display:inline-block;background-color:#1a7a6a;color:#ffffff;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">See How It Works</a>
      </td>
    </tr>

    <!-- Divider -->
    <tr>
      <td style="padding:0 32px;">
        <div style="border-top:1px solid #e2e8ec;"></div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:24px 32px 32px;text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;color:#94a3b2;">ProvenIQ Health</p>
        <p style="margin:0 0 8px;font-size:12px;color:#94a3b2;">
          A product of <a href="https://thefortaiagency.com" style="color:#64748b;text-decoration:none;">The Fort AI Agency</a> &amp; <a href="https://aimpactnexus.ai" style="color:#64748b;text-decoration:none;">AImpact Nexus</a>
        </p>
        <p style="margin:0;font-size:11px;color:#cbd5e1;">
          You're receiving this because you signed up at proveniq.health
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const result = await getResend().emails.send({
      from: "ProvenIQ <proveniq@thefortaiagency.ai>",
      to: data.email,
      subject: `You're on the list, ${firstName} — ProvenIQ Health`,
      html: htmlContent,
      text: `You're on the list, ${firstName}.\n\nThank you for your interest in ProvenIQ. We're building clinical intelligence that turns your EHR data into evidence-based treatment recommendations — ranked by what actually works for patients like yours.\n\nWe're onboarding a limited number of practices for our initial launch, and you've secured your spot in line.\n\nWhat happens next:\n1. We'll reach out to schedule a brief intro call\n2. We'll review your EHR setup and data compatibility\n3. You'll get a personalized demo with your practice's data\n\nLearn more: https://proveniq.health/#how-it-works\n\n—\nProvenIQ Health\nA product of The Fort AI Agency & AImpact Nexus`,
    });

    if (result.error) {
      console.error("Confirmation email error:", result.error);
      return false;
    }

    console.log("Waitlist confirmation sent to:", data.email, result.data?.id);
    return true;
  } catch (error) {
    console.error("Confirmation email failed:", error);
    return false;
  }
}
