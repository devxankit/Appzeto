const mongoose = require('mongoose');
require('dotenv').config();

const Task = require('../models/Task');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Employee = require('../models/Employee');
const PM = require('../models/PM');

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

// Connect to MongoDB (same pattern as other scripts)
const connectDB = async () => {
  try {
    logStep('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    logSuccess('Connected to MongoDB');
  } catch (error) {
    logError(`MongoDB connection failed: ${error.message}`);
    logInfo('Please ensure MongoDB is running and MONGODB_URI is set in .env file');
    process.exit(1);
  }
};

// Sample task data for different types of projects
const sampleTasks = {
  webDevelopment: [
    {
      title: 'Setup Development Environment',
      description: 'Configure development environment with necessary tools and dependencies',
      priority: 'high',
      estimatedHours: 4,
      status: 'completed'
    },
    {
      title: 'Design Database Schema',
      description: 'Create and design the database schema for the application',
      priority: 'high',
      estimatedHours: 8,
      status: 'completed'
    },
    {
      title: 'Implement User Authentication',
      description: 'Develop user login, registration, and authentication system',
      priority: 'high',
      estimatedHours: 12,
      status: 'in_progress'
    },
    {
      title: 'Create API Endpoints',
      description: 'Develop RESTful API endpoints for core functionality',
      priority: 'normal',
      estimatedHours: 16,
      status: 'pending'
    },
    {
      title: 'Frontend Component Development',
      description: 'Build reusable UI components for the application',
      priority: 'normal',
      estimatedHours: 20,
      status: 'pending'
    },
    {
      title: 'Database Integration',
      description: 'Connect frontend with backend API and database',
      priority: 'high',
      estimatedHours: 10,
      status: 'pending'
    },
    {
      title: 'User Interface Testing',
      description: 'Test all user interfaces and user experience flows',
      priority: 'normal',
      estimatedHours: 8,
      status: 'pending'
    },
    {
      title: 'Performance Optimization',
      description: 'Optimize application performance and loading times',
      priority: 'low',
      estimatedHours: 6,
      status: 'pending'
    }
  ],
  mobileApp: [
    {
      title: 'Setup React Native Environment',
      description: 'Configure React Native development environment',
      priority: 'high',
      estimatedHours: 3,
      status: 'completed'
    },
    {
      title: 'Design App Wireframes',
      description: 'Create wireframes and user flow diagrams',
      priority: 'high',
      estimatedHours: 6,
      status: 'completed'
    },
    {
      title: 'Implement Navigation',
      description: 'Set up navigation structure and routing',
      priority: 'high',
      estimatedHours: 8,
      status: 'in_progress'
    },
    {
      title: 'Create User Screens',
      description: 'Develop main user interface screens',
      priority: 'normal',
      estimatedHours: 15,
      status: 'pending'
    },
    {
      title: 'API Integration',
      description: 'Connect mobile app with backend services',
      priority: 'high',
      estimatedHours: 12,
      status: 'pending'
    },
    {
      title: 'Push Notifications',
      description: 'Implement push notification system',
      priority: 'normal',
      estimatedHours: 6,
      status: 'pending'
    },
    {
      title: 'App Store Preparation',
      description: 'Prepare app for app store submission',
      priority: 'low',
      estimatedHours: 4,
      status: 'pending'
    }
  ],
  ecommerce: [
    {
      title: 'Product Catalog Setup',
      description: 'Create product catalog with categories and filters',
      priority: 'high',
      estimatedHours: 10,
      status: 'completed'
    },
    {
      title: 'Shopping Cart Implementation',
      description: 'Develop shopping cart functionality',
      priority: 'high',
      estimatedHours: 12,
      status: 'in_progress'
    },
    {
      title: 'Payment Gateway Integration',
      description: 'Integrate payment processing system',
      priority: 'high',
      estimatedHours: 16,
      status: 'pending'
    },
    {
      title: 'User Account Management',
      description: 'Implement user registration and profile management',
      priority: 'normal',
      estimatedHours: 8,
      status: 'pending'
    },
    {
      title: 'Order Management System',
      description: 'Create order processing and tracking system',
      priority: 'high',
      estimatedHours: 14,
      status: 'pending'
    },
    {
      title: 'Inventory Management',
      description: 'Develop inventory tracking and management',
      priority: 'normal',
      estimatedHours: 10,
      status: 'pending'
    },
    {
      title: 'Security Implementation',
      description: 'Implement security measures and data protection',
      priority: 'high',
      estimatedHours: 8,
      status: 'pending'
    }
  ]
};

// Add tasks to milestones
const addTasksToMilestones = async () => {
  try {
    logStep('Starting Task Addition to Milestones...');
    log('='.repeat(60), 'cyan');

    // 1. Find all projects with milestones
    logStep('Finding projects with milestones...');
    const projects = await Project.find({})
    .populate('assignedTeam', 'name email position team')
    .populate('projectManager', 'name email');

    if (projects.length === 0) {
      logError('No projects found');
      return;
    }

    logSuccess(`Found ${projects.length} projects`);

    let totalTasksCreated = 0;
    let totalProjectsProcessed = 0;

    // 2. Process each project
    for (const project of projects) {
      logStep(`Processing project: ${project.name}`);
      
      // Get milestones for this project
      const milestones = await Milestone.find({ project: project._id }).sort({ sequence: 1 });
      
      if (milestones.length === 0) {
        logWarning(`No milestones found for project: ${project.name}`);
        continue;
      }

      logInfo(`Found ${milestones.length} milestones for project: ${project.name}`);

      // 3. Determine project type and get appropriate tasks
      let projectType = 'webDevelopment'; // Default
      if (project.name.toLowerCase().includes('mobile') || project.name.toLowerCase().includes('app')) {
        projectType = 'mobileApp';
      } else if (project.name.toLowerCase().includes('ecommerce') || project.name.toLowerCase().includes('shop')) {
        projectType = 'ecommerce';
      }

      const tasksToAdd = sampleTasks[projectType];
      logInfo(`Using ${projectType} task template`);

      // 4. Get developer employees from project team
      const developerEmployees = project.assignedTeam.filter(emp => emp.team === 'developer');
      if (developerEmployees.length === 0) {
        logWarning(`No developer employees found for project: ${project.name}`);
        continue;
      }

      // 5. Add tasks to milestones
      let projectTasksCreated = 0;
      
      for (let i = 0; i < milestones.length && i < tasksToAdd.length; i++) {
        const milestone = milestones[i];
        const taskData = tasksToAdd[i];
        
        // Calculate due date (spread tasks over time)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (i * 3) + Math.floor(Math.random() * 7)); // Spread over weeks
        
        // Randomly assign to a developer
        const assignedEmployee = developerEmployees[Math.floor(Math.random() * developerEmployees.length)];
        
        try {
          const task = new Task({
            title: taskData.title,
            description: taskData.description,
            project: project._id,
            milestone: milestone._id,
            assignedTo: [assignedEmployee._id],
            priority: taskData.priority,
            dueDate: dueDate,
            estimatedHours: taskData.estimatedHours,
            status: taskData.status,
            createdBy: project.projectManager._id
          });

          await task.save();
          
          // Add task to milestone
          try {
            await milestone.addTask(task._id);
          } catch (error) {
            logWarning(`Failed to add task to milestone: ${error.message}`);
          }

          projectTasksCreated++;
          totalTasksCreated++;
          
          logSuccess(`Created task: ${task.title} for milestone: ${milestone.title}`);
          
        } catch (error) {
          logError(`Failed to create task: ${taskData.title} - ${error.message}`);
        }
      }

      logInfo(`Created ${projectTasksCreated} tasks for project: ${project.name}`);
      totalProjectsProcessed++;
    }

    // 6. Display summary
    log('='.repeat(60), 'cyan');
    logSuccess('Task Addition Completed Successfully!');
    logInfo(`Summary:`);
    logInfo(`  Projects processed: ${totalProjectsProcessed}`);
    logInfo(`  Total tasks created: ${totalTasksCreated}`);
    logInfo(`  Average tasks per project: ${totalProjectsProcessed > 0 ? (totalTasksCreated / totalProjectsProcessed).toFixed(1) : 0}`);

    // 7. Display task statistics
    logStep('Generating task statistics...');
    try {
      const taskStats = await Task.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      logInfo('Task Status Distribution:');
      taskStats.forEach(stat => {
        logInfo(`  ${stat._id}: ${stat.count} tasks`);
      });

      const totalTasks = await Task.countDocuments();
      logInfo(`  Total tasks in database: ${totalTasks}`);

    } catch (error) {
      logWarning(`Failed to generate statistics: ${error.message}`);
    }

  } catch (error) {
    logError(`Task addition failed: ${error.message}`);
    console.error(error);
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await addTasksToMilestones();
  } catch (error) {
    logError(`Main execution failed: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    logInfo('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
main();
