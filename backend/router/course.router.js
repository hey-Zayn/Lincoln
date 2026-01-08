const express = require('express');
const router = express.Router();
const protectedRoute = require('../middlewares/Auth.Middleware');
const courseController = require('../controllers/Course.controller');
const lectureController = require('../controllers/Lecture.controller');

// All LMS routes are protected
router.use(protectedRoute);

// --- Course Routes ---
router.post('/create', protectedRoute, courseController.createCourse);
router.get('/all', protectedRoute, courseController.getAllCourses);
router.get('/users-all-courses', protectedRoute, courseController.getAllCoursesByUser);
router.get('/:id', protectedRoute, courseController.getCourseById);
router.put('/update/:id', protectedRoute, courseController.updateCourse);
router.delete('/delete/:id', protectedRoute, courseController.deleteCourse);
router.post('/enroll/:id', protectedRoute, courseController.enrollStudent);

// --- Lecture Routes ---
router.post('/:courseId/lecture/create', protectedRoute, lectureController.createLecture);
router.get('/:courseId/lecture/all', protectedRoute, lectureController.getCourseLectures);
router.get('/lecture/:lectureId', protectedRoute, lectureController.getLectureById);
router.put('/lecture/update/:lectureId', protectedRoute, lectureController.editLecture);
router.delete('/lecture/delete/:lectureId', protectedRoute, lectureController.removeLecture);

// --- Progress Routes ---
router.get('/:courseId/progress', protectedRoute, courseController.getCourseProgress);
router.post('/:courseId/progress/update/:lectureId', protectedRoute, courseController.updateLectureProgress);

// --- Material Routes ---
router.post('/:id/materials', courseController.uploadMaterial);
router.get('/:id/materials', courseController.getMaterialsByCourse);

// --- Assignment Routes ---
router.post('/:id/assignments', courseController.createAssignment);
router.get('/:id/assignments', courseController.getAssignmentsByCourse);
router.get('/assignments/:id', courseController.getAssignmentById);

// --- Submission Routes ---
router.post('/assignments/:id/submissions', courseController.submitAssignment);
router.get('/assignments/:id/submissions', courseController.getSubmissionsByAssignment);
router.put('/submissions/:id/grade', courseController.gradeSubmission);

// --- Quiz Routes ---
router.post('/:id/quizzes', courseController.createQuiz);
router.get('/:id/quizzes', courseController.getQuizzesByCourse);
router.get('/quizzes/:id', courseController.getQuizById);
router.post('/quizzes/:id/submit', courseController.submitQuiz);

module.exports = router;
