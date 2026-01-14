const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const Department = mongoose.model("Department", DepartmentSchema);
module.exports = Department;
