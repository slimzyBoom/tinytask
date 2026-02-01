export const emailVerificationTemplate = (
  fullName: string,
  verificationCode: string,
): string => {
  return `
    <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table
            width="600"
            cellspacing="0"
            cellpadding="20"
            style="background-color: #ffffff; border-radius: 8px;"
          >
            <!-- Header -->
            <tr>
              <td
                align="center"
                style="background-color: #4f46e5; color: #ffffff; border-radius: 8px 8px 0 0;"
              >
                <h1 style="margin: 0;">Verify Your Email</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="color: #333333; font-size: 16px; line-height: 1.6;">
                <p>Hi <strong>${fullName}</strong>,</p>

                <p>
                  Thanks for signing up. Please use the verification code below
                  to complete your registration.
                </p>

                <p
                  style="
                    margin: 30px 0;
                    text-align: center;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 6px;
                    color: #4f46e5;
                  "
                >
                  ${verificationCode}
                </p>

                <p>
                  This code will expire in <strong>10 minutes</strong>.  
                  If you did not initiate this request, you can safely ignore
                  this email.
                </p>

                <p style="margin-top: 30px;">
                  Cheers,<br />
                  TinyTask Team
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="font-size: 12px; color: #999999;">
                <p>© ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};

export const passwordResetTemplate = (url: string, token: string): string => {
  const resetLink = `${url}?token=${token}`;
  return `
<table width="100%" cellspacing="0" cellpadding="0" style="background-color:#f3f4f6;">
  <tr>
    <td align="center" style="padding:40px 0;">
      <table width="600" cellspacing="0" cellpadding="20" style="background-color:#ffffff;border-radius:8px;">
        <!-- Header -->
        <tr>
          <td align="center" style="background-color:#4f46e5;color:#ffffff;border-radius:8px 8px 0 0;">
            <h1 style="margin:0;">Reset Your Password</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="color:#333333;font-size:16px;line-height:1.6;">
            <p style="margin:0 0 16px 0;">
              We received a request to reset your password.
            </p>

            <p style="margin:0 0 20px 0;">
              Click the button below to create a new password.
            </p>

            <!-- Button -->
            <div style="text-align:center;margin:28px 0 18px 0;">
              <a
                href="${resetLink}"
                style="
                  display:inline-block;
                  background-color:#4f46e5;
                  color:#ffffff;
                  text-decoration:none;
                  padding:14px 22px;
                  border-radius:8px;
                  font-weight:600;
                  font-size:16px;
                "
                target="_blank"
                rel="noopener noreferrer"
              >
                Reset Password
              </a>
            </div>

            <p style="margin:0 0 12px 0;color:#6b7280;font-size:14px;">
              This link will expire in <strong>10 minutes</strong>.
            </p>

            <!-- Fallback link -->
            <p style="margin:18px 0 8px 0;font-size:14px;color:#374151;">
              If the button doesn’t work, copy and paste this link into your browser:
            </p>

            <p style="word-break:break-all;margin:0 0 18px 0;font-size:13px;line-height:1.5;">
              <a href="${resetLink}" style="color:#4f46e5;text-decoration:underline;" target="_blank" rel="noopener noreferrer">
                ${resetLink}
              </a>
            </p>

            <!-- Caution -->
            <div style="margin-top:18px;padding:14px 14px;background-color:#fff7ed;border:1px solid #fed7aa;border-radius:8px;">
              <p style="margin:0 0 10px 0;font-weight:600;color:#9a3412;">
                Security notice
              </p>
              <ul style="margin:0;padding-left:18px;color:#9a3412;font-size:14px;line-height:1.6;">
                <li>Do not share this link with anyone — our team will never ask for it.</li>
                <li>If you didn’t request a password reset, ignore this email. Your password will not change.</li>
              </ul>
            </div>

            <p style="margin-top:26px;">
              Cheers,<br />
              TinyTask Team
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="font-size:12px;color:#999999;">
            <p style="margin:0;">© ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
};
