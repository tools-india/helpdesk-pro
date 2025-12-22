const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('./backend/models/User');
const mongoose = require('mongoose');

const generateToken = async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk');

    const user = await User.findOne({ email: 'super@helpdesk.com' });
    if (!user) {
        console.log('User not found!');
        process.exit(1);
    }

    // Create token
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    const userObj = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    // console.log('\nCopy and paste this into browser console:\n');
    console.log(`localStorage.setItem("token", "${token}");`);
    console.log(`localStorage.setItem("user", JSON.stringify(${JSON.stringify(userObj)}));`);
    console.log(`location.href = "/super-admin/dashboard.html";`);

    process.exit();
};

generateToken();
