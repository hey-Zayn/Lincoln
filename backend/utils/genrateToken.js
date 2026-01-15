const jwt = require("jsonwebtoken");

const genrateToken = (userId, res) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("CRITICAL ERROR: JWT_SECRET is missing from environment variables");
        throw new Error("Server configuration error: JWT_SECRET missing");
    }

    const token = jwt.sign({ userId }, secret, { expiresIn: "1d" });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    if (!isProduction) {
        console.log(`Token generated for user: ${userId}`);
    }
}

module.exports = genrateToken