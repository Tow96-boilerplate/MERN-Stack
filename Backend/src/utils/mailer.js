/** mailer.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Utility that contains functions to generate and send emails
 */
const dotenv = require('dotenv');
dotenv.config();

const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const logger = require('./logger');
const PasswordToken = require('../database/models/passwordResetToken');

const { NAME, EMAIL, EMAIL_PASSWORD, FRONTEND } = process.env;

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: NAME,
    link: FRONTEND,
    //TODO: Create and add logo
    //logo: 'https://avatars3.githubusercontent.com/u/11511711?s=460&u=9f55fbd68f05113f749132b9ca966e34b6337cf0&v=4'
  }
});

module.exports.confirmationEmail = async (recipient, user, token) => {
  const email = {
    body: {
      greeting: `Hi`,
      name: user,
      intro: `Welcome to ${NAME}`,
      action: {
        instructions: `To start creating Forms and Teams, please confirm your email:`,
        button: {
          color: `#22BC66`,
          text: `Confirm my email`,
          link: `${process.env.FRONTEND}/verify/${token}`,
        },
      },
      outro: `You didn\'t create this account? Contact us to fix it`,
      signature: `Thanks`,
    }
  };

  // Creates the email in both HTML and plain text
  const emailBody = mailGenerator.generate(email);
  const textEmail = mailGenerator.generatePlaintext(email);

  try {
    let info = await transporter.sendMail({
      from: `${NAME} <${EMAIL}>`,
      to: recipient,
      subject: "Confirm your account",
      text: textEmail,
      html: emailBody,
    });
    logger.info(`Sent confirmation mail: ${info.messageId}`);
  }
  catch (error) {
    logger.warn(`Failed to send confirmation mail: ${error}`);
  }

}

module.exports.resetPasswordEmail = async (recipient, username, token, userId) => {
  const email = {
    body: {
      greeting: `Hi`,
      name: username,
      intro: `You've asked for a password reset.`,
      action: {
        instructions: `To restore your password, click in the following link`,
        button: {
          color: `#22BC66`,
          text: `Reset my password`,
          link: `${process.env.FRONTEND}/reset/${token}`,
        },
      },
      outro: `You didn't ask for this. Ignore the message. Never send this link to anyone.`,
      signature: `From`,
    }
  };

  // Creates the email in bot HTML and plain text
  const emailBody = mailGenerator.generate(email);
  const textEmail = mailGenerator.generatePlaintext(email);

  try {
    // Deletes all previous passwordTokens assigned to the user
    await PasswordToken.deleteMany({ _ownerId: userId });

    // Creates a register of the new token
    const newToken = await new PasswordToken({
      _ownerId: userId,
      token: token,
      createdAt: new Date().toISOString(),
    }).save();

    logger.info(`Created passwordResetToken: ${newToken.token}`);

    // Sends the mail
    let info = await transporter.sendMail({
      from: `${NAME} <${EMAIL}>`,
      to: recipient,
      subject: "Password reset",
      text: textEmail,
      html: emailBody,
    });
    logger.info(`Sent password reset mail: ${info.messageId}`);
  }
  catch (error) {
    logger.warn(`Failed to send password reset mail: ${error}`);
  }
}
