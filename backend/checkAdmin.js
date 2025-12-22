const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const admin = await User.findOne({ email: 'admin@example.com' }).select('+password');
        if (admin) {
            console.log('Admin found:', admin.email);
            console.log('Role:', admin.role);
            console.log('Password Hash exists:', !!admin.password);
        } else {
            console.log('Admin NOT found');
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkAdmin();
