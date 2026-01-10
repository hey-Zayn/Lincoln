const express = require('express');
const router = express.Router();
const courseController = require('../controllers/Course.controller');
const protectedRoute = require('../middlewares/Auth.Middleware');

// --- Section Routes ---
router.get('/course/:id', protectedRoute, courseController.getSections);
router.post('/', protectedRoute, courseController.addSection);
router.put('/:sectionId', protectedRoute, courseController.updateSection);
router.delete('/:sectionId', protectedRoute, courseController.deleteSection);

module.exports = router;