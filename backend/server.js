require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

// Initialize app
const app = express();

// Middleware to ensure DB is connected (especially for Serverless)
app.use(async (req, res, next) => {
    if (require.main !== module) {
        // We are in Vercel/Serverless environment
        // Explicitly await the connection
        await connectDB();
    }
    next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(process.env.UPLOAD_DIR || path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));

app.use('/api/employees', require('./routes/employees'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/announcements', require('./routes/announcements'));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/admin', express.static(path.join(__dirname, '../frontend/admin')));

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin/index.html'));
});

// Root route - Serve Employee Portal Index (was frontend/index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors
        });
    }

    if (err.name === 'CastError') {
        return res.status(404).json({
            success: false,
            message: 'Resource not found'
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 3000;

// Connect to database and then start server
if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`
║                                                       ║
║   🎫 HELPDESK SYSTEM (Single Tenant)                 ║
║                                                       ║
║   Server running on port: ${PORT}                     ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║                                                       ║
║   📡 API Endpoints:                                   ║
║   - Admin Portal: /admin                              ║
║   - Employee Portal: /                                ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
          `);
        });
    }).catch(err => {
        console.error('Failed to connect to Database. Server shutting down.', err);
        process.exit(1);
    });
} else {
    // For Serverless environment (Vercel)
    connectDB();
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});

module.exports = app;
