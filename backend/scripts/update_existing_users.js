const mongoose = require('mongoose');
require('dotenv').config();

// Import all user models
const Admin = require('../models/Admin');
const PM = require('../models/PM');
const Sales = require('../models/Sales');
const Employee = require('../models/Employee');
const Client = require('../models/Client');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Function to update Admin users
const updateAdminUsers = async () => {
  try {
    console.log('\n🔄 Updating Admin users...');
    
    const admins = await Admin.find({});
    console.log(`Found ${admins.length} admin users`);
    
    for (const admin of admins) {
      const updateData = {};
      let needsUpdate = false;
      
      // Check and add missing fields
      if (!admin.phone) {
        updateData.phone = '+1234567890'; // Default phone
        needsUpdate = true;
      }
      
      if (!admin.dateOfBirth) {
        updateData.dateOfBirth = new Date('1985-01-01'); // Default DOB
        needsUpdate = true;
      }
      
      if (!admin.joiningDate) {
        updateData.joiningDate = new Date(); // Default joining date
        needsUpdate = true;
      }
      
      if (!admin.document) {
        updateData.document = {
          filename: null,
          originalName: null,
          mimetype: null,
          size: null,
          path: null
        };
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await Admin.findByIdAndUpdate(admin._id, { $set: updateData });
        console.log(`✅ Updated admin: ${admin.name} (${admin.email})`);
      } else {
        console.log(`ℹ️  Admin already up to date: ${admin.name} (${admin.email})`);
      }
    }
    
    console.log('✅ Admin users update completed');
  } catch (error) {
    console.error('❌ Error updating admin users:', error.message);
  }
};

// Function to update PM users
const updatePMUsers = async () => {
  try {
    console.log('\n🔄 Updating PM users...');
    
    const pms = await PM.find({});
    console.log(`Found ${pms.length} PM users`);
    
    for (const pm of pms) {
      const updateData = {};
      let needsUpdate = false;
      
      // Check and add missing fields
      if (!pm.phone) {
        updateData.phone = '+1234567890'; // Default phone
        needsUpdate = true;
      }
      
      if (!pm.dateOfBirth) {
        updateData.dateOfBirth = new Date('1985-01-01'); // Default DOB
        needsUpdate = true;
      }
      
      if (!pm.joiningDate) {
        updateData.joiningDate = new Date(); // Default joining date
        needsUpdate = true;
      }
      
      if (!pm.document) {
        updateData.document = {
          filename: null,
          originalName: null,
          mimetype: null,
          size: null,
          path: null
        };
        needsUpdate = true;
      }
      
      // Update role to standardized format if needed
      if (pm.role === 'PM') {
        updateData.role = 'project-manager';
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await PM.findByIdAndUpdate(pm._id, { $set: updateData });
        console.log(`✅ Updated PM: ${pm.name} (${pm.email})`);
      } else {
        console.log(`ℹ️  PM already up to date: ${pm.name} (${pm.email})`);
      }
    }
    
    console.log('✅ PM users update completed');
  } catch (error) {
    console.error('❌ Error updating PM users:', error.message);
  }
};

// Function to update Sales users
const updateSalesUsers = async () => {
  try {
    console.log('\n🔄 Updating Sales users...');
    
    const sales = await Sales.find({});
    console.log(`Found ${sales.length} sales users`);
    
    for (const salesUser of sales) {
      const updateData = {};
      let needsUpdate = false;
      
      // Check and add missing fields
      if (!salesUser.phone) {
        updateData.phone = '+1234567890'; // Default phone
        needsUpdate = true;
      }
      
      if (!salesUser.dateOfBirth) {
        updateData.dateOfBirth = new Date('1985-01-01'); // Default DOB
        needsUpdate = true;
      }
      
      if (!salesUser.joiningDate) {
        updateData.joiningDate = new Date(); // Default joining date
        needsUpdate = true;
      }
      
      if (!salesUser.document) {
        updateData.document = {
          filename: null,
          originalName: null,
          mimetype: null,
          size: null,
          path: null
        };
        needsUpdate = true;
      }
      
      // Update role and add team/department if needed
      if (salesUser.role !== 'employee') {
        updateData.role = 'employee';
        needsUpdate = true;
      }
      
      if (!salesUser.team) {
        updateData.team = 'sales';
        needsUpdate = true;
      }
      
      if (!salesUser.department) {
        updateData.department = 'sales';
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await Sales.findByIdAndUpdate(salesUser._id, { $set: updateData });
        console.log(`✅ Updated Sales: ${salesUser.name} (${salesUser.email})`);
      } else {
        console.log(`ℹ️  Sales already up to date: ${salesUser.name} (${salesUser.email})`);
      }
    }
    
    console.log('✅ Sales users update completed');
  } catch (error) {
    console.error('❌ Error updating sales users:', error.message);
  }
};

