const mongoose = require('mongoose');
const Employee = require('../models/Employee');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create test employee
const createTestEmployee = async () => {
  try {
    await connectDB();
    
    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ email: 'employee@demo.com' });
    if (existingEmployee) {
      console.log('Test employee already exists:', existingEmployee.email);
      console.log('Password: password123');
      process.exit(0);
    }
    
    // Create test employee
    const testEmployee = await Employee.create({
      name: 'Test Employee',
      email: 'employee@demo.com',
      password: 'password123',
      role: 'employee',
      department: 'Development',
      employeeId: 'EMP001',
      phone: '+1234567890',
      position: 'Software Developer',
      joiningDate: new Date('2023-01-15'),
      salary: 50000,
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      experience: 2,
      isActive: true
    });
    
    console.log('Test employee created successfully:');
    console.log('Email:', testEmployee.email);
    console.log('Password: password123');
    console.log('ID:', testEmployee._id);
    
  } catch (error) {
    console.error('Error creating test employee:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestEmployee();
