const Timetable = require("../models/Timetable.model");

exports.addTimetableEntry = async (req, res) => {
    try {
        const { classId, day, startTime, endTime, subject, teacherId } = req.body;
        if (!classId || !day || !startTime || !endTime || !subject) {
            return res.status(400).json({ message: "All fields except teacher are required", success: false });
        }

        const entry = new Timetable({
            class: classId,
            day,
            startTime,
            endTime,
            subject,
            teacher: teacherId
        });

        await entry.save();
        res.status(201).json({ message: "Timetable entry added", success: true, entry });
    } catch (error) {
        console.error("Error in addTimetableEntry:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

exports.getTimetableByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const timetable = await Timetable.find({ class: classId }).populate("teacher", "firstName lastName");
        res.status(200).json({ success: true, timetable });
    } catch (error) {
        console.error("Error in getTimetableByClass:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

exports.updateTimetableEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const entry = await Timetable.findByIdAndUpdate(id, updateData, { new: true });
        if (!entry) {
            return res.status(404).json({ message: "Entry not found", success: false });
        }
        res.status(200).json({ message: "Timetable entry updated", success: true, entry });
    } catch (error) {
        console.error("Error in updateTimetableEntry:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

exports.deleteTimetableEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await Timetable.findByIdAndDelete(id);
        if (!entry) {
            return res.status(404).json({ message: "Entry not found", success: false });
        }
        res.status(200).json({ message: "Timetable entry deleted", success: true });
    } catch (error) {
        console.error("Error in deleteTimetableEntry:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
