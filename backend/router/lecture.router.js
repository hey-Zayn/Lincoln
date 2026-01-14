const express = require('express');
const router = express.Router();
const { protectedRoute } = require('../middlewares/Auth.Middleware');
const lectureController = require('../controllers/Lecture.controller');
const upload = require('../middlewares/multer');
const courseController = require('../controllers/Course.controller');




router.post('/upload', protectedRoute, upload.any(), lectureController.uploadVideo);
router.post('/', protectedRoute, upload.any(), lectureController.createLecture);
router.get('/course/:courseId', protectedRoute, lectureController.getCourseLectures);
router.get('/:lectureId', protectedRoute, lectureController.getLectureById);
router.put('/:lectureId', protectedRoute, lectureController.updateLecture);
router.delete('/:lectureId', protectedRoute, lectureController.deleteLecture);


module.exports = router;