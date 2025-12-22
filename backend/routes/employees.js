const express = require('express');
const router = express.Router();
const {
    createEmployee,
    getEmployees,
    getEmployee,
    getEmployeeByEmpId,
    updateEmployee,
    deleteEmployee,
    bulkImportEmployees
} = require('../controllers/employeeController');
const { employeeLogin, employeeSignup } = require('../controllers/employeeAuthController');
const { protect, authorize } = require('../middleware/auth');

// Public routes - Employee Authentication
router.post('/login', employeeLogin);
router.post('/signup', employeeSignup);
router.get('/by-emp-id/:employeeId', getEmployeeByEmpId);

// Protected routes
router.post('/', protect, authorize('admin'), createEmployee);
router.post('/bulk-import', protect, authorize('admin'), bulkImportEmployees);
router.get('/', protect, authorize('admin'), getEmployees);
router.get('/:id', protect, authorize('admin'), getEmployee);
router.put('/:id', protect, authorize('admin'), updateEmployee);
router.put('/profile/:_id', updateEmployee); // Allow updates (temporarily public for MVP)

module.exports = router;
