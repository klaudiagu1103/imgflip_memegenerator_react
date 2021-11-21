/**
 * Functionality to send email to the user who forgets password.
 * The config.env file contains the different parameters of the sendEmail function (username, pw, etc.). We use SendGrid for the sending functionality.
 */

const nodemailer = require("nodemailer"); // Source: https://www.npmjs.com/package/nodemailer

const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;
