const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        default: ""
    },
    address: {
        type: String,
        required: true,
        default: ""
    },
    nationalID: {
        type: String,
        required: true,
        default: ""
    },
    enrolledcourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ],
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["student", "teacher", "parent", "management", "admin"],

        default: "student"
    },
    profilePicture: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        default: ""
    },
    verificationCodeExpires: {
        type: Date,
        default: null
    },
    resetPasswordCode: {
        type: String,
        default: ""
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    // For Parents to track children
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    // For Students to see their parents
    parents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    // For Teachers to track their students
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    // For Students to see their teachers
    teachers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    courseProgress: [
        {
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course"
            },
            progress: {
                type: Number,
                default: 0
            }
        }
    ],
}, { timestamps: true });


userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


const User = mongoose.model("User", userSchema);
module.exports = User;


