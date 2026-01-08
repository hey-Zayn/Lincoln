const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        min: 0
    },
    feedback: {
        type: String
    }
}, { timestamps: true });

const Submission = mongoose.model("Submission", SubmissionSchema);
module.exports = Submission;
