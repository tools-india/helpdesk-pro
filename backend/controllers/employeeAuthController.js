const Employee = require('../models/Employee');

// @desc    Employee login with Employee ID and Mobile
// @route   POST /api/employees/login
// @access  Public
exports.employeeLogin = async (req, res) => {
    try {
        const { employeeId, mobile } = req.body;

        // Validate input
        if (!employeeId || !mobile) {
            return res.status(400).json({
                success: false,
                message: 'Please provide Employee ID and Mobile number'
            });
        }

        // Find employee
        const employee = await Employee.findOne({
            employeeId: employeeId.trim(),
            isActive: true
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found or inactive'
            });
        }

        // Verify mobile number
        if (employee.mobile !== mobile.trim()) {
            return res.status(401).json({
                success: false,
                message: 'Invalid mobile number'
            });
        }

        // Return employee data (without sensitive info)
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                id: employee._id,
                employeeId: employee.employeeId,
                name: employee.name,
                email: employee.email,
                mobile: employee.mobile,
                department: employee.department,
                designation: employee.designation
            }
        });

    } catch (error) {
        console.error('Employee login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login: ' + error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// @desc    Employee signup (self-registration)
// @route   POST /api/employees/signup
// @access  Public
exports.employeeSignup = async (req, res) => {
    try {
        const { employeeId, name, email, mobile, department, designation } = req.body;

        // Validate required fields
        if (!employeeId || !name || !email || !mobile) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (Employee ID, Name, Email, Mobile)'
            });
        }

        // Check if employee already exists
        const existingEmployee = await Employee.findOne({
            $or: [
                { employeeId: employeeId.trim() },
                { email: email.trim().toLowerCase() }
            ]
        });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: 'Employee with this ID or Email already exists'
            });
        }

        // Create new employee
        const employee = await Employee.create({
            employeeId: employeeId.trim(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            mobile: mobile.trim(),
            department: department?.trim(),
            designation: designation?.trim(),
            isActive: true
        });

        // Return employee data
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                id: employee._id,
                employeeId: employee.employeeId,
                name: employee.name,
                email: employee.email,
                mobile: employee.mobile,
                department: employee.department,
                designation: employee.designation
            }
        });

    } catch (error) {
        console.error('Employee signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};
