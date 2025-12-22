const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./backend/models/User');

const checkUser = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/helpdesk-multi-tenant');
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: 'super@helpdesk.com' });
        if (user) {
            console.log('User found:', user);
            console.log('User ID:', user._id.toString());
        } else {
            console.log('User not found');
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUser();
