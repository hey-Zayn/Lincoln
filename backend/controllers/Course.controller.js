const Course = require('../models/Course.Model');
const cloudinary = require("../config/Database/cloudinary/cloudinary");
const Material = require('../models/Material.Model');
const Assignment = require('../models/Assignment.Model');
const Submission = require('../models/Submission.Model');
const Quiz = require('../models/Quiz.Model');
const Lecture = require('../models/Lecture.Model');
const CourseProgress = require('../models/courseProgress.Model');
const User = require('../models/User.Model');
const Comment = require('../models/Comment.Model');
const Note = require('../models/Note.Model');

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
            quizProgress: progress.quizProgress || [],
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
            quizProgress: progress.quizProgress || [],
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
    try {
        const courseId = req.params.id;
        const { title, type, lectureId, sectionId } = req.body;

        let fileUrl = "";
        let publicId = "";

        if (req.file) {
            // If using memory storage with multer
            const DataUriParser = require('datauri/parser');
            const path = require('path');
            const parser = new DataUriParser();
            const extName = path.extname(req.file.originalname).toString();
            const file = parser.format(extName, req.file.buffer);

            const uploadResponse = await cloudinary.uploader.upload(file.content, {
                folder: "courses/materials",
                resource_type: "auto"
            });
            fileUrl = uploadResponse.secure_url;
            publicId = uploadResponse.public_id;
        } else if (req.body.url) {
            fileUrl = req.body.url;
        }

        if (!fileUrl) {
            return res.status(400).json({ success: false, message: "No file or URL provided" });
        }

        const material = await Material.create({
            title,
            type: type || "document",
            url: fileUrl,
            course: courseId,
            lecture: lectureId || null,
            sectionId: sectionId || null
        });

        // Add to course
        await Course.findByIdAndUpdate(courseId, {
            $push: { materials: material._id }
        });

        // Add to lecture if provided
        if (lectureId) {
            await Lecture.findByIdAndUpdate(lectureId, {
                $push: { materials: material._id }
            });
        }

        res.status(201).json({
            success: true,
            message: "Material uploaded successfully",
            material
        });
    } catch (err) {
        console.error("Upload Material Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error uploadMaterial" });
    }
};

exports.getMaterialsByCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const materials = await Material.find({ course: courseId }).populate('lecture', 'title');
        res.status(200).json({
            success: true,
            materials
        });
    } catch (err) {
        console.error("Get Materials Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error getMaterials" });
    }
};

exports.deleteMaterial = async (req, res) => {
    try {
        const { materialId } = req.params;
        const material = await Material.findById(materialId);
        if (!material) return res.status(404).json({ success: false, message: "Material not found" });

        // Remove from course
        await Course.findByIdAndUpdate(material.course, {
            $pull: { materials: materialId }
        });

        // Remove from lecture if linked
        if (material.lecture) {
            await Lecture.findByIdAndUpdate(material.lecture, {
                $pull: { materials: materialId }
            });
        }

        await Material.findByIdAndDelete(materialId);

        res.status(200).json({
            success: true,
            message: "Material deleted successfully"
        });
    } catch (err) {
        console.error("Delete Material Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error deleteMaterial" });
    }
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
    try {
        const courseId = req.params.id;
        const { title, questions, sectionId, passingScore } = req.body;

        if (!title || !questions || !questions.length) {
            return res.status(400).json({ success: false, message: "Title and questions are required" });
        }

        const quiz = await Quiz.create({
            title,
            course: courseId,
            questions,
            sectionId: sectionId || null,
            passingScore: passingScore || 70
        });

        // Link to course section if provided
        if (sectionId) {
            const course = await Course.findOne({ "sections._id": sectionId });
            if (course) {
                const section = course.sections.id(sectionId);
                if (section) {
                    section.quiz = quiz._id;
                    await course.save();
                }
            }
        }

        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            quiz
        });
    } catch (err) {
        console.error("Create Quiz Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error createQuiz" });
    }
};

