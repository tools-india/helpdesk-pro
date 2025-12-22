const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
};

const cleanup = async () => {
    await connectDB();

    try {
        console.log('Starting DB Cleanup...');

        // 1. Drop Company collection
        if (mongoose.connection.collections['companies']) {
            await mongoose.connection.collections['companies'].drop();
            console.log('Dropped "companies" collection.');
        } else {
            console.log('"companies" collection does not exist.');
        }

        // 2. Remove company field from Users
        const User = mongoose.connection.collection('users');
        await User.updateMany({}, { $unset: { company: "" }, $set: { role: 'admin' } }); // Set all existing users to admin just in case
        console.log('Removed "company" field from Users and set default role to "admin".');

        // 3. Remove company field from Tickets
        const Ticket = mongoose.connection.collection('tickets');
        await Ticket.updateMany({}, { $unset: { company: "" } });
        console.log('Removed "company" field from Tickets.');

        // 4. Remove company field from Employees
        const Employee = mongoose.connection.collection('employees');
        await Employee.updateMany({}, { $unset: { company: "" } });
        console.log('Removed "company" field from Employees.');

        // 5. Remove company field from Projects
        const Project = mongoose.connection.collection('projects');
        await Project.updateMany({}, { $unset: { company: "" } });
        console.log('Removed "company" field from Projects.');

        // 6. Remove company field from Announcements
        const Announcement = mongoose.connection.collection('announcements');
        await Announcement.updateMany({}, { $unset: { company: "" } });
        console.log('Removed "company" field from Announcements.');

        console.log('Cleanup Complete. Single-tenant migration finished.');
        process.exit(0);
    } catch (error) {
        console.error('Cleanup Error:', error);
        process.exit(1);
    }
};

cleanup();
