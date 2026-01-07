const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, code) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.Node_Mailer_Email,
                pass: process.env.Node_Mailer_App_password,
            },
        });

        const mailOptions = {
            from: process.env.Node_Mailer_Email,
            to: email,
            subject: "Verify your email - Lincoln FYP",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #4CAF50; text-align: center;">Lincoln FYP Email Verification</h2>
                    <p>Dear User,</p>
                    <p>Thank you for registering with Lincoln FYP. Please use the following 6-digit code to verify your email address. This code is valid for 15 minutes.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 5px;">${code}</span>
                    </div>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>Best regards,<br>The Lincoln FYP Team</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully to:", email);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email");
    }
};

const sendResetPasswordEmail = async (email, code) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.Node_Mailer_Email,
                pass: process.env.Node_Mailer_App_password,
            },
        });

        const mailOptions = {
            from: process.env.Node_Mailer_Email,
            to: email,
            subject: "Reset your password - Lincoln FYP",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #FF5722; text-align: center;">Lincoln FYP Password Reset</h2>
                    <p>Dear User,</p>
                    <p>We received a request to reset your password. Please use the following 6-digit code to complete the process. This code is valid for 15 minutes.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 5px;">${code}</span>
                    </div>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>Best regards,<br>The Lincoln FYP Team</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Reset password email sent successfully to:", email);
    } catch (error) {
        console.error("Error sending reset password email:", error);
        throw new Error("Failed to send reset password email");
    }
}

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
