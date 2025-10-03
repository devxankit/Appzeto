/*
  Seed demo data: PMs, Employees, Customers, Projects, Milestones, Tasks
  Usage:
    NODE_ENV=development node scripts/seedDemoData.js
    or via npm script: npm run seed:demo
*/

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Task = require('../models/Task');

const random = {
  pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
  int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
};

const NAMES = {
  pm: [
    'Priya Mehta',
    'Arjun Verma',
    'Neha Kapoor',
  ],
  employee: [
    'Rohan Singh',
    'Ananya Gupta',
    'Vikram Iyer',
    'Kavya Nair',
    'Sahil Sharma',
    'Isha Desai',
    'Aman Tiwari',
    'Nikita Rao',
  ],
  customer: [
    'Ankit Kumar',
    'Shreya Patel',
    'Devansh Joshi',
    'Sneha Kulkarni',
  ],
};

const COMPANIES = [
  'Skyline Tech Pvt Ltd',
  'BlueRiver Solutions',
  'NovaSoft Systems',
  'GreenLeaf Retailers',
  'Sunrise Logistics'
];

const DEPARTMENTS = ['Engineering', 'Design', 'QA', 'Operations'];
const JOB_TITLES = ['Senior Engineer', 'Frontend Developer', 'Backend Developer', 'QA Analyst', 'UI/UX Designer'];
const WORK_TITLES = ['Module Lead', 'Feature Owner', 'Sprint Contributor'];
const SKILLS = ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'Jest', 'Cypress', 'TailwindCSS'];

const PROJECT_TEMPLATES = [
  'Website Revamp for {{company}}',
  'Mobile App Development - {{company}}',
  'Internal Tooling Upgrade - {{company}}',
  'E-commerce Platform Optimization - {{company}}',
  'Customer Portal Migration - {{company}}'
];

const MILESTONE_TITLES = [
  'Planning & Requirements',
  'Design Phase',
  'Development Sprint {{n}}',
  'Testing & QA',
  'Deployment & Handover'
];

const TASK_TITLES = [
  'Implement feature {{n}}',
  'Fix bug #{{n}}',
  'Write test cases for module {{n}}',
  'Create UI components for screen {{n}}',
  'Integrate API endpoint {{n}}',
  'Refactor legacy code path {{n}}'
];

const PRIORITIES = ['low', 'normal', 'high', 'urgent'];
const STATUSES = ['planning', 'active', 'on-hold'];
const ITEM_STATUSES = ['pending', 'in-progress'];

async function ensureConnection() {
  await connectDB();
}

function emailFromName(name, suffix) {
  const base = name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
  return `${base}${suffix ? '.' + suffix : ''}@example.com`;
}

function randomFromNow(daysMin, daysMax) {
  const days = random.int(daysMin, daysMax);
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function initialsFromName(name) {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return parts[0][0].toUpperCase();
}

async function createUsers() {
  console.log('Creating demo users...');

  const createdUsers = { pms: [], employees: [], customers: [] };

  // PMs
  for (let i = 0; i < NAMES.pm.length; i++) {
    const fullName = NAMES.pm[i];
    const email = emailFromName(fullName, 'pm');
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName,
        email,
        role: 'pm',
        status: 'active',
        password: 'Password@123',
        avatar: initialsFromName(fullName),
        department: random.pick(DEPARTMENTS),
        jobTitle: 'Project Manager',
        workTitle: random.pick(WORK_TITLES),
        skills: [random.pick(SKILLS), random.pick(SKILLS)],
        phone: '+911234567890',
        location: 'Delhi, IN',
        createdBy: 'Seeder Script'
      });
    }
    createdUsers.pms.push(user);
  }

  // Employees
  for (let i = 0; i < NAMES.employee.length; i++) {
    const fullName = NAMES.employee[i];
    const email = emailFromName(fullName, 'emp');
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName,
        email,
        role: 'employee',
        status: 'active',
        password: 'Password@123',
        avatar: initialsFromName(fullName),
        department: random.pick(DEPARTMENTS),
        jobTitle: random.pick(JOB_TITLES),
        workTitle: random.pick(WORK_TITLES),
        skills: [random.pick(SKILLS), random.pick(SKILLS), random.pick(SKILLS)],
        phone: '+919876543210',
        location: 'Bengaluru, IN',
        createdBy: 'Seeder Script'
      });
    }
    createdUsers.employees.push(user);
  }

  // Customers
  for (let i = 0; i < NAMES.customer.length; i++) {
    const fullName = NAMES.customer[i];
    const company = random.pick(COMPANIES);
    const email = emailFromName(fullName, 'cust');
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName,
        email,
        role: 'customer',
        status: 'active',
        password: 'Password@123',
        avatar: initialsFromName(fullName),
        company,
        address: `${random.int(10, 200)} MG Road, ${company.split(' ')[0]} City`,
        phone: '+911112223334',
        createdBy: 'Seeder Script'
      });
    }
    createdUsers.customers.push(user);
  }

  console.log(`Users created -> PMs: ${createdUsers.pms.length}, Employees: ${createdUsers.employees.length}, Customers: ${createdUsers.customers.length}`);
  return createdUsers;
}

