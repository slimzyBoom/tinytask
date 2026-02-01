import nodemailer from "nodemailer";
const SENDER_EMAIL = process.env.SENDER_EMAIL as string;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD as string;

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SENDER_EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

export const sendMail = async ({ to, subject, html }: MailOptions) => {
  try {
    const mailOptions = {
      from: `"TinyTask" <${SENDER_EMAIL}>`,
      to,
      subject,
      html,
    };
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending email: ", error);
  }
};
