const Course = require('../models/Course.Model');
const cloudinary = require("../config/Database/cloudinary/cloudinary");
const Material = require('../models/Material.Model');
const Assignment = require('../models/Assignment.Model');
const Submission = require('../models/Submission.Model');
const Quiz = require('../models/Quiz.Model');
const Lecture = require('../models/Lecture.Model');
const CourseProgress = require('../models/courseProgress.Model');
const User = require('../models/User.Model');

// --- Course Controllers ---
exports.createCourse = async (req, res) => {
    try {
        // console.log("Create Course Request Headers:", req.headers);
        // console.log("Create Course Request Body:", req.body);

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing or could not be parsed. If sending as multipart/form-data, ensure text fields are correctly specified."
            });
        }

        let {
            title,
            CourseLanguage,
            description,
            category,
            courseLevel,
            price,
            thumbnail,
            previewVideo,
            learningOutcomes,
            requirements,
            isPublished
        } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, description, and category are required."
            });
        }

        // Check if user is teacher or admin
        if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Only teachers and admins can create courses."
            });
        }

        if (thumbnail && thumbnail.startsWith("data:image")) {
            const uploadResponse = await cloudinary.uploader.upload(thumbnail, {
                folder: "courses/thumbnails"
            });
            thumbnail = uploadResponse.secure_url;
        }

        if (previewVideo && previewVideo.startsWith("data:video")) {
            const uploadResponse = await cloudinary.uploader.upload(previewVideo, {
                folder: "courses/previews",
                resource_type: "video"
            });
            previewVideo = uploadResponse.secure_url;
        }

        const course = await Course.create({
            title,
            CourseLanguage,
            description,
            category,
            courseLevel,
            price,
            thumbnail,
            previewVideo,
            learningOutcomes,
            requirements,
            isPublished,
            teacher: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course
        });
    } catch (err) {
        console.log("Create Course Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error Course Controller"
        });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('teacher', 'firstName lastName email profilePicture');
        res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses
        });
    } catch (err) {
        console.log("Get All Courses Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error Course Controller"
        });
    }
};


exports.getAllCoursesByUser = async (req, res) => {
    try {
        const courses = await Course.find({ teacher: req.user._id });
        res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses
        });
    } catch (err) {
        console.log("Get All Courses By User Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error Course Controller"
        });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('lectures')
            .populate({
                path: 'sections.lectures',
                model: 'Lecture'
            })
            .populate('teacher', 'firstName lastName email profilePicture');
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            course
        });
    } catch (err) {
        console.log("Get Course By ID Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error Course Controller"
        });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        let {
            title,
            CourseLanguage,
            description,
            category,
            courseLevel,
            price,
            thumbnail,
            previewVideo,
            learningOutcomes,
            requirements
        } = req.body;
        const courseId = req.params.id;

        let course = await Course.findById(courseId);
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
                message: "Not authorized to update this course"
            });
        }

        // Handle Thumbnail Upload
        if (thumbnail && thumbnail.startsWith("data:image")) {
            const uploadResponse = await cloudinary.uploader.upload(thumbnail, {
                folder: "courses/thumbnails"
            });
            req.body.thumbnail = uploadResponse.secure_url;
        }

        // Handle Preview Video Upload
        if (previewVideo && previewVideo.startsWith("data:video")) {
            const uploadResponse = await cloudinary.uploader.upload(previewVideo, {
                folder: "courses/previews",
                resource_type: "video"
            });
            req.body.previewVideo = uploadResponse.secure_url;
        }

        course = await Course.findByIdAndUpdate(courseId, req.body, { new: true });

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course
        });
    } catch (err) {
        console.log("Update Course Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error Course Controller"
        });
    }
};

exports.togglePublish = async (req, res) => {
    try {
        const { id } = req.params;
        const { isPublished } = req.body;

        const course = await Course.findById(id);
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
                message: "Not authorized to publish this course"
            });
        }

        course.isPublished = isPublished;
        await course.save();

        res.status(200).json({
            success: true,
            message: isPublished ? "Course published successfully" : "Course unpublished successfully",
            isPublished: course.isPublished
        });
    } catch (err) {
        console.log("Toggle Publish Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error togglePublish"
        });
    }
};
exports.getSections = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId).populate({
            path: 'sections.lectures',
            model: 'Lecture'
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            sections: course.sections
        });
    } catch (err) {
        console.error("Get Sections Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error getSections"
        });
    }
};
exports.addSection = async (req, res) => {
    try {
        const courseId = req.params.id || req.body.courseId;
        const { sectionTitle, title } = req.body;
        const finalTitle = sectionTitle || title;

        if (!finalTitle) {
            return res.status(400).json({ success: false, message: "Section title is required" });
        }

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        // Check ownership
        if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        course.sections.push({ sectionTitle: finalTitle, lectures: [] });
        await course.save();

        res.status(201).json({
            success: true,
            message: "Section added successfully",
            sections: course.sections
        });
    } catch (err) {
        console.error("Add Section Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error addSection" });
    }
};

