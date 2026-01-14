const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [
        {
            type: String,
            required: true
        }
    ],
    correctIndex: {
        type: Number,
        required: true
    }
});

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    questions: [QuestionSchema],
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false // Optional if it's a course-level quiz
    },
    passingScore: {
        type: Number,
        default: 70
    }
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
