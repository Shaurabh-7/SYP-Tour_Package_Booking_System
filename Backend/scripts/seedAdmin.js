import bcrypt from 'bcrypt';
import User from '../models/user.js';

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'admin123';

        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            console.log('Admin user already exists.');
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await User.create({
            name: 'NepalYatra Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            isActive: true
        });

        console.log('Admin user created successfully!');

    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

export default seedAdmin;
