const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    maxPoints: {
        type: Number,
        required: true,
        default: 100
    }
}, { timestamps: true });

const Assignment = mongoose.model("Assignment", AssignmentSchema);
module.exports = Assignment;
