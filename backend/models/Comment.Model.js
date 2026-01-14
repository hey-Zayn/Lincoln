const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    isEdited: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
