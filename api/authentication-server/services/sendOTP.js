const nodemailer = require("nodemailer");
const fs = require("fs");

// Load the email template file
const emailTemplate = fs.readFileSync(
  `${__dirname}/../templates/email-otp.html`, // File path
  "utf-8" // File encoding
);

// Function to render the email template with the provided OTP
const renderEmail = (otp) => {
  return emailTemplate.replace("{{otp}}", otp); // Replace the {{otp}} placeholder with the OTP and return the resulting string
};

// Read SMTP server credentials from environment variables
const { SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT } = process.env;

// Export the sendOTP function
module.exports = async function sendOTP(email, otp) {
  // Create a nodemailer transport using the SMTP server credentials
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // Use TLS
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
  });

  // Create the email options
  const mailOptions = {
    from: SMTP_USERNAME, // Sender's email address
    to: email, // Recipient's email address
    subject: "Your one-time password", // Email subject
    html: renderEmail(otp), // Email content
  };

  // Send the email and return a promise that resolves when it's sent successfully
  return await transporter.sendMail(mailOptions);
};
