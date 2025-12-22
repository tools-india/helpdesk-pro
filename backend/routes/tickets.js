const express = require('express');
const router = express.Router();
const {
    createTicket,
    getTicketsByEmployeeId,
    getTicketByTicketId,
    getTickets,
    updateTicket,
    getTicketStatistics,
    updateTicketByEmployee
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes (for employee portal)
router.post('/', upload.array('attachments', 5), createTicket);
router.get('/employee/:employeeId', getTicketsByEmployeeId);
router.get('/by-ticket-id/:ticketId', getTicketByTicketId);
router.put('/employee-update/:ticketId', updateTicketByEmployee);

// Protected routes (for admins)
router.get('/', protect, authorize('admin'), getTickets);
router.get('/stats', protect, authorize('admin'), getTicketStatistics);
router.put('/:id', protect, authorize('admin'), upload.array('attachments', 3), updateTicket);

module.exports = router;
