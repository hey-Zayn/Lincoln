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

const quizProgressSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    passed: {
        type: Boolean,
        default: false
    },
    score: {
        type: Number,
        default: 0
    },
    attempts: {
        type: Number,
        default: 0
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
    lectureProgress: [lectureProgressSchema],
    quizProgress: [quizProgressSchema]
}, { timestamps: true });

courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

module.exports = CourseProgress;