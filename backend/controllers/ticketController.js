const Ticket = require('../models/Ticket');
const Employee = require('../models/Employee');

const Project = require('../models/Project');
const { generateTicketId, calculateTicketStats } = require('../utils/helpers');
const { sendTicketUpdateEmail } = require('../utils/emailService');

// @desc    Create ticket (from employee portal)
// @route   POST /api/tickets
// @access  Public
exports.createTicket = async (req, res) => {
    try {
        const {
            employeeId,
            name = 'Guest User', // Default if missing
            email = '',
            mobile = '',
            projectId,
            issueType,
            category, // Alias for issueType
            subject,
            priority,
            description
        } = req.body;

        const finalIssueType = issueType || category || 'General';

        // Get or create employee
        let employee = await Employee.findOne({ employeeId });

        if (!employee) {
            // Create new employee if doesn't exist
            // Mongoose requires email, so generate one if missing
            const employeeEmail = email || `${employeeId}@guest.temp`;

            employee = await Employee.create({
                employeeId,
                name,
                email: employeeEmail,
                mobile
            });
        } else {
            // Use existing employee details if request body params are missing/default
            // Logic handled below with finalName/finalEmail variables
        }

        // Use let for updated vars
        let finalName = name;
        let finalEmail = email;
        let finalMobile = mobile;

        if (employee) {
            if (finalName === 'Guest User' && employee.name) finalName = employee.name;
            if (!finalEmail && employee.email) finalEmail = employee.email;
            if (!finalMobile && employee.mobile) finalMobile = employee.mobile;
        }

        // Check if project exists (only if projectId is provided and valid)
        let project = null;
        if (projectId && projectId !== '000000000000000000000000') {
            project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
            }
        }

        // Generate unique ticket ID
        const ticketId = generateTicketId();

        // Handle file attachments if any
        const attachments = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                attachments.push({
                    filename: file.filename,
                    originalName: file.originalname,
                    path: 'uploads/' + file.filename
                });
            });
        }

        // Create ticket
        const ticketData = {
            ticketId,
            employee: employee._id,
            employeeId,
            employeeName: finalName,
            employeeEmail: finalEmail,
            employeeMobile: finalMobile,
            issueType: finalIssueType,
            subject: subject || finalIssueType || 'Support Request', // Fallback
            priority: priority || 'Medium',
            description,
            attachments,
            timeline: [{
                status: 'Open',
                comment: 'Ticket created',
                updatedByName: finalName,
                timestamp: Date.now()
            }]
        };

        // Only add project if it exists
        if (project) {
            ticketData.project = projectId;
        }

        const ticket = await Ticket.create(ticketData);

        // Populate project details if exists
        if (project) {
            await ticket.populate('project');
        }

        res.status(201).json({
            success: true,
            message: 'Ticket created successfully',
            data: ticket
        });

        // Send email alert to respective Department Admin
        try {
            const { sendNewTicketAlert } = require('../utils/emailService');
            let adminEmail = 'admin@example.com'; // Default fallback

            if (ticketData.issueType === 'IT Support') {
                adminEmail = 'it-support@shubham.biz';
            } else if (ticketData.issueType === 'ERP Support') {
                adminEmail = 'erp-support@shubham.biz';
            }

            // Send alert in background (don't await to avoid blocking response)
            sendNewTicketAlert(adminEmail, ticket).catch(err => console.error('Failed to send admin alert:', err));
        } catch (emailErr) {
            console.error('Email alert logic failed:', emailErr);
        }
    } catch (error) {
        console.error('Create ticket error:', error); // Keep this
        // Check for specific mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while creating ticket: ' + error.message,
            error: error.message
        });
    }
};

// @desc    Get tickets by employee ID
// @route   GET /api/tickets/employee/:employeeId
// @access  Public
exports.getTicketsByEmployeeId = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const tickets = await Ticket.find({
            employeeId
        })
            .populate('project')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single ticket by ticket ID
// @route   GET /api/tickets/by-ticket-id/:ticketId
// @access  Public
exports.getTicketByTicketId = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findOne({ ticketId })
            .populate('project')
            .populate('assignedTo', 'name email')
            .populate('employee');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all tickets for company (Admin)
