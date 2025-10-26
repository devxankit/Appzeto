const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Admin = require('./models/Admin');
const PM = require('./models/PM');
const Sales = require('./models/Sales');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appzeto', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Test basic functionality
const testBasicFunctionality = async () => {
  try {
    console.log('\n🔍 Testing Basic Functionality...');
    
    // Test Admin count
    const adminCount = await Admin.countDocuments();
    console.log(`✅ Admin count: ${adminCount}`);
    
    // Test PM count
    const pmCount = await PM.countDocuments();
    console.log(`✅ PM count: ${pmCount}`);
    
    // Test Sales count
    const salesCount = await Sales.countDocuments();
    console.log(`✅ Sales count: ${salesCount}`);
    
    // Test Admin login
    const admin = await Admin.findOne({ email: 'admin@appzeto.com' }).select('+password');
    if (admin) {
      console.log(`✅ Admin found: ${admin.name}`);
      console.log(`✅ Admin email: ${admin.email}`);
      console.log(`✅ Admin has password: ${admin.password ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Admin not found');
    }
    
    // Test PM login
    const pm = await PM.findOne({ email: 'david@appzeto.com' }).select('+password');
    if (pm) {
      console.log(`✅ PM found: ${pm.name}`);
      console.log(`✅ PM email: ${pm.email}`);
      console.log(`✅ PM has password: ${pm.password ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ PM not found');
    }
    
    // Test Sales login
    const sales = await Sales.findOne({ email: 'priya@appzeto.com' }).select('+password');
    if (sales) {
      console.log(`✅ Sales found: ${sales.name}`);
      console.log(`✅ Sales email: ${sales.email}`);
      console.log(`✅ Sales has password: ${sales.password ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Sales not found');
    }
    
    console.log('\n🎉 Basic functionality test completed!');
    
  } catch (error) {
    console.error('❌ Error testing basic functionality:', error);
  }
};

// Main execution
const runTest = async () => {
  try {
    await connectDB();
    await testBasicFunctionality();
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runTest();
}

module.exports = { runTest };
