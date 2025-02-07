import nodemailer from 'nodemailer';

export const sendEmail = async ({
  from,
  to,
  subject,
  html,
}: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> => {
  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
          pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // ⚠️ Desativa a verificação do certificado
      },
    });

    const info = await transport.sendMail({ from, to, subject, html });
    return info.accepted.includes(to);
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};