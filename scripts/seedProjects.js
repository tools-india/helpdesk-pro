require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../backend/models/Project');
const connectDB = require('../backend/config/database');

const projects = [
    { name: 'Police Training Centre', description: 'Police Training Centre Project' },
    { name: 'Ayurvedic Hospital', description: 'Ayurvedic Hospital Project' },
    { name: 'Bottling Plant', description: 'Bottling Plant Project' },
    { name: 'Dog Training Centre', description: 'Dog Training Centre Project' },
    { name: 'CP Office Pune', description: 'CP Office Pune Project' },
    { name: 'Shubham Tarangan', description: 'Shubham Tarangan Project' },
    { name: 'STT DC05 - Dighi', description: 'STT DC05 - Dighi Project' },
    { name: 'JJ Hospital - Mumbai', description: 'JJ Hospital - Mumbai Project' },
    { name: 'STT DC02/03 - Navi Mumbai', description: 'STT DC02/03 - Navi Mumbai Project' },
    { name: 'Mantralaya - Mumbai', description: 'Mantralaya - Mumbai Project' },
    { name: 'Auditorium - Roha', description: 'Auditorium - Roha Project' },
    { name: 'BSL2/3 Dibrugarh', description: 'BSL2/3 Dibrugarh Project' },
    { name: 'Dighi Workshop', description: 'Dighi Workshop Project' }
];

const seedProjects = async () => {
    try {
        await connectDB();

        console.log('Connected to MongoDB...');

        for (const project of projects) {
            const exists = await Project.findOne({ name: project.name });
            if (!exists) {
                await Project.create(project);
                console.log(`Created project: ${project.name}`);
            } else {
                console.log(`Project already exists: ${project.name}`);
            }
        }

        console.log('Project seeding completed.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding projects:', error);
        process.exit(1);
    }
};

seedProjects();
