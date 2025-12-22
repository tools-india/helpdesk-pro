const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({

    employeeId: {
        type: String,
        required: [true, 'Employee ID is required'],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        trim: true
    },
    designation: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for unique employee ID per company
employeeSchema.index({ employeeId: 1 }, { unique: true });

module.exports = mongoose.model('Employee', employeeSchema);