exports.getQuizzesByCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const quizzes = await Quiz.find({ course: courseId });
        res.status(200).json({
            success: true,
            quizzes
        });
    } catch (err) {
        console.error("Get Quizzes Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error getQuizzes" });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const { id: quizId } = req.params;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

        await Quiz.findByIdAndDelete(quizId);

        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully"
        });
    } catch (err) {
        console.error("Delete Quiz Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error deleteQuiz" });
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
        res.status(200).json({
            success: true,
            quiz
        });
    } catch (err) {
        console.error("Get Quiz By ID Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error getQuizById" });
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const { answers } = req.body;
        const userId = req.user._id;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

        const courseId = quiz.course;
        let score = 0;
        const total = quiz.questions.length;

        quiz.questions.forEach((q, index) => {
            if (answers[index] === q.correctIndex) {
                score++;
            }
        });

        const percentage = Math.round((score / total) * 100);
        const passed = percentage >= (quiz.passingScore || 70);

        // Update Progress
        let progress = await CourseProgress.findOne({ userId, courseId });
        if (!progress) {
            progress = await CourseProgress.create({ userId, courseId, quizProgress: [] });
        }

        const quizIdx = progress.quizProgress.findIndex(qp => qp.quizId.toString() === quizId);
        if (quizIdx !== -1) {
            progress.quizProgress[quizIdx].attempts += 1;
            if (passed) progress.quizProgress[quizIdx].passed = true;
            if (percentage > progress.quizProgress[quizIdx].score) {
                progress.quizProgress[quizIdx].score = percentage;
            }
        } else {
            progress.quizProgress.push({
                quizId,
                passed,
                score: percentage,
                attempts: 1
            });
        }

        await progress.save();

        res.status(200).json({
            success: true,
            message: passed ? "Congratulations! You passed the quiz." : "You did not pass. Please try again.",
            score,
            total,
            percentage,
            passed
        });
    } catch (err) {
        console.error("Submit Quiz Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error submitQuiz" });
    }
};

// --- Discussion (Comment) Controllers ---
exports.addComment = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { content, parentCommentId } = req.body;
        const userId = req.user._id;

        if (!content) {
            return res.status(400).json({ success: false, message: "Comment content is required" });
        }

        const comment = await Comment.create({
            content,
            author: userId,
            course: courseId,
            lecture: lectureId,
            parentComment: parentCommentId || null
        });

        if (parentCommentId) {
            await Comment.findByIdAndUpdate(parentCommentId, {
                $push: { replies: comment._id }
            });
        }

        const populatedComment = await Comment.findById(comment._id).populate('author', 'firstName lastName profilePicture');

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: populatedComment
        });
    } catch (err) {
        console.error("Add Comment Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error addComment" });
    }
};

exports.getCommentsByLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;

        // Only fetch top-level comments initially, and populate nested replies
        const comments = await Comment.find({ lecture: lectureId, parentComment: null })
            .populate('author', 'firstName lastName profilePicture')
            .populate({
                path: 'replies',
                populate: {
                    path: 'author',
                    select: 'firstName lastName profilePicture'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            comments
        });
    } catch (err) {
        console.error("Get Comments Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error getCommentsByLecture" });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to edit this comment" });
        }

        comment.content = content;
        comment.isEdited = true;
        await comment.save();

        const populatedComment = await Comment.findById(comment._id).populate('author', 'firstName lastName profilePicture');

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment: populatedComment
        });
    } catch (err) {
        console.error("Update Comment Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error updateComment" });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this comment" });
        }

        // If it's a child comment, remove reference from parent
        if (comment.parentComment) {
            await Comment.findByIdAndUpdate(comment.parentComment, {
                $pull: { replies: comment._id }
            });
        }

        // Delete all replies if it's a parent comment
        if (comment.replies && comment.replies.length > 0) {
            await Comment.deleteMany({ _id: { $in: comment.replies } });
        }

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    } catch (err) {
        console.error("Delete Comment Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error deleteComment" });
    }
};

exports.toggleLikeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

        const isLiked = comment.likes.includes(userId);

        if (isLiked) {
            comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
        } else {
            comment.likes.push(userId);
        }

        await comment.save();

        res.status(200).json({
            success: true,
            message: isLiked ? "Unliked" : "Liked",
            likes: comment.likes,
            isLiked: !isLiked
        });
    } catch (err) {
        console.error("Toggle Like Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error toggleLikeComment" });
    }
};

exports.getUserNote = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.user._id;

        const note = await Note.findOne({ userId, courseId, lectureId });

        res.status(200).json({
            success: true,
            note: note || { content: "" }
        });
    } catch (err) {
        console.error("Get User Note Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error getUserNote" });
    }
};

exports.upsertUserNote = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        const note = await Note.findOneAndUpdate(
            { userId, courseId, lectureId },
            { content },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Note saved successfully",
            note
        });
    } catch (err) {
        console.error("Upsert User Note Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error upsertUserNote" });
    }
};

