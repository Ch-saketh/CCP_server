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
// console.log("SMTP LOGIN:", process.env.BREVO_SMTP_LOGIN);
// console.log("SMTP KEY:", process.env.BREVO_SMTP_KEY ? "Loaded" : "Missing");
// console.log("FROM:", process.env.BREVO_EMAIL);

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


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

const sendEmail = async (email, otp) => {
  try {
    console.log("========== SMTP CONFIG ==========");
    console.log("SMTP LOGIN:", process.env.BREVO_SMTP_LOGIN);
    console.log(
      "SMTP KEY:",
      process.env.BREVO_SMTP_KEY ? "Loaded ✅" : "Missing ❌"
    );
    console.log("FROM EMAIL:", process.env.BREVO_EMAIL);
    console.log("=================================");

    // Verify SMTP Connection
    await transporter.verify();
    console.log("✅ SMTP Connected");

    // Send OTP Email
    const info = await transporter.sendMail({
      from: `"CCP Platform" <${process.env.BREVO_EMAIL}>`,
      to: email,
      subject: "Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Welcome to CCP Platform</h2>
          <p>Your verification OTP is:</p>
          <h1 style="color:#2563eb;">${otp}</h1>
          <p>This OTP is valid for <b>10 minutes</b>.</p>
        </div>
      `,
    });

    console.log("✅ Email Sent Successfully");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Email Sending Failed");
    console.error(error);

    throw error;
  }
};

module.exports = sendEmail;