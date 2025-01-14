import nodemailer from "nodemailer";
import dotenv from 'dotenv'

dotenv.config({})

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.NODE_EMAIL_USER,
    pass: process.env.NODE_EMAIL_PASS,
  },
});

/*
const SendEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: '"Shoopfinity" <shoopfinity@gmail.com>', // sender address
      to: "sshinde6962@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
	console.log(info)
  } catch (error) {
    console.log(error);p
    return res.status(500).json({
      success: false,
      message: "server SendEmail not response",
    });
  }
};

SendEmail()
*/