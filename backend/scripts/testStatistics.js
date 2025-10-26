const mongoose = require('mongoose');
const Project = require('../models/Project');
require('dotenv').config();

const testStatistics = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appzeto');
    console.log('✅ Database connected');
    
    // Test simple aggregation
    const stats = await Project.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending-assignment'] }, 1, 0] } }
        }
      }
    ]);
    
    console.log('📊 Project statistics:', stats);
    
    // Test individual counts
    const totalCount = await Project.countDocuments();
    const activeCount = await Project.countDocuments({ status: 'active' });
    const completedCount = await Project.countDocuments({ status: 'completed' });
    const pendingCount = await Project.countDocuments({ status: 'pending-assignment' });
    
    console.log('📈 Individual counts:');
    console.log('  Total:', totalCount);
    console.log('  Active:', activeCount);
    console.log('  Completed:', completedCount);
    console.log('  Pending:', pendingCount);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testStatistics();