exports.updateSection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const { sectionTitle, title } = req.body;
        const finalTitle = sectionTitle || title;

        const course = await Course.findOne({ "sections._id": sectionId });
        if (!course) return res.status(404).json({ success: false, message: "Section not found or course context missing" });

        // Check ownership
        if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const section = course.sections.id(sectionId);
        if (!section) return res.status(404).json({ success: false, message: "Section not found" });

        section.sectionTitle = finalTitle || section.sectionTitle;
        await course.save();

        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            sections: course.sections
        });
    } catch (err) {
        console.error("Update Section Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error updateSection" });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.params;

        const course = await Course.findOne({ "sections._id": sectionId });
        if (!course) return res.status(404).json({ success: false, message: "Section not found or course context missing" });

        // Check ownership
        if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        course.sections.pull({ _id: sectionId });
        await course.save();

        res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            sections: course.sections
        });
    } catch (err) {
        console.error("Delete Section Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error deleteSection" });
    }
};
exports.deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
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
                message: "Not authorized to delete this course"
            });
        }

        await Course.findByIdAndDelete(courseId);

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (err) {
        console.log("Delete Course Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error Course Controller"
        });
    }
};

exports.enrollStudent = async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user._id;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check if already enrolled
        if (course.studentsEnrolled.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You are already enrolled in this course"
            });
        }

        // Enroll student
        course.studentsEnrolled.push(userId);
        await course.save();

        // Update User's enrolled courses and initialize courseProgress summary
        await User.findByIdAndUpdate(userId, {
            $addToSet: {
                enrolledcourses: courseId,
                courseProgress: { courseId, progress: 0 }
            }
        });

        // Initialize Course Progress document
        const existingProgress = await CourseProgress.findOne({ userId, courseId });
        if (!existingProgress) {
            await CourseProgress.create({
                userId,
                courseId,
                completed: false,
                lectureProgress: []
            });
        }

        res.status(200).json({
            success: true,
            message: "Enrolled in course successfully"
        });
    } catch (err) {
        console.log("Enroll Student Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error Course Controller"
        });
    }
};

// --- Progress Controllers ---
exports.getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const progress = await CourseProgress.findOne({ userId, courseId });
        const course = await Course.findById(courseId).populate('sections.lectures lectures');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        if (!progress) {
            return res.status(200).json({
                success: true,
                progress: 0,
                completedLectures: [],
                completed: false
            });
        }

        // Calculate total lectures
        const allLectureIds = new Set();
        course.lectures.forEach(l => allLectureIds.add(l._id.toString()));
        course.sections.forEach(s => {
            s.lectures.forEach(l => allLectureIds.add(l._id.toString()));
        });
        const totalLectures = allLectureIds.size;

        const viewedLectures = progress.lectureProgress.filter(lp => lp.viewed).length;
        const percentage = totalLectures > 0 ? Math.round((viewedLectures / totalLectures) * 100) : 0;

        res.status(200).json({
            success: true,
            progress: percentage,
            completedLectures: progress.lectureProgress.filter(lp => lp.viewed).map(lp => lp.lectureId),
            completed: progress.completed
        });
    } catch (err) {
        console.error("Get Course Progress Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error Course Progress"
        });
    }
};

exports.updateLectureProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.user._id;

        let progress = await CourseProgress.findOne({ userId, courseId });
        if (!progress) {
            progress = await CourseProgress.create({
                userId,
                courseId,
                lectureProgress: []
            });
        }

        // Find lecture in progress
        const lectureIndex = progress.lectureProgress.findIndex(
            (lp) => lp.lectureId.toString() === lectureId
        );

        if (lectureIndex !== -1) {
            progress.lectureProgress[lectureIndex].viewed = true;
        } else {
            progress.lectureProgress.push({ lectureId, viewed: true });
        }

        // Recalculate percentage
        const course = await Course.findById(courseId).populate('sections.lectures lectures');
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        const allLectureIds = new Set();
        course.lectures.forEach(l => allLectureIds.add(l._id.toString()));
        course.sections.forEach(s => {
            s.lectures.forEach(l => allLectureIds.add(l._id.toString()));
        });
        const totalLectures = allLectureIds.size;

        const viewedLectures = progress.lectureProgress.filter(lp => lp.viewed).length;
        const percentage = totalLectures > 0 ? Math.round((viewedLectures / totalLectures) * 100) : 0;

        progress.completed = percentage === 100;
        await progress.save();

        // Update User model summary
        await User.updateOne(
            { _id: userId, "courseProgress.courseId": courseId },
            { $set: { "courseProgress.$.progress": percentage } }
        );

        // Ensure it exists in user model (for cases where enrollment didn't init it)
        const user = await User.findById(userId);
        const hasSummary = user.courseProgress.some(cp => cp.courseId.toString() === courseId);
        if (!hasSummary) {
            await User.updateOne(
                { _id: userId },
                { $push: { courseProgress: { courseId, progress: percentage } } }
            );
        }

        res.status(200).json({
            success: true,
            message: "Lecture progress updated",
            progress: percentage,
            completedLectures: progress.lectureProgress.filter(lp => lp.viewed).map(lp => lp.lectureId),
            completed: progress.completed
        });
    } catch (err) {
        console.error("Update Lecture Progress Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error Update Progress"
        });
    }
};

// --- Material Controllers ---
exports.uploadMaterial = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};

exports.getMaterialsByCourse = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};

// --- Assignment Controllers ---
exports.createAssignment = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};

exports.getAssignmentsByCourse = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};

exports.getAssignmentById = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};

// --- Submission Controllers ---
exports.submitAssignment = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};

exports.getSubmissionsByAssignment = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};

exports.gradeSubmission = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};

// --- Quiz Controllers ---
exports.createQuiz = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};

exports.getQuizzesByCourse = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};

exports.getQuizById = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};

exports.submitQuiz = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};
