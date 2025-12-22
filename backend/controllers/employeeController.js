const Employee = require('../models/Employee');


// @desc    Create employee
// @route   POST /api/employees
// @access  Private (Company Admin)
exports.createEmployee = async (req, res) => {
    try {
        const { employeeId, name, email, mobile, department, designation } = req.body;

        // Check if employee ID already exists
        const existingEmployee = await Employee.findOne({ employeeId });
        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: 'Employee with this Employee ID already exists'
            });
        }

        const employee = await Employee.create({
            employeeId,
            name,
            email,
            mobile,
            department,
            designation
        });

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: employee
        });
    } catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating employee',
            error: error.message
        });
    }
};

// @desc    Get all employees for a company
// @route   GET /api/employees
// @access  Private (Company Admin)
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private (Company Admin)
exports.getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get employee by employee ID and company
// @route   GET /api/employees/by-emp-id/:employeeId
// @access  Public
exports.getEmployeeByEmpId = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const employee = await Employee.findOne({
            employeeId,
            isActive: true
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Company Admin)
exports.updateEmployee = async (req, res) => {
    try {
        const { name, email, mobile, department, designation, isActive } = req.body;

        let employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Update fields
        if (name !== undefined) employee.name = name;
        if (email !== undefined) employee.email = email;
        if (mobile !== undefined) employee.mobile = mobile;
        if (department !== undefined) employee.department = department;
        if (designation !== undefined) employee.designation = designation;
        if (isActive !== undefined) employee.isActive = isActive;

        await employee.save();

        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            data: employee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Company Admin)
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Soft delete - just deactivate
        employee.isActive = false;
        await employee.save();

        res.status(200).json({
            success: true,
            message: 'Employee deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Bulk import employees
// @route   POST /api/employees/bulk-import
// @access  Private (Company Admin)
exports.bulkImportEmployees = async (req, res) => {
    try {
        const { employees } = req.body;

        if (!Array.isArray(employees) || employees.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Employees array is required'
            });
        }

        const results = {
            success: [],
            failed: []
        };

        for (const emp of employees) {
            try {
                // Check if employee already exists
                const existing = await Employee.findOne({
                    employeeId: emp.employeeId
                });

                if (existing) {
                    results.failed.push({
                        employeeId: emp.employeeId,
                        reason: 'Employee ID already exists'
                    });
                    continue;
                }

                const employee = await Employee.create({
                    ...emp
                });

                results.success.push(employee);
            } catch (error) {
                results.failed.push({
                    employeeId: emp.employeeId,
                    reason: error.message
                });
            }
        }

        res.status(200).json({
            success: true,
            message: `Imported ${results.success.length} employees. ${results.failed.length} failed.`,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
