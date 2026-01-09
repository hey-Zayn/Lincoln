const mongoose = require("mongoose");

const lectureProgressSchema = new mongoose.Schema({
    lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
        required: true
    },
    viewed: {
        type: Boolean,
        default: false
    }
});

const courseProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    lectureProgress: [lectureProgressSchema]
}, { timestamps: true });

courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

module.exports = CourseProgress;