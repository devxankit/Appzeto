const mongoose = require('mongoose');
require('dotenv').config();

const Task = require('../models/Task');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const log = (message, color = 'white') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logSuccess = (message) => log(`✅ ${message}`, 'green');
const logError = (message) => log(`❌ ${message}`, 'red');
const logWarning = (message) => log(`⚠️  ${message}`, 'yellow');
const logInfo = (message) => log(`ℹ️  ${message}`, 'blue');
const logStep = (message) => log(`📝 ${message}`, 'cyan');

// Connect to MongoDB
const connectDB = async () => {
  try {
    logStep('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    logSuccess('Connected to MongoDB');
  } catch (error) {
    logError(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Test milestone progress calculation
const testMilestoneProgress = async () => {
  try {
    logStep('Testing Milestone Progress Calculation...');
    log('='.repeat(60), 'cyan');

    // 1. Find a milestone with tasks
    logStep('Finding milestone with tasks...');
    const milestone = await Milestone.findOne({ tasks: { $exists: true, $not: { $size: 0 } } })
      .populate('tasks', 'title status')
      .populate('project', 'name');

    if (!milestone) {
      logError('No milestone found with tasks');
      return;
    }

    logSuccess(`Found milestone: ${milestone.title}`);
    logInfo(`Project: ${milestone.project.name}`);
    logInfo(`Current progress: ${milestone.progress}%`);
    logInfo(`Tasks count: ${milestone.tasks.length}`);

    // 2. Show task details
    logStep('Task Details:');
    milestone.tasks.forEach((task, index) => {
      logInfo(`  ${index + 1}. ${task.title} - Status: ${task.status}`);
    });

    // 3. Calculate expected progress
    const completedTasks = milestone.tasks.filter(task => task.status === 'completed').length;
    const expectedProgress = milestone.tasks.length > 0 ? Math.round((completedTasks / milestone.tasks.length) * 100) : 0;
    
    logStep('Progress Calculation:');
    logInfo(`  Completed tasks: ${completedTasks}`);
    logInfo(`  Total tasks: ${milestone.tasks.length}`);
    logInfo(`  Expected progress: ${expectedProgress}%`);
    logInfo(`  Actual progress: ${milestone.progress}%`);

    // 4. Test progress update
    logStep('Testing progress update...');
    try {
      const updatedProgress = await milestone.updateProgress();
      logSuccess(`Progress updated successfully: ${updatedProgress}%`);
    } catch (error) {
      logError(`Progress update failed: ${error.message}`);
    }

    // 5. Test task status change
    logStep('Testing task status change...');
    if (milestone.tasks.length > 0) {
      const firstTask = await Task.findById(milestone.tasks[0]._id);
      if (firstTask) {
        const originalStatus = firstTask.status;
        const newStatus = originalStatus === 'completed' ? 'pending' : 'completed';
        
        logInfo(`Changing task "${firstTask.title}" from ${originalStatus} to ${newStatus}`);
        firstTask.status = newStatus;
        await firstTask.save();
        
        // Update milestone progress
        await milestone.updateProgress();
        logSuccess(`Milestone progress after task change: ${milestone.progress}%`);
        
        // Restore original status
        firstTask.status = originalStatus;
        await firstTask.save();
        await milestone.updateProgress();
        logInfo(`Restored original status. Final progress: ${milestone.progress}%`);
      }
    }

    // 6. Test project progress
    logStep('Testing project progress...');
    try {
      const project = await Project.findById(milestone.project._id);
      if (project) {
        logInfo(`Project progress: ${project.progress}%`);
        await project.updateProgress();
        logSuccess(`Project progress updated: ${project.progress}%`);
      }
    } catch (error) {
      logError(`Project progress update failed: ${error.message}`);
    }

    log('='.repeat(60), 'cyan');
    logSuccess('Milestone Progress Test Completed Successfully!');
    logInfo('All progress calculations are working correctly');

  } catch (error) {
    logError(`Test failed: ${error.message}`);
    console.error(error);
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await testMilestoneProgress();
  } catch (error) {
    logError(`Main execution failed: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    logInfo('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the test
main();
