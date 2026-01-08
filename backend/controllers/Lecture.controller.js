const Course = require('../models/Course.Model');
const Material = require('../models/Material.Model');
const Assignment = require('../models/Assignment.Model');
const Submission = require('../models/Submission.Model');
const Quiz = require('../models/Quiz.Model');
const Lecture = require('../models/Lecture.Model');
const CourseProgress = require('../models/courseProgress.Model');



// --- Lecture Controllers ---
exports.createLecture = async (req, res) => {
    try {
        const { title, description, videoUrl, publicId, isPreviewFree } = req.body;
        const { courseId } = req.params;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Lecture title is required"
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check ownership
        if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Not authorized to add lectures to this course"
            });
        }

        const lecture = await Lecture.create({
            title,
            description,
            videoUrl,
            publicId,
            isPreviewFree
        });

        course.lectures.push(lecture._id);
        await course.save();

        res.status(201).json({
            success: true,
            message: "Lecture created and added to course successfully",
            lecture
        });
    } catch (err) {
        console.log("Create Lecture Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error Lecture Controller"
        });
    }
};

exports.getCourseLectures = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate('lectures');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            lectures: course.lectures
        });
    } catch (err) {
        console.log("Get Course Lectures Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error Lecture Controller"
        });
    }
};

exports.getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found"
            });
        }

        res.status(200).json({
            success: true,
            lecture
        });
    } catch (err) {
        console.log("Get Lecture By Id Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error Lecture Controller"
        });
    }
};

exports.editLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const { title, description, videoUrl, publicId, isPreviewFree } = req.body;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found"
            });
        }

        // Find the course this lecture belongs to to check ownership
        const course = await Course.findOne({ lectures: lectureId });
        if (course && course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Not authorized to edit this lecture"
            });
        }

        const updatedLecture = await Lecture.findByIdAndUpdate(
            lectureId,
            { title, description, videoUrl, publicId, isPreviewFree },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Lecture updated successfully",
            updatedLecture
        });
    } catch (err) {
        console.log("Edit Lecture Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error Lecture Controller"
        });
    }
};

exports.removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found"
            });
        }

        // Find the course this lecture belongs to to check ownership
        const course = await Course.findOne({ lectures: lectureId });
        if (course && course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Not authorized to remove this lecture"
            });
        }

        // Remove from any course that references it
        await Course.updateMany(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } }
        );

        await Lecture.findByIdAndDelete(lectureId);

        res.status(200).json({
            success: true,
            message: "Lecture removed successfully"
        });
    } catch (err) {
        console.log("Remove Lecture Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error Lecture Controller"
        });
    }
};
