const Class = require("../models/Class.model");
const User = require("../models/User.Model");

exports.createClass = async (req, res) => {
    try {
        const { className, department, departmentId, teacher, students } = req.body;
        const deptId = department || departmentId;

        if (!className || !deptId) {
            return res.status(400).json({ message: "Class name and department are required", success: false });
        }

        const newClass = new Class({
            className,
            department: deptId,
            teacher,
            students
        });

        await newClass.save();

        res.status(201).json({
            message: "Class created successfully",
            success: true,
            class: newClass
        });
    } catch (error) {
        console.error("Error in createClass:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

exports.assignTeacher = async (req, res) => {
    try {
        const { classId, teacherId } = req.body;
        const targetClass = await Class.findById(classId);
        if (!targetClass) {
            return res.status(404).json({ message: "Class not found", success: false });
        }

        const teacher = await User.findById(teacherId);
        if (!teacher || (teacher.role !== "teacher" && teacher.role !== "management" && teacher.role !== "admin")) {
            return res.status(400).json({ message: "Invalid teacher ID or user is not a teacher", success: false });
        }

        targetClass.teacher = teacherId;
        await targetClass.save();

        res.status(200).json({ message: "Teacher assigned successfully", success: true, class: targetClass });
    } catch (error) {
        console.error("Error in assignTeacher:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

exports.addStudents = async (req, res) => {
    try {
        const { classId, studentIds } = req.body; // studentIds should be an array
        const targetClass = await Class.findById(classId);
        if (!targetClass) {
            return res.status(404).json({ message: "Class not found", success: false });
        }

        // Ensure studentIds is an array
        const studentIdsArray = Array.isArray(studentIds) ? studentIds : [studentIds];

        // Add students to the class, maintaining uniqueness
        const existingStudentIds = targetClass.students.map(id => id.toString());
        const newStudentIds = studentIdsArray.filter(id => id); // Filter out any null/undefined

        const uniqueStudentIds = [...new Set([...existingStudentIds, ...newStudentIds])];
        targetClass.students = uniqueStudentIds;
        await targetClass.save();

        res.status(200).json({ message: "Students added successfully", success: true, class: targetClass });
    } catch (error) {
        console.error("Error in addStudents:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

exports.getClassDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const targetClass = await Class.findById(id)
            .populate("department")
            .populate("teacher", "firstName lastName email")
            .populate("students", "firstName lastName email");

        if (!targetClass) {
            return res.status(404).json({ message: "Class not found", success: false });
        }

        res.status(200).json({ success: true, class: targetClass });
    } catch (error) {
        console.error("Error in getClassDetails:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};


exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find()
            .populate("department")
            .populate("teacher", "firstName lastName email")
            .populate("students", "firstName lastName email");

        res.status(200).json({ success: true, classes });
    } catch (error) {
        console.error("Error in getAllClasses:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};