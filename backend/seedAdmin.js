const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./app/api/models/users');

// Connect to the database using your existing config
require('./config/database');

async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin@admin.com' });
    if (existingAdmin) {
      console.log('Admin user already exists in the database!');
      process.exit(0);
    }

    // Hash the password
    const saltRounds = 10;
    const hash = bcrypt.hashSync('admin123', saltRounds);
    
    // Create new admin user
    const adminUser = new User({
      nama: 'Super Administrator',
      username: 'admin@admin.com',
      password: hash,
      role: 'ROLE_ADMIN' // Giving them the admin role
    });

    await adminUser.save();
    console.log('✅ Admin user seeded successfully!');
    console.log('-------------------------');
    console.log('Email/Username: admin@admin.com');
    console.log('Password: admin123');
    console.log('-------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

// Wait a second for Mongoose to establish connection before running
setTimeout(seedAdmin, 1000);
