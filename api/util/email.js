const nodemailer = require('nodemailer');
const fs = require('fs');
const moment = require('moment');

// This function only sends emails in the production environment

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
});

const logEmail = ({ to, subject, textBody, htmlBody }) => {
  return new Promise(async (resolve, reject) => {
    if (!process.env.EMAIL_LOG_PATH || !process.env.EMAIL_LOG_PATH.length) {
      reject("No email log path specified!");
      return;
    }
    const dateTime = moment().format('YYYY-MM-DD\THH:mm:ss');
    const log = `---- Sending email at ${dateTime} ---- \n  to: ${to}\n  from: ${process.env.SMTP_FROM_ADDRESS}\n  subject: ${subject}\n  text: ${textBody}\n  html: ${htmlBody}\n\n`;
    fs.appendFile(process.env.EMAIL_LOG_PATH, log, err => {
      if (err)
        reject(err);
      resolve({ messageId: `${dateTime}-${to}-mail` });
    });
  });
};

const sendMail = (options) => {
  return new Promise(async (resolve, reject) => {
    const environment = process.env.ENVIRONMENT;
    const { to, subject, textBody, htmlBody } = options;
    if (environment === 'production') {
      try {
        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM_ADDRESS,
          to,
          subject,
          text: textBody,
          html: htmlBody
        });
        resolve(info);
      } catch (e) {
        console.error("Could not send email: ", e);
        reject(e);
        return;
      }

      try {
        await logEmail(options);
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const result = await logEmail(options);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    }
  });
}

module.exports = {
  sendMail
};
