import nodemailer from 'nodemailer';

export async function sendVerificationEmail(to: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PW,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: 'Simple App - 👋 Thanks for signing up!',
    text: `
    Thanks for signing up with Simple App! You must follow this link of registration to activate your account:
    
    http://${process.env.DOMAIN}:${process.env.PORT}/auth/accept/${token}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error(error);
    throw new Error('Email sent failed');
  }
}