function buildProjectName(company) {
  const template = PROJECT_TEMPLATES[createdProjectsCount % PROJECT_TEMPLATES.length];
  return template.replace('{{company}}', company);
}

let createdProjectsCount = 0;

async function createProjectsWithStructure({ pms, employees, customers }) {
  console.log('Creating projects, milestones, and tasks...');
  const projectsCreated = [];

  const numProjects = 5; // 4-5 projects

  for (let i = 0; i < numProjects; i++) {
    const pm = random.pick(pms);
    const customer = random.pick(customers);
    const teamSize = random.int(3, 5);
    const team = [];
    while (team.length < teamSize) {
      const e = random.pick(employees);
      if (!team.find(t => t._id.equals(e._id))) team.push(e);
    }

    const dueDate = randomFromNow(30, 120);
    const projectData = {
      name: buildProjectName(customer.company || 'Client'),
      description: 'Auto-generated demo project for end-to-end testing and UI states.',
      status: random.pick(STATUSES),
      priority: random.pick(PRIORITIES),
      startDate: new Date(),
      dueDate,
      customer: customer._id,
      projectManager: pm._id,
      assignedTeam: team.map(t => t._id),
      tags: ['demo', 'seed'],
      createdBy: pm._id,
    };

    const project = await Project.create(projectData);

    // Update user relationships
    await User.findByIdAndUpdate(customer._id, { $addToSet: { customerProjects: project._id } });
    await User.findByIdAndUpdate(pm._id, { $addToSet: { managedProjects: project._id } });
    await User.updateMany({ _id: { $in: team.map(t => t._id) } }, { $addToSet: { assignedProjects: project._id } });

    // Create 3-4 milestones
    const numMilestones = random.int(3, 4);
    const milestones = [];
    for (let m = 1; m <= numMilestones; m++) {
      const titleTemplate = random.pick(MILESTONE_TITLES);
      const title = titleTemplate.replace('{{n}}', String(m));
      const milestone = await Milestone.create({
        title,
        description: `Scope and deliverables for ${title}.`,
        project: project._id,
        sequence: m,
        dueDate: randomFromNow(7 * m, 7 * m + 14),
        status: random.pick(ITEM_STATUSES),
        priority: random.pick(PRIORITIES),
        progress: 0,
        assignedTo: team.slice(0, random.int(1, team.length)).map(t => t._id),
        createdBy: pm._id,
      });
      milestones.push(milestone);

      // Create 3-4 tasks per milestone
      const numTasks = random.int(3, 4);
      for (let t = 1; t <= numTasks; t++) {
        const title = random.pick(TASK_TITLES).replace('{{n}}', String(random.int(1, 50)));
        const assignees = team.slice(0, random.int(1, Math.min(3, team.length)));
        await Task.create({
          title,
          description: `Details for task ${title}.`,
          milestone: milestone._id,
          project: project._id,
          status: random.pick(ITEM_STATUSES),
          priority: random.pick(PRIORITIES),
          assignedTo: assignees.map(a => a._id),
          dueDate: randomFromNow(7 * m, 7 * m + 10),
          createdBy: pm._id,
        });
      }

      // Recalculate milestone progress after tasks
      await milestone.calculateProgress();
    }

    projectsCreated.push({ project, milestonesCount: milestones.length });
    createdProjectsCount += 1;
  }

  console.log(`Created ${projectsCreated.length} projects with milestones and tasks.`);
  return projectsCreated;
}

async function run() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set in environment');
    }

    await ensureConnection();

    console.log('Seeding demo data into database:', process.env.MONGODB_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@'));

    const users = await createUsers();
    await createProjectsWithStructure(users);

    console.log('Demo data seeding completed successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Closed DB connection.');
  }
}

if (require.main === module) {
  run();
}

module.exports = { run };


