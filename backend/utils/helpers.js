const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT Token
exports.generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Generate random OTP (6 digits)
exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate verification token
exports.generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Generate unique ticket ID (6 digits)
exports.generateTicketId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Format date to readable string
exports.formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Create slug from string
exports.createSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

// Calculate ticket statistics
exports.calculateTicketStats = (tickets) => {
    const stats = {
        total: tickets.length,
        open: 0,
        underReview: 0,
        assigned: 0,
        inProgress: 0,
        pending: 0,
        resolved: 0,
        closed: 0,
        byPriority: {
            Low: 0,
            Medium: 0,
            High: 0,
            Urgent: 0
        }
    };

    tickets.forEach(ticket => {
        // Count by status
        switch (ticket.status) {
            case 'Open':
                stats.open++;
                break;
            case 'Under Review':
                stats.underReview++;
                break;
            case 'Assigned':
                stats.assigned++;
                break;
            case 'In Progress':
                stats.inProgress++;
                break;
            case 'Pending':
                stats.pending++;
                break;
            case 'Resolved':
                stats.resolved++;
                break;
            case 'Closed':
                stats.closed++;
                break;
        }

        // Count by priority
        if (stats.byPriority[ticket.priority] !== undefined) {
            stats.byPriority[ticket.priority]++;
        }
    });

    return stats;
};

// Validate email format
exports.isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate mobile format (Indian)
exports.isValidMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
};
