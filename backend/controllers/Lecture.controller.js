const Course = require('../models/Course.Model');
const Lecture = require('../models/Lecture.Model');
const CourseProgress = require('../models/courseProgress.Model');
const cloudinary = require('../config/Database/cloudinary/cloudinary');
const DataUriParser = require('datauri/parser');
const path = require('path');

const getDataUri = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
};



// --- Lecture Controllers ---
exports.uploadVideo = async (req, res) => {
    try {
        let videoFile = req.files && req.files.length > 0 ? req.files[0] : null;

        if (!videoFile) {
            return res.status(400).json({
                success: false,
                message: "No video file provided"
            });
        }

        const file = getDataUri(videoFile);
        const myCloud = await cloudinary.uploader.upload(file.content, {
            resource_type: "video",
            folder: "lectures",
        });

        res.status(200).json({
            success: true,
            message: "Video uploaded successfully",
            videoUrl: myCloud.secure_url,
            publicId: myCloud.public_id
        });
    } catch (err) {
        console.error("Upload Video Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error during video upload"
        });
    }
};

exports.createLecture = async (req, res) => {
    try {
        const { title, description, isPreviewFree, sectionId } = req.body;
        let courseId = req.params.courseId || req.body.courseId;

        if (!courseId && sectionId) {
            const courseFound = await Course.findOne({ "sections._id": sectionId });
            if (courseFound) courseId = courseFound._id;
        }

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID or Section ID is required"
            });
        }

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

        let videoUrl = req.body.videoUrl || "";
        let publicId = req.body.publicId || "";

        let videoFile = req.files && req.files.length > 0 ? req.files[0] : null;

        if (videoFile) {
            const file = getDataUri(videoFile);
            const myCloud = await cloudinary.uploader.upload(file.content, {
                resource_type: "video",
                folder: "lectures",
            });
            videoUrl = myCloud.secure_url;
            publicId = myCloud.public_id;
        }

        const lecture = await Lecture.create({
            title,
            description,
            videoUrl,
            publicId,
            isPreviewFree
        });

        if (sectionId) {
            const section = course.sections.id(sectionId);
            if (section) {
                section.lectures.push(lecture._id);
            } else {
                // If sectionId is provided but not found, maybe push to general lectures
                course.lectures.push(lecture._id);
            }
        } else {
            // Backward compatibility
            course.lectures.push(lecture._id);
        }

        await course.save();

        res.status(201).json({
            success: true,
            message: "Lecture created and added successfully",
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

exports.updateLecture = async (req, res) => {
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

        let vUrl = req.body.videoUrl || lecture.videoUrl;
        let pId = req.body.publicId || lecture.publicId;

        let videoFile = req.files && req.files.length > 0 ? req.files[0] : null;

        if (videoFile) {
            // Delete old video if it exists
            if (lecture.publicId) {
                await cloudinary.uploader.destroy(lecture.publicId, { resource_type: "video" });
            }
            const file = getDataUri(videoFile);
            const myCloud = await cloudinary.uploader.upload(file.content, {
                resource_type: "video",
                folder: "lectures",
            });
            vUrl = myCloud.secure_url;
            pId = myCloud.public_id;
        }

        const updatedLecture = await Lecture.findByIdAndUpdate(
            lectureId,
            { title, description, videoUrl: vUrl, publicId: pId, isPreviewFree },
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

exports.deleteLecture = async (req, res) => {
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
            {},
            {
                $pull: {
                    lectures: lectureId,
                    "sections.$[].lectures": lectureId
                }
            }
        );

        // Delete video from Cloudinary
        if (lecture.publicId) {
            await cloudinary.uploader.destroy(lecture.publicId, { resource_type: "video" });
        }

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
