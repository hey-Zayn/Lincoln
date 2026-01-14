const express = require('express');
const { createDepartment, getAllDepartments } = require('../controllers/Department.controller');
const { protectedRoute, isManagement } = require('../middlewares/Auth.Middleware');

const router = express.Router();

router.post('/create', protectedRoute, isManagement, createDepartment);
router.get('/all', protectedRoute, getAllDepartments);

module.exports = router;
