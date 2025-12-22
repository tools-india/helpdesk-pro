const Project = require('../models/Project');

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Company Admin)
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Check if project already exists
        const existingProject = await Project.findOne({ name });
        if (existingProject) {
            return res.status(400).json({
                success: false,
                message: 'Project with this name already exists'
            });
        }

        const project = await Project.create({
            name,
            description
        });

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating project',
            error: error.message
        });
    }
};

// @desc    Get all projects for a company
// @route   GET /api/projects
// @access  Private (Company Admin) / Public (for ticket creation)
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isActive: true })
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all active projects (for employee portal)
// @route   GET /api/projects/public
// @access  Public
exports.getProjectsPublic = async (req, res) => {
    try {
        const projects = await Project.find({ isActive: true })
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Company Admin)
exports.updateProject = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;

        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        if (name !== undefined) project.name = name;
        if (description !== undefined) project.description = description;
        if (isActive !== undefined) project.isActive = isActive;

        await project.save();

        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Company Admin)
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Soft delete
        project.isActive = false;
        await project.save();

        res.status(200).json({
            success: true,
            message: 'Project deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
