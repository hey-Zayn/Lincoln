const jwt = require("jsonwebtoken");

const genrateToken = (userId, res) => {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is missing from environment variables");
        throw new Error("Server configuration error: JWT_SECRET missing");
    }
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: true, // Always true for cross-site cookies, required by sameSite: 'none'
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
    })
}

module.exports = genrateToken