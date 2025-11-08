// Backend/scripts/createAdminUser.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickhire';

async function createAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@quickhire.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      // Update to admin role if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role');
      }
      process.exit(0);
    }

    // Create new admin user
    const adminUser = new User({
      email: 'admin@quickhire.com',
      password: 'admin123', // Will be hashed by pre-save hook
      name: 'QuickHire Admin',
      role: 'admin',
      is_active: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@quickhire.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();