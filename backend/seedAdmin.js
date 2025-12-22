const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected for Seeding');

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('⚠️ Admin already exists: admin@example.com');
            process.exit(0);
        }

        const adminData = {
            name: 'Super Admin',
            email: 'admin@example.com',
            password: 'password123',
            mobile: '9876543210',
            role: 'admin',
            isActive: true,
            isEmailVerified: true,
            isMobileVerified: true
        };

        await User.create(adminData);
        console.log('✅ Admin Account Created Successfully!');
        console.log('👉 Email: admin@example.com');
        console.log('👉 Password: password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedAdmin();
