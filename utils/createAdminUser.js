import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const username = 'admin@123';
    const email = 'admin@123';
    const password = 'admin@123';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const adminUser = new User({
      username: username,
      email: email,
      password: password,
      role: 'admin',
      fullName: 'System Administrator',
      isActive: true
    });

    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role: admin');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    if (error.code === 11000) {
      console.error('User with this username or email already exists');
    }
    process.exit(1);
  }
};

createAdminUser();

