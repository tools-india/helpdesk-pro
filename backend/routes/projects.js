const express = require('express');
const router = express.Router();
const {
    createProject,
    getProjects,
    getProjectsPublic,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/public', getProjectsPublic);

// Protected routes
router.post('/', protect, authorize('admin'), createProject);
router.get('/', getProjects);
router.put('/:id', protect, authorize('admin'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

module.exports = router;