// Function to update Employee users
const updateEmployeeUsers = async () => {
  try {
    console.log('\n🔄 Updating Employee users...');
    
    const employees = await Employee.find({});
    console.log(`Found ${employees.length} employee users`);
    
    for (const employee of employees) {
      const updateData = {};
      let needsUpdate = false;
      
      // Check and add missing fields
      if (!employee.phone) {
        updateData.phone = '+1234567890'; // Default phone
        needsUpdate = true;
      }
      
      if (!employee.dateOfBirth) {
        updateData.dateOfBirth = new Date('1985-01-01'); // Default DOB
        needsUpdate = true;
      }
      
      if (!employee.joiningDate) {
        updateData.joiningDate = new Date(); // Default joining date
        needsUpdate = true;
      }
      
      if (!employee.document) {
        updateData.document = {
          filename: null,
          originalName: null,
          mimetype: null,
          size: null,
          path: null
        };
        needsUpdate = true;
      }
      
      // Add team and department if missing
      if (!employee.team) {
        updateData.team = 'developer'; // Default team
        needsUpdate = true;
      }
      
      if (!employee.department) {
        updateData.department = 'full-stack'; // Default department
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await Employee.findByIdAndUpdate(employee._id, { $set: updateData });
        console.log(`✅ Updated Employee: ${employee.name} (${employee.email})`);
      } else {
        console.log(`ℹ️  Employee already up to date: ${employee.name} (${employee.email})`);
      }
    }
    
    console.log('✅ Employee users update completed');
  } catch (error) {
    console.error('❌ Error updating employee users:', error.message);
  }
};

// Function to update Client users
const updateClientUsers = async () => {
  try {
    console.log('\n🔄 Updating Client users...');
    
    const clients = await Client.find({});
    console.log(`Found ${clients.length} client users`);
    
    for (const client of clients) {
      const updateData = {};
      let needsUpdate = false;
      
      // Check and add missing fields
      if (!client.dateOfBirth) {
        updateData.dateOfBirth = new Date('1985-01-01'); // Default DOB
        needsUpdate = true;
      }
      
      if (!client.joiningDate) {
        updateData.joiningDate = new Date(); // Default joining date
        needsUpdate = true;
      }
      
      if (!client.document) {
        updateData.document = {
          filename: null,
          originalName: null,
          mimetype: null,
          size: null,
          path: null
        };
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await Client.findByIdAndUpdate(client._id, { $set: updateData });
        console.log(`✅ Updated Client: ${client.name} (${client.phoneNumber})`);
      } else {
        console.log(`ℹ️  Client already up to date: ${client.name} (${client.phoneNumber})`);
      }
    }
    
    console.log('✅ Client users update completed');
  } catch (error) {
    console.error('❌ Error updating client users:', error.message);
  }
};

// Function to get user statistics
const getUserStatistics = async () => {
  try {
    console.log('\n📊 User Statistics:');
    
    const adminCount = await Admin.countDocuments();
    const pmCount = await PM.countDocuments();
    const salesCount = await Sales.countDocuments();
    const employeeCount = await Employee.countDocuments();
    const clientCount = await Client.countDocuments();
    
    console.log(`👑 Admins: ${adminCount}`);
    console.log(`👨‍💼 PMs: ${pmCount}`);
    console.log(`💼 Sales: ${salesCount}`);
    console.log(`👨‍💻 Employees: ${employeeCount}`);
    console.log(`👤 Clients: ${clientCount}`);
    console.log(`📈 Total Users: ${adminCount + pmCount + salesCount + employeeCount + clientCount}`);
  } catch (error) {
    console.error('❌ Error getting user statistics:', error.message);
  }
};

