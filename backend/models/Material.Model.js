const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["video", "document", "note"],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
    }
}, { timestamps: true });

const Material = mongoose.model("Material", MaterialSchema);
module.exports = Material;