// @route   GET /api/tickets
// @access  Private (Company Admin)
exports.getTickets = async (req, res) => {
    try {
        const { status, priority, project, search, startDate, endDate, page = 1, limit = 50 } = req.query;

        // Build query
        const query = {};

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (project) query.project = project;

        // Filter by Department based on logged-in Admin
        if (req.user.department === 'IT Support') {
            query.issueType = 'IT Support';
        } else if (req.user.department === 'ERP Support') {
            query.issueType = 'ERP Support';
        }
        // If department is something else (e.g. 'Admin' or null), they see all.

        if (search) {
            query.$or = [
                { ticketId: { $regex: search, $options: 'i' } },
                { employeeName: { $regex: search, $options: 'i' } },
                { employeeId: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const tickets = await Ticket.find(query)
            .populate('project')
            .populate('employee')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Ticket.countDocuments(query);

        res.status(200).json({
            success: true,
            count: tickets.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: tickets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update ticket status and add comment
// @route   PUT /api/tickets/:id
// @access  Private (Company Admin)
exports.updateTicket = async (req, res) => {
    try {
        const { status, comment, priority, assignedTo } = req.body;

        const ticket = await Ticket.findById(req.params.id).populate('employee');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        // Update fields
        if (status) ticket.status = status;
        if (priority) ticket.priority = priority;
        if (assignedTo) ticket.assignedTo = assignedTo;

        // Add to timeline
        if (status || comment) {
            const timelineEntry = {
                status: status || ticket.status,
                comment: comment || '',
                updatedBy: req.user._id,
                updatedByName: req.user.name,
                timestamp: Date.now()
            };

            // Handle file attachments in update
            if (req.files && req.files.length > 0) {
                timelineEntry.attachments = req.files.map(file => ({
                    filename: file.filename,
                    path: 'uploads/' + file.filename
                }));
            }

            ticket.timeline.push(timelineEntry);

            // Also update the main adminResponse field for easy frontend access
            if (comment) {
                ticket.adminResponse = comment;
            }
        }

        await ticket.save();

        // Send email notification to employee
        if (status) {
            await sendTicketUpdateEmail(
                ticket.employeeEmail,
                ticket.employeeName,
                ticket.ticketId,
                status,
                comment
            );
        }

        await ticket.populate('project assignedTo');

        res.status(200).json({
            success: true,
            message: 'Ticket updated successfully',
            data: ticket
        });
    } catch (error) {
        console.error('Update ticket error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update ticket by employee (Public/Employee Portal)
// @route   PUT /api/tickets/employee-update/:ticketId
// @access  Public (Validated by employeeId)
exports.updateTicketByEmployee = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { employeeId, description, priority, subject } = req.body;

        const ticket = await Ticket.findOne({ ticketId });

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        // Verify ownership
        if (ticket.employeeId !== employeeId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to edit this ticket' });
        }

        // Only allow editing if Open
        if (ticket.status !== 'Open') {
            return res.status(400).json({ success: false, message: 'Cannot edit ticket that is already being processed' });
        }

        if (description) ticket.description = description;
        if (priority) ticket.priority = priority;
        if (subject) ticket.subject = subject;

        // Add to timeline
        ticket.timeline.push({
            status: ticket.status,
            comment: 'Ticket details updated by employee',
            updatedByName: ticket.employeeName,
            timestamp: Date.now()
        });

        await ticket.save();

        res.status(200).json({
            success: true,
            message: 'Ticket updated successfully',
            data: ticket
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get ticket statistics for company
// @route   GET /api/tickets/stats/:companyId
// @access  Private (Company Admin)
exports.getTicketStatistics = async (req, res) => {
    try {
        // Filter by Department based on logged-in Admin
        const query = {};
        if (req.user.department === 'IT Support') {
            query.issueType = 'IT Support';
        } else if (req.user.department === 'ERP Support') {
            query.issueType = 'ERP Support';
        }

        // Get all tickets (filtered)
        const tickets = await Ticket.find(query);

        // Calculate overall stats
        const stats = calculateTicketStats(tickets);

        // Get project-wise breakdown (need to match first)
        const aggregatePipeline = [];
        // Match stage
        if (Object.keys(query).length > 0) {
            aggregatePipeline.push({ $match: query });
        }

        aggregatePipeline.push({
            $group: {
                _id: '$project',
                count: { $sum: 1 },
                open: {
                    $sum: {
                        $cond: [{ $in: ['$status', ['Open', 'Under Review', 'Assigned', 'In Progress', 'Pending']] }, 1, 0]
                    }
                },
                closed: {
                    $sum: {
                        $cond: [{ $in: ['$status', ['Resolved', 'Closed']] }, 1, 0]
                    }
                }
            }
        });

        const projectStats = await Ticket.aggregate(aggregatePipeline);

        // Populate project names
        await Project.populate(projectStats, { path: '_id', select: 'name' });

        // Get daily stats for last 7 days
        const dailyStats = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const count = await Ticket.countDocuments({
                createdAt: { $gte: date, $lt: nextDate }
            });

            dailyStats.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                count
            });
        }

        res.status(200).json({
            success: true,
            data: {
                overall: stats,
                byProject: projectStats,
                daily: dailyStats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