exports.getStudentDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Courses Enrolled
        const enrolledCoursesCount = req.user.enrolledcourses.length;

        // 2. Average Progress
        let totalProgress = 0;
        if (req.user.courseProgress && req.user.courseProgress.length > 0) {
            const sum = req.user.courseProgress.reduce((acc, curr) => acc + (curr.progress || 0), 0);
            totalProgress = Math.round(sum / req.user.courseProgress.length);
        }

        // 3. Upcoming Deadlines (Quizzes for enrolled courses)
        // We fetch quizzes associated with the courses a student is enrolled in
        const quizzes = await Quiz.find({ course: { $in: req.user.enrolledcourses } })
            .select('title course questions passingScore createdAt')
            .populate('course', 'title')
            .limit(10);

        // 4. Activity Data (Mock for aesthetic/functional chart demonstration)
        // In a real app, this would come from an ActivityLog model
        const activityData = [
            { day: 'Mon', mins: 45 },
            { day: 'Tue', mins: 52 },
            { day: 'Wed', mins: 38 },
            { day: 'Thu', mins: 65 },
            { day: 'Fri', mins: 48 },
            { day: 'Sat', mins: 20 },
            { day: 'Sun', mins: 15 },
        ];

        res.status(200).json({
            success: true,
            stats: [
                { label: 'Courses Enrolled', value: enrolledCoursesCount.toString(), change: 'Recently Updated', icon: 'BookOpen', color: 'text-blue-500' },
                { label: 'Average Progress', value: `${totalProgress}%`, change: 'On Track', icon: 'TrendingUp', color: 'text-emerald-500' },
                { label: 'Total Quizzes', value: quizzes.length.toString(), change: 'Pending Review', icon: 'HelpCircle', color: 'text-orange-500' },
                { label: 'Study Hours', value: '24h', change: 'This Week', icon: 'Clock', color: 'text-purple-500' },
            ],
            activityData,
            upcomingQuizzes: quizzes.slice(0, 4).map(q => ({
                title: q.title,
                course: q.course?.title,
                due: "Pending Attempt", // Mock due date since Quizzes don't have deadlines yet
                type: "quiz"
            }))
        });
    } catch (err) {
        console.error("Get Student Stats Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error getStudentDashboardStats" });
    }
};

exports.getTeacherDashboardStats = async (req, res) => {
    try {
        const teacherId = req.user._id;

        // 1. Fetch all courses by this teacher
        const courses = await Course.find({ teacher: teacherId });

        const totalCourses = courses.length;

        // 2. Calculate unique students
        const studentIds = new Set();
        let totalRevenue = 0;

        courses.forEach(course => {
            course.studentsEnrolled.forEach(id => studentIds.add(id.toString()));
            totalRevenue += (course.price || 0) * course.studentsEnrolled.length;
        });

        const totalStudents = studentIds.size;

        // 3. Prepare Chart Data (Enrollment Distribution)
        const courseDistribution = courses.map(course => ({
            name: course.title.length > 20 ? course.title.substring(0, 17) + "..." : course.title,
            students: course.studentsEnrolled.length,
            revenue: (course.price || 0) * course.studentsEnrolled.length
        })).sort((a, b) => b.students - a.students).slice(0, 5);

        // 4. Enrollment Trend (Mocking 7 days for visual consistency)
        const enrollmentTrend = [
            { day: 'Mon', students: Math.floor(Math.random() * 20) + 10 },
            { day: 'Tue', students: Math.floor(Math.random() * 20) + 15 },
            { day: 'Wed', students: Math.floor(Math.random() * 20) + 20 },
            { day: 'Thu', students: Math.floor(Math.random() * 20) + 25 },
            { day: 'Fri', students: Math.floor(Math.random() * 20) + 30 },
            { day: 'Sat', students: Math.floor(Math.random() * 20) + 10 },
            { day: 'Sun', students: Math.floor(Math.random() * 20) + 8 },
        ];

        res.status(200).json({
            success: true,
            stats: [
                { label: "Active Cohort", value: totalStudents.toLocaleString(), icon: "Users", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-500/10" },
                { label: "Operative Assets", value: totalCourses.toString(), icon: "BookOpen", color: "text-red-600", bg: "bg-red-100 dark:bg-red-500/10" },
                { label: "Revenue Stream", value: `₹${totalRevenue.toLocaleString()}`, icon: "TrendingUp", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-500/10" }
            ],
            courseDistribution,
            enrollmentTrend
        });

    } catch (err) {
        console.error("Get Teacher Stats Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error getTeacherDashboardStats" });
    }
};
