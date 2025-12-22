const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedDepartmentAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected for Seeding');

        const admins = [
            {
                name: 'IT Admin',
                email: 'it-support@shubham.biz',
                password: 'Password@123',
                mobile: '9876543211',
                role: 'admin',
                department: 'IT Support', // Custom field if useful, or just rely on email
                isActive: true,
                isEmailVerified: true,
                isMobileVerified: true
            },
            {
                name: 'ERP Lead',
                email: 'erp-support@shubham.biz',
                password: 'Password@123',
                mobile: '9876543212',
                role: 'admin',
                department: 'ERP Support',
                isActive: true,
                isEmailVerified: true,
                isMobileVerified: true
            }
        ];

        for (const adminData of admins) {
            const existing = await User.findOne({ email: adminData.email });
            if (existing) {
                console.log(`⚠️ Admin already exists: ${adminData.email}. Updating department...`);
                existing.department = adminData.department;
                await existing.save();
                console.log(`✅ Updated Admin Department: ${existing.department}`);
            } else {
                await User.create(adminData);
                console.log(`✅ Created Admin: ${adminData.email}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedDepartmentAdmins();
