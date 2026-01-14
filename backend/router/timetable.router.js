const express = require('express');
const {
    addTimetableEntry,
    getTimetableByClass,
    updateTimetableEntry,
    deleteTimetableEntry
} = require('../controllers/Timetable.controller');
const { protectedRoute, isManagement } = require('../middlewares/Auth.Middleware');

const router = express.Router();

router.post('/create', protectedRoute, isManagement, addTimetableEntry);
router.get('/class/:classId', protectedRoute, getTimetableByClass);
router.put('/:id', protectedRoute, isManagement, updateTimetableEntry);
router.delete('/:id', protectedRoute, isManagement, deleteTimetableEntry);

module.exports = router;
