const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { registerUser, loginUser, logoutUser, getUser, verifyUser, forgotPassword, resetPassword, updatePassword, updateProfileUser } = require("../controllers/User.controller");
const protectedRoute = require("../middlewares/Auth.Middleware");

router.post("/register", [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("userName").trim().notEmpty().withMessage("Username is required"),
    body("email").trim().isEmail().withMessage("Invalid email format").normalizeEmail(),
    body("phone").trim().notEmpty().withMessage("Phone number is required")
        .isLength({ min: 10, max: 15 }).withMessage("Phone number must be between 10 and 15 digits"),
    body("address").trim().notEmpty().withMessage("Address is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("role").optional().isIn(["student", "teacher", "parent", "admin"]).withMessage("Invalid role")
], registerUser);

router.post("/login", [
    body("email").trim().isEmail().withMessage("Invalid email format").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required")
], loginUser);

router.post("/logout", logoutUser);

router.post("/verify", [
    body("email").trim().isEmail().withMessage("Invalid email format").normalizeEmail(),
    body("code").trim().isLength({ min: 6, max: 6 }).withMessage("Verification code must be 6 digits")
], verifyUser);

router.post("/forgot-password", [
    body("email").trim().isEmail().withMessage("Invalid email format").normalizeEmail()
], forgotPassword);

router.post("/reset-password", [
    body("email").trim().isEmail().withMessage("Invalid email format").normalizeEmail(),
    body("code").trim().isLength({ min: 6, max: 6 }).withMessage("Reset code must be 6 digits"),
    body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
], resetPassword);

router.put("/update-password", protectedRoute, [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long")
], updatePassword);

router.get("/me", protectedRoute, getUser);

router.put('/profile', protectedRoute, [
    body("firstName").optional().trim().notEmpty().withMessage("First name cannot be empty"),
    body("lastName").optional().trim().notEmpty().withMessage("Last name cannot be empty"),
    body("userName").optional().trim().notEmpty().withMessage("Username cannot be empty"),
    body("phone").optional().trim().notEmpty().withMessage("Phone number cannot be empty")
        .isLength({ min: 10, max: 15 }).withMessage("Phone number must be between 10 and 15 digits"),
    body("address").optional().trim().notEmpty().withMessage("Address cannot be empty"),
    body("bio").optional().trim(),
    body("profilePicture").optional().trim()
], updateProfileUser);




module.exports = router;