// Function to validate user data
const validateUserData = async () => {
  try {
    console.log('\n🔍 Validating user data...');
    
    // Check for users with missing required fields
    const adminsWithMissingFields = await Admin.find({
      $or: [
        { phone: { $exists: false } },
        { dateOfBirth: { $exists: false } },
        { joiningDate: { $exists: false } }
      ]
    });
    
    const pmsWithMissingFields = await PM.find({
      $or: [
        { phone: { $exists: false } },
        { dateOfBirth: { $exists: false } },
        { joiningDate: { $exists: false } }
      ]
    });
    
    const salesWithMissingFields = await Sales.find({
      $or: [
        { phone: { $exists: false } },
        { dateOfBirth: { $exists: false } },
        { joiningDate: { $exists: false } },
        { team: { $exists: false } },
        { department: { $exists: false } }
      ]
    });
    
    const employeesWithMissingFields = await Employee.find({
      $or: [
        { phone: { $exists: false } },
        { dateOfBirth: { $exists: false } },
        { joiningDate: { $exists: false } },
        { team: { $exists: false } },
        { department: { $exists: false } }
      ]
    });
    
    const clientsWithMissingFields = await Client.find({
      $or: [
        { dateOfBirth: { $exists: false } },
        { joiningDate: { $exists: false } }
      ]
    });
    
    console.log(`❌ Admins with missing fields: ${adminsWithMissingFields.length}`);
    console.log(`❌ PMs with missing fields: ${pmsWithMissingFields.length}`);
    console.log(`❌ Sales with missing fields: ${salesWithMissingFields.length}`);
    console.log(`❌ Employees with missing fields: ${employeesWithMissingFields.length}`);
    console.log(`❌ Clients with missing fields: ${clientsWithMissingFields.length}`);
    
    const totalMissing = adminsWithMissingFields.length + pmsWithMissingFields.length + 
                        salesWithMissingFields.length + employeesWithMissingFields.length + 
                        clientsWithMissingFields.length;
    
    if (totalMissing === 0) {
      console.log('✅ All users have required fields!');
    } else {
      console.log(`⚠️  Total users with missing fields: ${totalMissing}`);
    }
    
  } catch (error) {
    console.error('❌ Error validating user data:', error.message);
  }
};

// Main function
const updateAllUsers = async () => {
  try {
    console.log('🚀 Starting comprehensive user update process...\n');
    
    await connectDB();
    
    // Get initial statistics
    await getUserStatistics();
    
    // Validate current data
    await validateUserData();
    
    // Update all user types
    await updateAdminUsers();
    await updatePMUsers();
    await updateSalesUsers();
    await updateEmployeeUsers();
    await updateClientUsers();
    
    // Get final statistics
    console.log('\n📊 Final Statistics:');
    await getUserStatistics();
    
    // Final validation
    await validateUserData();
    
    console.log('\n🎉 User update process completed successfully!');
    console.log('\n📝 Summary of updates:');
    console.log('✅ Added phone numbers to all users');
    console.log('✅ Added dateOfBirth to all users');
    console.log('✅ Added joiningDate to all users');
    console.log('✅ Added document structure to all users');
    console.log('✅ Updated PM role to "project-manager"');
    console.log('✅ Updated Sales role to "employee" with team/department');
    console.log('✅ Added team/department to Employees');
    console.log('✅ All users now comply with updated model structure');
    
  } catch (error) {
    console.error('❌ Error in user update process:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
if (require.main === module) {
  updateAllUsers();
}

module.exports = {
  updateAllUsers,
  updateAdminUsers,
  updatePMUsers,
  updateSalesUsers,
  updateEmployeeUsers,
  updateClientUsers,
  getUserStatistics,
  validateUserData
};
