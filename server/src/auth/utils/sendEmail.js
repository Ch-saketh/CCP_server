const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendEmail = async (email, otp) => {
  await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      name: "CCP Platform",
      email: process.env.BREVO_EMAIL,
    },
    to: [{ email }],
    subject: "Email Verification OTP",
    htmlContent: `
      <h2>Verify Your Email</h2>
      <h1>${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
    `,
  });
};

module.exports = sendEmail;