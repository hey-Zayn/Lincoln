const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    courseLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        default: "Beginner"
    },
    CourseLanguage: {
        type: String,
        required: false,
        default: "English"
    },
    price: {
        type: Number,
        default: 0
    },
    thumbnail: {
        type: String,
        default: ""
    },
    previewVideo: {
        type: String,
        default: ""
    },
    learningOutcomes: [
        {
            type: String,
            default: ""
        }
    ],
    requirements: [
        {
            type: String,
            default: []
        },
    ],
    lectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture"
        }
    ],
    sections: [
        {
            sectionTitle: { type: String, required: true },
            lectures: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Lecture"
                }
            ],
            quiz: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Quiz"
            }
        }
    ],
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    materials: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Material"
        }
    ],
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
