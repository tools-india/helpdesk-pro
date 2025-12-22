const Announcement = require('../models/Announcement');

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (Company Admin)
exports.createAnnouncement = async (req, res) => {
    try {
        const { title, message, priority } = req.body;

        const announcement = await Announcement.create({
            title,
            message,
            priority: priority || 'Medium',
            createdBy: req.user._id
        });

        await announcement.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: announcement
        });
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating announcement',
            error: error.message
        });
    }
};

// @desc    Get announcements for a company
// @route   GET /api/announcements
// @access  Private (Company Admin) / Public (by slug for employees)
exports.getAnnouncements = async (req, res) => {
    try {
        let query = { isActive: true };

        const announcements = await Announcement.find(query)
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            count: announcements.length,
            data: announcements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Company Admin)
exports.updateAnnouncement = async (req, res) => {
    try {
        const { title, message, priority, isActive } = req.body;

        let announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        if (title !== undefined) announcement.title = title;
        if (message !== undefined) announcement.message = message;
        if (priority !== undefined) announcement.priority = priority;
        if (isActive !== undefined) announcement.isActive = isActive;

        await announcement.save();

        res.status(200).json({
            success: true,
            message: 'Announcement updated successfully',
            data: announcement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Company Admin)
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        announcement.isActive = false;
        await announcement.save();

        res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
