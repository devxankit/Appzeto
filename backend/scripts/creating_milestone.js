const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Employee = require('../models/Employee');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Create demo milestones
const createDemoMilestones = async () => {
  try {
    console.log('Creating demo milestones...');

    // Get existing projects
    const projects = await Project.find().limit(5);
    if (projects.length === 0) {
      console.log('No projects found. Please create projects first.');
      return;
    }

    // Get existing employees
    const employees = await Employee.find().limit(10);
    if (employees.length === 0) {
      console.log('No employees found. Please create employees first.');
      return;
    }

    const milestones = [];

    for (const project of projects) {
      // Create 3-5 milestones per project
      const milestoneCount = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 1; i <= milestoneCount; i++) {
        const assignedEmployees = employees
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 1);

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (i * 7) + Math.floor(Math.random() * 14));

        const milestone = {
          title: `Milestone ${i}: ${getMilestoneTitle(i)}`,
          description: `This is milestone ${i} for project ${project.name}. It includes key deliverables and objectives.`,
          project: project._id,
          sequence: i,
          dueDate: dueDate,
          status: getRandomStatus(),
          priority: getRandomPriority(),
          assignedTo: assignedEmployees.map(emp => emp._id),
          progress: Math.floor(Math.random() * 100)
        };

        milestones.push(milestone);
      }
    }

    // Create milestones in database
    const createdMilestones = await Milestone.insertMany(milestones);
    console.log(`Created ${createdMilestones.length} milestones`);

    // Update projects with milestone references
    for (const project of projects) {
      const projectMilestones = await Milestone.find({ project: project._id });
      await Project.findByIdAndUpdate(project._id, {
        milestones: projectMilestones.map(m => m._id)
      });
    }

    console.log('Demo milestones created successfully!');
  } catch (error) {
    console.error('Error creating demo milestones:', error);
  }
};

// Helper functions
const getMilestoneTitle = (sequence) => {
  const titles = [
    'Project Planning & Setup',
    'Core Development Phase',
    'Testing & Quality Assurance',
    'Integration & Deployment',
    'Final Review & Handover',
    'Documentation & Training',
    'Performance Optimization',
    'Security Implementation'
  ];
  return titles[sequence - 1] || `Phase ${sequence}`;
};

const getRandomStatus = () => {
  const statuses = ['pending', 'in-progress', 'testing', 'completed', 'cancelled'];
  const weights = [0.1, 0.4, 0.2, 0.2, 0.1]; // Weighted random selection
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return statuses[i];
    }
  }
  return 'pending';
};

const getRandomPriority = () => {
  const priorities = ['low', 'normal', 'high', 'urgent'];
  const weights = [0.2, 0.5, 0.2, 0.1];
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < priorities.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return priorities[i];
    }
  }
  return 'normal';
};

// Main execution
const main = async () => {
  await connectDB();
  await createDemoMilestones();
  await mongoose.connection.close();
  console.log('Database connection closed');
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createDemoMilestones };
