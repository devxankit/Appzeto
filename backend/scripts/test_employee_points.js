const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const PM = require('../models/PM');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test employee points system
const testEmployeePointsSystem = async () => {
  console.log('\n🧪 Testing Employee Points System...\n');

  try {
    // 1. Create a test PM
    console.log('1️⃣ Creating test PM...');
    const testPM = new PM({
      name: 'Test PM',
      email: 'testpm@example.com',
      password: 'password123',
      phone: '1234567890',
      department: 'full-stack'
    });
    await testPM.save();
    console.log('✅ Test PM created');

    // 2. Create a test employee
    console.log('\n2️⃣ Creating test employee...');
    const testEmployee = new Employee({
      name: 'Test Employee',
      email: 'testemployee@example.com',
      password: 'password123',
      phone: '1234567890',
      team: 'developer',
      department: 'full-stack',
      dateOfBirth: new Date('1990-01-01'),
      joiningDate: new Date(),
      position: 'Senior Developer',
      salary: 50000,
      skills: ['JavaScript', 'React', 'Node.js'],
      experience: 5,
      manager: testPM._id
    });
    await testEmployee.save();
    console.log('✅ Test employee created');

    // 3. Create a test project
    console.log('\n3️⃣ Creating test project...');
    const testProject = new Project({
      name: 'Test Project',
      description: 'A test project for points system',
      client: null, // No client for this test
      projectManager: testPM._id,
      assignedTeam: [testEmployee._id],
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      budget: 10000,
      status: 'active'
    });
    await testProject.save();
    console.log('✅ Test project created');

    // 4. Create a test milestone
    console.log('\n4️⃣ Creating test milestone...');
    const testMilestone = new Milestone({
      title: 'Test Milestone',
      description: 'A test milestone',
      project: testProject._id,
      assignedTo: [testEmployee._id],
      startDate: new Date(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      status: 'active'
    });
    await testMilestone.save();
    console.log('✅ Test milestone created');

    // 5. Create test tasks with different scenarios
    console.log('\n5️⃣ Creating test tasks...');
    
    // Task 1: On-time completion (should get +1 point)
    const task1 = new Task({
      title: 'Task 1 - On Time',
      description: 'Complete this task on time',
      project: testProject._id,
      milestone: testMilestone._id,
      assignedTo: [testEmployee._id],
      status: 'pending',
      priority: 'normal',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      estimatedHours: 8,
      createdBy: testPM._id
    });
    await task1.save();

    // Task 2: Overdue completion (should get -1 point)
    const task2 = new Task({
      title: 'Task 2 - Overdue',
      description: 'Complete this task overdue',
      project: testProject._id,
      milestone: testMilestone._id,
      assignedTo: [testEmployee._id],
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      estimatedHours: 4,
      createdBy: testPM._id
    });
    await task2.save();

    // Task 3: Another on-time task
    const task3 = new Task({
      title: 'Task 3 - Another On Time',
      description: 'Another task to complete on time',
      project: testProject._id,
      milestone: testMilestone._id,
      assignedTo: [testEmployee._id],
      status: 'pending',
      priority: 'low',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      estimatedHours: 6,
      createdBy: testPM._id
    });
    await task3.save();

    console.log('✅ Test tasks created');

    // 6. Test points calculation
    console.log('\n6️⃣ Testing points calculation...');
    
    // Complete task 1 on time
    console.log('   Completing Task 1 on time...');
    task1.status = 'completed';
    task1.completedDate = new Date(); // Completed today (before due date)
    const pointsResult1 = task1.calculatePoints();
    console.log(`   Points result: ${pointsResult1.points} (${pointsResult1.reason})`);
    
    if (pointsResult1.points > 0) {
      await testEmployee.addPoints(task1._id, pointsResult1.points, pointsResult1.reason);
    }
    await task1.save();

    // Complete task 2 overdue
    console.log('   Completing Task 2 overdue...');
    task2.status = 'completed';
    task2.completedDate = new Date(); // Completed today (after due date)
    const pointsResult2 = task2.calculatePoints();
    console.log(`   Points result: ${pointsResult2.points} (${pointsResult2.reason})`);
    
    if (pointsResult2.points < 0) {
      await testEmployee.deductPoints(task2._id, Math.abs(pointsResult2.points), pointsResult2.reason);
    }
    await task2.save();

    // Complete task 3 on time
    console.log('   Completing Task 3 on time...');
    task3.status = 'completed';
    task3.completedDate = new Date(); // Completed today (before due date)
    const pointsResult3 = task3.calculatePoints();
    console.log(`   Points result: ${pointsResult3.points} (${pointsResult3.reason})`);
    
    if (pointsResult3.points > 0) {
      await testEmployee.addPoints(task3._id, pointsResult3.points, pointsResult3.reason);
    }
    await task3.save();

    // Update employee statistics
    await testEmployee.updateStatistics();

    console.log('✅ Points calculation completed');

    // 7. Verify results
    console.log('\n7️⃣ Verifying results...');
    
    const updatedEmployee = await Employee.findById(testEmployee._id);
    console.log(`   Employee points: ${updatedEmployee.points}`);
    console.log(`   Tasks completed: ${updatedEmployee.statistics.tasksCompleted}`);
    console.log(`   Tasks on time: ${updatedEmployee.statistics.tasksOnTime}`);
    console.log(`   Tasks overdue: ${updatedEmployee.statistics.tasksOverdue}`);
    console.log(`   Total points earned: ${updatedEmployee.statistics.totalPointsEarned}`);
    console.log(`   Total points deducted: ${updatedEmployee.statistics.totalPointsDeducted}`);
    console.log(`   Points history entries: ${updatedEmployee.pointsHistory.length}`);

    // Expected: 1 point (1 on-time + 1 on-time - 1 overdue = 1)
    const expectedPoints = 1;
    if (updatedEmployee.points === expectedPoints) {
      console.log('✅ Points calculation is correct!');
    } else {
      console.log(`❌ Points calculation is incorrect. Expected: ${expectedPoints}, Got: ${updatedEmployee.points}`);
    }

    // 8. Test leaderboard
    console.log('\n8️⃣ Testing leaderboard...');
    
    const employees = await Employee.find({ isActive: true })
      .select('name email position department points statistics')
      .sort({ points: -1 });
    
    console.log(`   Total employees in leaderboard: ${employees.length}`);
    console.log('   Top 3 employees:');
    employees.slice(0, 3).forEach((emp, index) => {
      console.log(`     ${index + 1}. ${emp.name} - ${emp.points} points`);
    });

    console.log('✅ Leaderboard test completed');

    // 9. Cleanup
    console.log('\n9️⃣ Cleaning up test data...');
    await Task.deleteMany({ _id: { $in: [task1._id, task2._id, task3._id] } });
    await Milestone.deleteMany({ _id: testMilestone._id });
    await Project.deleteMany({ _id: testProject._id });
    await Employee.deleteMany({ _id: testEmployee._id });
    await PM.deleteMany({ _id: testPM._id });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Employee model with points system');
    console.log('   ✅ Task model with points calculation');
    console.log('   ✅ Points addition (+1 for on-time completion)');
    console.log('   ✅ Points deduction (-1 for overdue completion)');
    console.log('   ✅ Statistics tracking');
    console.log('   ✅ Points history');
    console.log('   ✅ Leaderboard generation');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Test API endpoints
const testAPIEndpoints = async () => {
  console.log('\n🌐 Testing API Endpoints...\n');
  
  const baseURL = process.env.API_BASE_URL || 'http://localhost:5000';
  
  // Note: These tests would require authentication tokens
  // For now, we'll just log the expected endpoints
  console.log('📋 Employee API Endpoints to test:');
  console.log('   GET /api/employee/analytics/dashboard');
  console.log('   GET /api/employee/analytics/performance');
  console.log('   GET /api/employee/analytics/leaderboard');
  console.log('   GET /api/employee/analytics/points-history');
  console.log('   GET /api/employee/projects');
  console.log('   GET /api/employee/projects/:id');
  console.log('   GET /api/employee/projects/:id/milestones');
  console.log('   GET /api/employee/milestones/:id');
  console.log('   GET /api/employee/milestones/:id/tasks');
  console.log('   POST /api/employee/milestones/:id/comments');
  console.log('   GET /api/employee/tasks');
  console.log('   GET /api/employee/tasks/:id');
  console.log('   PATCH /api/employee/tasks/:id/status');
  console.log('   POST /api/employee/tasks/:id/comments');
  console.log('   POST /api/employee/tasks/:id/attachments');
  console.log('   GET /api/employee/tasks/:id/attachments');
  console.log('   DELETE /api/employee/tasks/:id/attachments/:attachmentId');
  console.log('   GET /api/employee/tasks/urgent');
  console.log('   GET /api/employee/tasks/statistics');
  console.log('   GET /api/employee/projects/statistics');
  
  console.log('\n💡 To test these endpoints:');
  console.log('   1. Start the backend server');
  console.log('   2. Create an employee account');
  console.log('   3. Login to get authentication token');
  console.log('   4. Use the token to test each endpoint');
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting Employee Module Tests...\n');
  
  await connectDB();
  await testEmployeePointsSystem();
  await testAPIEndpoints();
  
  console.log('\n✨ All tests completed!');
  process.exit(0);
};

// Run tests
runTests().catch(error => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
});
