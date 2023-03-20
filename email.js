// email.js
const nodemailer = require('nodemailer');

async function sendEmail(userInput, aiResponse) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER, // Your email address to receive the notifications
    subject: 'API Call Notification',
    text: `User input: ${userInput}\nAI response: ${aiResponse}`,
  };

  try {
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = sendEmail;
