const nodemailer = require("nodemailer");
const fs = require("fs");

const emailTemplate = fs.readFileSync(
  `${__dirname}/../templates/email-otp.html`,
  "utf-8"
);

const renderEmail = (otp) => {
  return emailTemplate.replace("{{otp}}", otp);
};

const SMTP_USERNAME = "";
const SMTP_PASSWORD = "";
const SMTP_HOST = "smtp-mail.outlook.com";
const SMTP_PORT = 587;

module.exports = async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: "",
    to: email,
    subject: "Your one-time password",
    html: renderEmail(otp),
  };

  return await transporter.sendMail(mailOptions);
};
