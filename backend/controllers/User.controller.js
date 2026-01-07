const { validationResult } = require("express-validator");
const User = require("../models/User.Model");
const jwt = require("jsonwebtoken");
const genrateToken = require("../utils/genrateToken");
const { sendVerificationEmail, sendResetPasswordEmail } = require("../utils/email.util");



const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { firstName, lastName, userName, email, phone, address, password, role } = req.body;


        const emailExist = await User.findOne({ email });

        if (emailExist) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            })
        }
        const phoneExist = await User.findOne({ phone });

        if (phoneExist) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this phone"
            })
        }
        const userNameExist = await User.findOne({ userName });

        if (userNameExist) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this username"
            })
        }

        // Generate 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        const newUser = await User.create({
            firstName,
            lastName,
            userName,
            email,
            phone,
            address,
            password,
            role: role || "student", // Ensure default role if not provided
            verificationCode,
            verificationCodeExpires
        });

        if (newUser) {
            await sendVerificationEmail(email, verificationCode);
            genrateToken(newUser._id, res);

            return res.status(201).json({ // Use 201 Created
                success: true,
                message: "User registered successfully. Please check your email for verification code.",
                user: { // Standardize to 'user' instead of 'newUser' for consistency
                    _id: newUser._id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    userName: newUser.userName,
                    email: newUser.email,
                    role: newUser.role,
                    isVerified: newUser.isVerified
                }
            })
        }


    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        })
    }
};

const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        genrateToken(user._id, res);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        })
    }
};

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "User Logged Out Successfully"
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        })
    }
};

const getUser = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User Authenticated Successfully",
            user: req.user
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        })
    }
};


const verifyUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, code } = req.body;

        const user = await User.findOne({
            email,
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code"
            })
        }

        user.isVerified = true;
        user.verificationCode = "";
        user.verificationCodeExpires = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User verified successfully",
            user
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No user found with this email"
            });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        await user.save();

        await sendResetPasswordEmail(email, resetCode);

        res.status(200).json({
            success: true,
            message: "Password reset code sent to your email"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, code and new password are required"
            });
        }

        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset code"
            });
        }

        user.password = newPassword;
        user.resetPasswordCode = "";
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid old password"
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    verifyUser,
    forgotPassword,
    resetPassword,
    updatePassword
}