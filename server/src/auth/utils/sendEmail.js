// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.BREVO_SMTP_LOGIN,
//     pass: process.env.BREVO_SMTP_KEY,
//   },
// });

// const sendOTP = async (email, otp) => {
//   await transporter.sendMail({
//     from: `"CCP Platform" <${process.env.BREVO_EMAIL}>`,
//     to: email,
//     subject: "Email Verification OTP",
//     html: `
//       <h2>Verify Your Email</h2>
//       <p>Your OTP is:</p>
//       <h1>${otp}</h1>
//       <p>This OTP expires in 10 minutes.</p>
//     `,
//   });
// };

// module.exports = sendOTP;

const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (email, otp) => {
  await apiInstance.sendTransacEmail({
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