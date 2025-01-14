import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { shopkeeperModel } from "../models/shopkeeper.model.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

//register
export const signup = async (req, res) => {
  const { name, phoneNumber, email, password, shopName } = req.body;

  try {

    if(!name && !phoneNumber && !email && !password && !shopName){
      return res.status(400).json({
        success: false,
        message: "All fileds are required"
      })
    }

    const shopkeeperExists = await shopkeeperModel.findOne({ email });
    if (shopkeeperExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const shopkeeper = new shopkeeperModel({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      shopName,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await shopkeeper.save();

    // jwt
    generateTokenAndSetCookie(res, shopkeeper._id);

    await sendVerificationEmail(shopkeeper.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "shopkeeper created successfully",
      shopkeeper: {
        ...shopkeeper._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "server signup not response",
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const shopkeeper = await shopkeeperModel.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!shopkeeper) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    shopkeeper.isVerified = true;
    shopkeeper.verificationToken = undefined;
    shopkeeper.verificationTokenExpiresAt = undefined;

    await shopkeeper.save();

    await sendWelcomeEmail(shopkeeper.email, shopkeeper.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      shopkeeper: {
        ...shopkeeper._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in verifyEmail",
    });
  }
};

//login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const shopkeeper = await shopkeeperModel.findOne({ email });
    if (!shopkeeper) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      shopkeeper.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Password is wrong",
      });
    }

    generateTokenAndSetCookie(res, shopkeeper._id);

    shopkeeper.lastLogin = new Date();
    await shopkeeper.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      shopkeeper: {
        ...shopkeeper._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in login",
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const shopkeeper = await shopkeeperModel.findOne({ email });
    if (!shopkeeper) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1hour

    shopkeeper.resetPasswordToken = resetToken;
    shopkeeper.resetPasswordExpiresAt = resetTokenExpiresAt;

    await shopkeeper.save();

    //send email
    await sendPasswordResetEmail(
      shopkeeper.email,
      `${process.env.FRONTEND_SHOPKEEPER_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Passowrd reset link sent to your email",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in forgot-password",
    });
  }
};

//reset password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const shopkeeper = await shopkeeperModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!shopkeeper) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reser token",
      });
    }

    //update password
    const hashPassword = await bcryptjs.hash(password, 10);

    shopkeeper.password = hashPassword;
    shopkeeper.resetPasswordToken = undefined;
    shopkeeper.resetPasswordExpiresAt = undefined;

    await shopkeeper.save();

    await sendResetSuccessEmail(shopkeeper.email)
    
    res.status(200).json({
      success: true,
      message: "Password reset successfull",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in reset-password",
    });
  }
};

//logout
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const checkAuth = async (req, res) => {
  try {
    const shopkeeper = await shopkeeperModel.findById(req.userId).select("-password")
    if(!shopkeeper){
      return res.status(400).json({
        success: false,
        message: "Shopkeeper not found!"
      })
    }

    res.status(200).json({
      success: true,
      shopkeeper
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in check-auth",
    });
  }
}
