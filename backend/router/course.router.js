const express = require('express');
const router = express.Router();
const protectedRoute = require('../middlewares/Auth.Middleware');
const courseController = require('../controllers/Course.controller');
const lectureController = require('../controllers/Lecture.controller');

const upload = require('../middlewares/multer');

// All LMS routes are protected
router.use(protectedRoute);

// --- Course Routes ---
router.post('/create', upload.none(), courseController.createCourse);
router.get('/all', courseController.getAllCourses);
router.get('/users-all-courses', courseController.getAllCoursesByUser);
router.get('/:id', courseController.getCourseById);
router.put('/update/:id', upload.none(), courseController.updateCourse);
router.put('/publish/:id', courseController.togglePublish);
router.delete('/delete/:id', courseController.deleteCourse);
router.post('/enroll/:id', courseController.enrollStudent);



// --- Lecture Routes ---


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
