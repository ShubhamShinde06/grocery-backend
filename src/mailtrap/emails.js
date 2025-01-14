import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  Welcome_Email_Template,
} from "./emialTemplats.js";

import { transporter } from "./mailtrap.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await transporter.sendMail({
      from: '"Shoopfinity" <shoopfinity@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    //console.log("Email send successfully", response)
  } catch (error) {
    console.log("Error sending verification email", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"Shoopfinity" <shoopfinity@gmail.com>', // sender address
      to: email,
      subject: "Welcome to Shoopfinity",
      text: "Welcome Email",
      html: Welcome_Email_Template.replace("{name}", name),
    });
    //console.log("Email email welcome successfully", response)
  } catch (error) {
    console.log("Error welcome  email", error);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const response = await transporter.sendMail({
      from: '"Shoopfinity" <shoopfinity@gmail.com>', // sender address
      to: email,
      subject: "Reset Password",
      text: "Reset Password Email",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });
    console.log("Email Password Reset", response)
  } catch (error) {
    console.log("Error password rest  email", error);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const response = await transporter.sendMail({
      from: '"Shoopfinity" <shoopfinity@gmail.com>', // sender address
      to: email,
      subject: "Password Reset Successful",
      text: "Password Reset",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log("Email email welcome successfully", response)
  } catch (error) {
    console.log("Error reset email send", error);
  }
};
