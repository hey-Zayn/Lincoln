const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    videoUrl: {
        type: String,
        default: ""
    },
    publicId: {
        type: String,
        default: ""
    },
    isPreviewFree: {
        type: Boolean,
        default: false,
    },
    materials: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Material"
        }
    ]
}, { timestamps: true });


const Lecture = mongoose.model("Lecture", lectureSchema);

module.exports = Lecture;