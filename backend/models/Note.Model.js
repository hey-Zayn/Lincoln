const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
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
    lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
        required: true
    },
    content: {
        type: String,
        default: ""
    }
}, { timestamps: true });

// Ensure a user has only one note per lecture
noteSchema.index({ userId: 1, lectureId: 1 }, { unique: true });

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
