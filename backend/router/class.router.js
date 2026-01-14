const express = require('express');
const {
    createClass,
    assignTeacher,
    addStudents,
    getClassDetails,
    getAllClasses
} = require('../controllers/Class.controller');
const { protectedRoute, isManagement, isAdmin } = require('../middlewares/Auth.Middleware');

const router = express.Router();

router.post('/create', protectedRoute, isManagement, isAdmin, createClass);
router.put('/assign-teacher', protectedRoute, isManagement, assignTeacher);
router.put('/add-students', protectedRoute, isManagement, addStudents);
router.get('/all', protectedRoute, isManagement, isAdmin, getAllClasses);
router.get('/:id', protectedRoute, getClassDetails);

module.exports = router;