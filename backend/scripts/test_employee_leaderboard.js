require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Task = require('../models/Task');
const connectDB = require('../config/db');

// Use the same database connection as the server

// Test the employee leaderboard API
const testEmployeeLeaderboard = async () => {
  await connectDB();
  
  try {
    // Create test employees with different points
    const testEmployees = [
      {
        name: 'Sarah Chen',
        email: 'sarah@test.com',
        password: 'password123',
        role: 'employee',
        team: 'developer',
        department: 'full-stack',
        phone: '+1234567890',
        dateOfBirth: new Date('1990-01-15'),
        joiningDate: new Date('2023-01-15'),
        position: 'Senior Developer',
        employeeId: 'EMP001',
        salary: 60000,
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: 5,
        points: 9500,
        statistics: {
          tasksCompleted: 52,
          tasksOnTime: 52,
          tasksOverdue: 0,
          averageCompletionTime: 1.8,
          completionRate: 98,
          totalPointsEarned: 9500,
          totalPointsDeducted: 0
        }
      },
      {
        name: 'Michael Brown',
        email: 'michael@test.com',
        password: 'password123',
        role: 'employee',
        team: 'developer',
        department: 'full-stack',
        phone: '+1234567891',
        dateOfBirth: new Date('1992-03-20'),
        joiningDate: new Date('2023-02-01'),
        position: 'Developer',
        employeeId: 'EMP002',
        salary: 55000,
        skills: ['JavaScript', 'Vue.js', 'MongoDB'],
        experience: 3,
        points: 9100,
        statistics: {
          tasksCompleted: 48,
          tasksOnTime: 47,
          tasksOverdue: 1,
          averageCompletionTime: 2.1,
          completionRate: 96,
          totalPointsEarned: 9100,
          totalPointsDeducted: 0
        }
      },
      {
        name: 'Alex Johnson',
        email: 'alex@test.com',
        password: 'password123',
        role: 'employee',
        team: 'developer',
        department: 'full-stack',
        phone: '+1234567892',
        dateOfBirth: new Date('1995-01-15'),
        joiningDate: new Date('2023-01-15'),
        position: 'Senior Developer',
        employeeId: 'EMP003',
        salary: 50000,
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        experience: 2,
        points: 8750,
        statistics: {
          tasksCompleted: 45,
          tasksOnTime: 42,
          tasksOverdue: 2,
          averageCompletionTime: 2.3,
          completionRate: 93,
          totalPointsEarned: 8750,
          totalPointsDeducted: 0
        }
      }
    ];

    // Clear existing test employees
    await Employee.deleteMany({ email: { $in: testEmployees.map(emp => emp.email) } });
    console.log('Cleared existing test employees');

    // Create test employees
    const createdEmployees = await Employee.insertMany(testEmployees);
    console.log('Created test employees:', createdEmployees.length);

    // Test the leaderboard API endpoint
    console.log('\n=== Testing Employee Leaderboard API ===');
    
    // Simulate API call by getting leaderboard data
    const employees = await Employee.find({ role: 'employee' })
      .select('name email points statistics department position pointsHistory')
      .sort({ points: -1 });

    const leaderboard = employees.map((emp, index) => ({
      _id: emp._id,
      name: emp.name,
      points: emp.points || 0,
      rank: index + 1,
      statistics: emp.statistics || {
        tasksCompleted: 0,
        tasksOnTime: 0,
        tasksOverdue: 0,
        tasksMissed: 0,
        averageCompletionTime: 0,
        completionRate: 0
      },
      department: emp.department || 'Development',
      position: emp.position || 'Developer',
      isCurrentEmployee: false,
      trend: 'stable',
      trendValue: '0%',
      lastActive: emp.updatedAt
    }));

    console.log('Leaderboard Data:');
    leaderboard.forEach(emp => {
      console.log(`Rank ${emp.rank}: ${emp.name} - ${emp.points} points (${emp.statistics.completionRate}% completion rate)`);
    });

    console.log('\n✅ Employee Leaderboard API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing employee leaderboard:', error);
  } finally {
    mongoose.connection.close();
  }
};

testEmployeeLeaderboard();
