
import nodemailer from 'nodemailer';
import 'dotenv/config';

async function main() {
  console.log("Attempting to send test email...");
  console.log(`User: ${process.env.EMAIL_USER}`);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true,
    logger: true
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self to test
      subject: "Test Email from Debug Script",
      text: "If you receive this, the email system is working!",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error occurred while sending email:");
    console.error(error);
  }
}

main();
