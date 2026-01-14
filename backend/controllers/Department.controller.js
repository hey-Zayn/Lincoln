const Department = require("../models/Department.model");

exports.createDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Department name is required", success: false });
        }

        const existingDepartment = await Department.findOne({ name });
        if (existingDepartment) {
            return res.status(400).json({ message: "Department already exists", success: false });
        }

        const department = new Department({ name, description });
        await department.save();

        res.status(201).json({
            message: "Department created successfully",
            success: true,
            department
        });
    } catch (error) {
        console.error("Error in createDepartment:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json({ success: true, departments });
    } catch (error) {
        console.error("Error in getAllDepartments:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
