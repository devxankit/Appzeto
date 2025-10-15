const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import Sales model
const Sales = require('../models/Sales');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Function to create Sales user
const createSalesUser = async () => {
  try {
    await connectDB();
    
    // Check if Sales user already exists
    const existingSales = await Sales.findOne({ email: 'sales@appzeto.com' });
    
    if (existingSales) {
      console.log('Sales user already exists with email: sales@appzeto.com');
      console.log('Sales details:', {
        id: existingSales._id,
        name: existingSales.name,
        email: existingSales.email,
        role: existingSales.role,
        department: existingSales.department,
        employeeId: existingSales.employeeId,
        isActive: existingSales.isActive,
        createdAt: existingSales.createdAt
      });
      console.log('\nLogin credentials:');
      console.log('Email: sales@appzeto.com');
      console.log('Password: Sales@123');
      console.log('Role: sales');
      return;
    }

    // Create Sales user
    const salesData = {
      name: 'Appzeto Sales',
      email: 'sales@appzeto.com',
      password: 'Sales@123',
      role: 'sales',
      department: 'Sales',
      employeeId: 'SL001',
      phone: '+1234567890',
      salesTarget: 100000,
      currentSales: 25000,
      commissionRate: 5,
      skills: ['Sales', 'Lead Generation', 'Customer Relations', 'Negotiation'],
      experience: 3,
      isActive: true
    };

    const sales = await Sales.create(salesData);
    
    console.log('Sales user created successfully!');
    console.log('Sales details:', {
      id: sales._id,
      name: sales.name,
      email: sales.email,
      role: sales.role,
      department: sales.department,
      employeeId: sales.employeeId,
      isActive: sales.isActive,
      createdAt: sales.createdAt
    });
    
    console.log('\nLogin credentials:');
    console.log('Email: sales@appzeto.com');
    console.log('Password: Sales@123');
    console.log('Role: sales');
    
  } catch (error) {
    console.error('Error creating Sales user:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
};

// Main execution
const main = async () => {
  console.log('Sales User Creation Script');
  console.log('==========================\n');
  
  await createSalesUser();
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Run the script
main();
