const { transporter } = require('./config');
require('dotenv').config();

const sendMail = async (email, options = {}) => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL,
      to: email,
      subject: options.subject,
      text: options.text || options.message,
      html: options.html,
    });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
};

module.exports = {
  sendMail,
};
