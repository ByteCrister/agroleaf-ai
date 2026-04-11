/**
 * Generates a glassmorphism HTML email for AgroLeaf AI OTP verification.
 * @param {string} email - Recipient's email address.
 * @param {string} otp  - One‑time password (numeric or alphanumeric).
 * @returns {string} - Complete email HTML string.
 */
export default function generateOtpEmailHtml(email: string, otp: string) {
  // Sanitize inputs to prevent injection (simple escape)
  const safeEmail = String(email).replace(/[&<>]/g, function (m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
  const safeOtp = String(otp).replace(/[&<>]/g, function (m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>AgroLeaf AI – Your OTP Code</title>
  <style type="text/css">
    /* Reset & base styles for email clients */
    body, table, td, p, a, div, span {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      vertical-align: baseline;
    }
    body {
      background-color: #e9f3e6;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      width: 100%;
      margin: 0;
      padding: 0;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        padding: 16px !important;
      }
      .glass-card {
        padding: 24px 20px !important;
        border-radius: 28px !important;
      }
      .otp-code {
        font-size: 36px !important;
        padding: 16px 12px !important;
        letter-spacing: 6px !important;
      }
      .header-title {
        font-size: 28px !important;
      }
    }
    /* Dark mode support (light preference fallback) */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #1a2a1a !important;
      }
      .glass-card {
        background: rgba(30, 40, 25, 0.94) !important;
        border-color: rgba(10, 123, 74, 0.5) !important;
        color: #e2f0e2 !important;
      }
      .text-primary {
        color: #eef5ea !important;
      }
      .text-secondary {
        color: #c2d6b8 !important;
      }
      .otp-box {
        background: #1e2a1a !important;
        border-color: #0A7B4A !important;
      }
    }
    /* Outlook & legacy table fallback */
    .ExternalClass, .ReadMsgBody {
      width: 100%;
      background-color: #e9f3e6;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    .glass-card {
      background: #F5FAF0 !important;
      border: 1px solid #0A7B4A !important;
    }
    .otp-code {
      background: #ffffff !important;
      font-family: 'Courier New', monospace !important;
    }
  </style>
  <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#e9f3e6; font-family:'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <center style="width:100%;table-layout:fixed;">
    <div style="max-width:600px; width:100%; margin:0 auto; padding:20px 16px 40px;">
      <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%; margin:0 auto;">
        <tr>
          <td style="padding:0;">
            <div class="glass-card" style="background: linear-gradient(135deg, rgba(245,250,240,0.92), rgba(235,248,225,0.96)); backdrop-filter: blur(0px); border: 1px solid rgba(10, 123, 74, 0.3); border-radius: 32px; box-shadow: 0 20px 35px -12px rgba(10, 60, 30, 0.2), 0 0 0 1px rgba(10, 123, 74, 0.05); padding: 32px 28px;">
              
              <!-- Header with brand -->
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; background: #0A7B4A10; border-radius: 60px; padding: 6px 18px; margin-bottom: 12px; border: 1px solid rgba(10,123,74,0.2);">
                  <span style="font-size: 14px; font-weight: 600; color: #0A7B4A; letter-spacing: 0.3px;">🌿 AI FOR BANGLADESH AGRICULTURE</span>
                </div>
                <h1 class="header-title" style="font-size: 34px; font-weight: 700; margin: 12px 0 4px; color: #1A2E1A; letter-spacing: -0.3px;">AgroLeaf AI</h1>
                <div style="height: 4px; width: 60px; background: #0A7B4A; border-radius: 4px; margin: 12px auto 0;"></div>
              </div>
              
              <!-- Greeting & email -->
              <div style="margin-bottom: 28px;">
                <p style="font-size: 16px; font-weight: 500; color: #1A2E1A; margin-bottom: 8px;">Hello,</p>
                <p style="font-size: 15px; color: #3A4D3A; line-height: 1.45; margin: 0 0 6px 0;">You requested to verify your account for <strong style="color:#0A7B4A;">AgroLeaf AI</strong> — your intelligent farming companion.</p>
                <p style="font-size: 14px; color: #4A5E4A; background: rgba(10,123,74,0.08); padding: 8px 12px; border-radius: 20px; display: inline-block; margin-top: 12px;">
                  📧 <span style="font-weight: 500;">${safeEmail}</span>
                </p>
              </div>
              
              <!-- OTP Section -->
              <div style="margin: 28px 0 24px;">
                <div style="text-align: center; margin-bottom: 12px;">
                  <span style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; background: rgba(10,123,74,0.12); padding: 5px 14px; border-radius: 50px; color: #0A7B4A;">verification code</span>
                </div>
                <div class="otp-box" style="background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(10, 123, 74, 0.35); border-radius: 28px; padding: 8px 12px; text-align: center; box-shadow: 0 6px 14px rgba(0,0,0,0.03);">
                  <div class="otp-code" style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 46px; font-weight: 700; letter-spacing: 10px; color: #0A7B4A; background: transparent; padding: 18px 12px; word-break: break-word; text-align: center;">
                    ${safeOtp}
                  </div>
                </div>
                <p style="font-size: 13px; color: #5B6E5B; text-align: center; margin-top: 18px;">
                  🔒 This code is valid for <strong>10 minutes</strong>. Do not share this OTP with anyone.
                </p>
              </div>
              
              <!-- Info box -->
              <div style="background: rgba(10,123,74,0.06); border-radius: 20px; padding: 16px 20px; margin: 18px 0 22px; border-left: 4px solid #0A7B4A;">
                <p style="margin: 0; font-size: 14px; color: #2C5F2D; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                  <span style="font-size: 22px;">🌾</span>
                  <span>Enter this 6‑digit code on the AgroLeaf AI login screen to complete your authentication.</span>
                </p>
              </div>
              
              <!-- Divider -->
              <div style="height: 1px; background: rgba(10,123,74,0.2); margin: 24px 0 20px;"></div>
              
              <!-- Footer -->
              <div style="text-align: center;">
                <p style="font-size: 13px; color: #4C644C; margin-bottom: 12px;">
                  Need help? Contact 
                  <a href="mailto:support@agroleaf.ai" style="color: #0A7B4A; text-decoration: none; font-weight: 500; border-bottom: 1px dashed #0A7B4A;">support@agroleaf.ai</a>
                </p>
                <p style="font-size: 12px; color: #688B68; margin: 10px 0 0;">
                  AgroLeaf AI • Smart insights for Bangladesh farmers & agribusiness
                </p>
                <div style="margin-top: 20px;">
                  <span style="font-size: 11px; color: #7E9A7E;">🌱 Data-driven. Green future. Made with 🇧🇩</span>
                </div>
              </div>
            </div>
            <p style="text-align: center; font-size: 11px; color: #819B81; margin-top: 28px;">
              You received this email because a verification attempt was made for AgroLeaf AI. If you did not request this, please ignore or contact support.
            </p>
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>
</html>`;
}