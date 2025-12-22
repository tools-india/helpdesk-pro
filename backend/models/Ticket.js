const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({

    ticketId: {
        type: String,
        required: true,
        unique: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    employeeId: {
        type: String,
        required: true,
        index: true
    },
    employeeName: {
        type: String,
        required: true
    },
    employeeEmail: {
        type: String,
        required: true
    },
    employeeMobile: String,
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    issueType: {
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Open', 'Under Review', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed'],
        default: 'Open'
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    adminResponse: {
        type: String,
        default: ''
    },
    attachments: [{
        filename: String,
        originalName: String,
        path: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timeline: [{
        status: String,
        comment: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedByName: String,
        attachments: [{
            filename: String,
            path: String
        }],
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: Date,
    closedAt: Date
});

// Update timestamp
ticketSchema.pre('save', function (next) {
    this.updatedAt = Date.now();

    // Set resolved/closed date
    if (this.status === 'Resolved' && !this.resolvedAt) {
        this.resolvedAt = Date.now();
    }
    if (this.status === 'Closed' && !this.closedAt) {
        this.closedAt = Date.now();
    }

    next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
