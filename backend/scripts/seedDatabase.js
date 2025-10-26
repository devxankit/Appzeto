const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Admin = require('../models/Admin');
const PM = require('../models/PM');
const Employee = require('../models/Employee');
const Client = require('../models/Client');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Task = require('../models/Task');
const Sales = require('../models/Sales');

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

// Clear existing data
const clearDatabase = async () => {
  try {
    // Drop collections completely to remove indexes
    await Admin.collection.drop().catch(() => {});
    await PM.collection.drop().catch(() => {});
    await Employee.collection.drop().catch(() => {});
    await Client.collection.drop().catch(() => {});
    await Project.collection.drop().catch(() => {});
    await Milestone.collection.drop().catch(() => {});
    await Task.collection.drop().catch(() => {});
    await Sales.collection.drop().catch(() => {});
    console.log('Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

// Create sample data
const createSampleData = async () => {
  try {
    // Create Admin
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await Admin.create({
      name: 'System Administrator',
      email: 'admin@appzeto.com',
      password: hashedPassword,
      phone: '919876543210',
      role: 'admin',
      dateOfBirth: new Date('1990-01-15'),
      joiningDate: new Date('2023-01-01'),
      isActive: true
    });
    console.log('Admin created:', admin.email);

    // Create Sales Team
    const sales1 = await Sales.create({
      name: 'Priya Sharma',
      email: 'priya@appzeto.com',
      password: await bcrypt.hash('sales123', 12),
      phone: '919876543210',
      role: 'employee',
      team: 'sales',
      department: 'sales',
      dateOfBirth: new Date('1992-05-20'),
      joiningDate: new Date('2023-03-01'),
      isActive: true
    });

    const sales2 = await Sales.create({
      name: 'Amit Patel',
      email: 'amit@appzeto.com',
      password: await bcrypt.hash('sales123', 12),
      phone: '918765432109',
      role: 'employee',
      team: 'sales',
      department: 'sales',
      dateOfBirth: new Date('1991-08-15'),
      joiningDate: new Date('2023-04-01'),
      isActive: true
    });

    const sales3 = await Sales.create({
      name: 'Sneha Gupta',
      email: 'sneha@appzeto.com',
      password: await bcrypt.hash('sales123', 12),
      phone: '917654321098',
      role: 'employee',
      team: 'sales',
      department: 'sales',
      dateOfBirth: new Date('1993-12-10'),
      joiningDate: new Date('2023-05-01'),
      isActive: true
    });
    console.log('Sales team created');

    // Create PMs
    const pm1 = await PM.create({
      name: 'David Lee',
      email: 'david@appzeto.com',
      password: await bcrypt.hash('pm123', 12),
      phone: '916543210987',
      role: 'project-manager',
      team: 'pm',
      department: 'management',
      dateOfBirth: new Date('1988-03-15'),
      joiningDate: new Date('2023-02-01'),
      isActive: true,
      projectsManaged: []
    });

    const pm2 = await PM.create({
      name: 'Lisa Garcia',
      email: 'lisa@appzeto.com',
      password: await bcrypt.hash('pm123', 12),
      phone: '915432109876',
      role: 'project-manager',
      team: 'pm',
      department: 'management',
      dateOfBirth: new Date('1989-07-22'),
      joiningDate: new Date('2023-03-01'),
      isActive: true,
      projectsManaged: []
    });

    const pm3 = await PM.create({
      name: 'Mike Wilson',
      email: 'mike@appzeto.com',
      password: await bcrypt.hash('pm123', 12),
      phone: '914321098765',
      role: 'project-manager',
      team: 'pm',
      department: 'management',
      dateOfBirth: new Date('1990-11-08'),
      joiningDate: new Date('2023-04-01'),
      isActive: false, // On leave
      projectsManaged: []
    });
    console.log('PMs created');

    // Create Employees
    const employees = await Employee.create([
      {
        name: 'Emma Wilson',
        email: 'emma@appzeto.com',
        password: await bcrypt.hash('emp123', 12),
        phone: '913210987654',
        role: 'employee',
        team: 'developer',
        department: 'web',
        position: 'Frontend Developer',
        dateOfBirth: new Date('1995-06-15'),
        joiningDate: new Date('2023-06-15'),
        isActive: true,
        projectsAssigned: [],
        tasksAssigned: []
      },
      {
        name: 'Tom Chen',
        email: 'tom@appzeto.com',
        password: await bcrypt.hash('emp123', 12),
        phone: '912109876543',
        role: 'employee',
        team: 'developer',
        department: 'nodejs',
        position: 'Backend Developer',
        dateOfBirth: new Date('1994-08-20'),
        joiningDate: new Date('2023-08-20'),
        isActive: true,
        projectsAssigned: [],
        tasksAssigned: []
      },
      {
        name: 'Sarah Davis',
        email: 'sarah@appzeto.com',
        password: await bcrypt.hash('emp123', 12),
        phone: '911098765432',
        role: 'employee',
        team: 'developer',
        department: 'web',
        position: 'UI/UX Designer',
        dateOfBirth: new Date('1996-09-10'),
        joiningDate: new Date('2023-09-10'),
        isActive: false, // On leave
        projectsAssigned: [],
        tasksAssigned: []
      },
      {
        name: 'Mike Johnson',
        email: 'mike.j@appzeto.com',
        password: await bcrypt.hash('emp123', 12),
        phone: '919876543210',
        role: 'employee',
        team: 'developer',
        department: 'full-stack',
        position: 'Full Stack Developer',
        dateOfBirth: new Date('1993-05-01'),
        joiningDate: new Date('2023-05-01'),
        isActive: true,
        projectsAssigned: [],
        tasksAssigned: []
      },
      {
        name: 'Lisa Garcia',
        email: 'lisa.g@appzeto.com',
        password: await bcrypt.hash('emp123', 12),
        phone: '918765432109',
        role: 'employee',
        team: 'developer',
        department: 'app',
        position: 'DevOps Engineer',
        dateOfBirth: new Date('1992-07-15'),
        joiningDate: new Date('2023-07-15'),
        isActive: true,
        projectsAssigned: [],
        tasksAssigned: []
      }
    ]);
    console.log('Employees created');

    // Create Clients
    const clients = await Client.create([
      {
        name: 'John Smith',
        email: 'john@techcorp.com',
        phoneNumber: '7654321098',
        companyName: 'TechCorp Inc.',
        dateOfBirth: new Date('1985-03-15'),
        joiningDate: new Date('2023-05-20'),
        isActive: true,
        projects: []
      },
      {
        name: 'Jane Doe',
        email: 'jane@startupxyz.com',
        phoneNumber: '6543210987',
        companyName: 'StartupXYZ',
        dateOfBirth: new Date('1988-07-22'),
        joiningDate: new Date('2023-07-15'),
        isActive: true,
        projects: []
      },
      {
        name: 'Bob Johnson',
        email: 'bob@enterprise.com',
        phoneNumber: '5432109876',
        companyName: 'Enterprise Ltd',
        dateOfBirth: new Date('1982-11-08'),
        joiningDate: new Date('2023-03-10'),
        isActive: false,
        projects: []
      },
      {
        name: 'Alice Brown',
        email: 'alice@designco.com',
        phoneNumber: '4321098765',
        companyName: 'Design Co.',
        dateOfBirth: new Date('1987-05-12'),
        joiningDate: new Date('2023-04-05'),
        isActive: true,
        projects: []
      },
      {
        name: 'Charlie Wilson',
        email: 'charlie@techstart.com',
        phoneNumber: '3210987654',
        companyName: 'TechStart',
        dateOfBirth: new Date('1990-09-25'),
        joiningDate: new Date('2023-08-20'),
        isActive: true,
        projects: []
      }
    ]);
    console.log('Clients created');

    // Create Projects (Mix of different statuses)
    const projects = await Project.create([
      // Pending Projects (from sales)
      {
        name: 'Restaurant Management System',
        description: 'Complete restaurant management solution with online ordering, table booking, and inventory management',
        client: clients[0]._id,
        status: 'pending-assignment',
        priority: 'high',
        budget: 45000,
        requirements: 'Online ordering, table booking, inventory management, staff management, analytics dashboard',
        package: 'Restaurant App + Web Portal',
        submittedBy: sales1._id,
        createdAt: new Date('2024-01-20')
      },
      {
        name: 'E-learning Platform',
        description: 'Comprehensive e-learning platform for educational institutions',
        client: clients[1]._id,
        status: 'pending-assignment',
        priority: 'urgent',
        budget: 75000,
        requirements: 'Course management, student portal, payment integration, video streaming, assessments',
        package: 'E-learning Platform',
        submittedBy: sales2._id,
        createdAt: new Date('2024-01-19')
      },
      {
        name: 'Healthcare Management App',
        description: 'Healthcare management system for clinics and hospitals',
        client: clients[2]._id,
        status: 'pending-assignment',
        priority: 'normal',
        budget: 60000,
        requirements: 'Patient management, appointment booking, prescription tracking, medical records',
        package: 'Healthcare Management System',
        submittedBy: sales3._id,
        createdAt: new Date('2024-01-18')
      },

      // Active Projects
      {
        name: 'E-commerce Platform',
        description: 'Modern e-commerce platform with advanced features',
        client: clients[3]._id,
        projectManager: pm1._id,
        status: 'active',
        priority: 'high',
        dueDate: new Date('2024-03-15'),
        budget: 50000,
        assignedTeam: [employees[0]._id, employees[1]._id, employees[3]._id],
        createdAt: new Date('2024-01-01')
      },
      {
        name: 'Mobile App Development',
        description: 'Cross-platform mobile application for business management',
        client: clients[4]._id,
        projectManager: pm2._id,
        status: 'active',
        priority: 'normal',
        dueDate: new Date('2024-02-28'),
        budget: 35000,
        assignedTeam: [employees[1]._id, employees[4]._id],
        createdAt: new Date('2024-01-10')
      },

      // Completed Projects
      {
        name: 'Website Redesign',
        description: 'Complete website redesign with modern UI/UX',
        client: clients[0]._id,
        projectManager: pm1._id,
        status: 'completed',
        priority: 'normal',
        dueDate: new Date('2024-01-20'),
        budget: 25000,
        assignedTeam: [employees[0]._id, employees[2]._id],
        createdAt: new Date('2023-12-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        name: 'API Integration',
        description: 'Third-party API integration for existing system',
        client: clients[1]._id,
        projectManager: pm2._id,
        status: 'completed',
        priority: 'high',
        dueDate: new Date('2024-01-25'),
        budget: 20000,
        assignedTeam: [employees[1]._id],
        createdAt: new Date('2023-12-15'),
        updatedAt: new Date('2024-01-22')
      },

      // On-hold Project
      {
        name: 'Database Migration',
        description: 'Legacy database migration to modern system',
        client: clients[2]._id,
        projectManager: pm1._id,
        status: 'on-hold',
        priority: 'low',
        dueDate: new Date('2024-04-01'),
        budget: 40000,
        assignedTeam: [employees[1]._id, employees[4]._id],
        createdAt: new Date('2024-01-15')
      }
    ]);
    console.log('Projects created');

    // Update PMs with their projects
    await PM.findByIdAndUpdate(pm1._id, {
      projectsManaged: [projects[3]._id, projects[5]._id, projects[7]._id]
    });

    await PM.findByIdAndUpdate(pm2._id, {
      projectsManaged: [projects[4]._id, projects[6]._id]
    });

    await PM.findByIdAndUpdate(pm3._id, {
      projectsManaged: []
    });

    // Update Clients with their projects
    await Client.findByIdAndUpdate(clients[0]._id, {
      projects: [projects[0]._id, projects[5]._id]
    });

    await Client.findByIdAndUpdate(clients[1]._id, {
      projects: [projects[1]._id, projects[6]._id]
    });

    await Client.findByIdAndUpdate(clients[2]._id, {
      projects: [projects[2]._id, projects[7]._id]
    });

    await Client.findByIdAndUpdate(clients[3]._id, {
      projects: [projects[3]._id]
    });

    await Client.findByIdAndUpdate(clients[4]._id, {
      projects: [projects[4]._id]
    });

    // Create Milestones for active projects
    const milestones = await Milestone.create([
      // E-commerce Platform milestones
      {
        title: 'Project Setup & Planning',
        description: 'Initial project setup and planning phase',
        project: projects[3]._id,
        dueDate: new Date('2024-01-15'),
        status: 'completed',
        assignedTo: pm1._id
      },
      {
        title: 'Frontend Development',
        description: 'User interface development',
        project: projects[3]._id,
        dueDate: new Date('2024-02-15'),
        status: 'in-progress',
        assignedTo: employees[0]._id
      },
      {
        title: 'Backend Development',
        description: 'Server-side development and API creation',
        project: projects[3]._id,
        dueDate: new Date('2024-02-28'),
        status: 'pending',
        assignedTo: employees[1]._id
      },
      {
        title: 'Testing & Deployment',
        description: 'Final testing and deployment',
        project: projects[3]._id,
        dueDate: new Date('2024-03-15'),
        status: 'pending',
        assignedTo: employees[3]._id
      },

      // Mobile App milestones
      {
        title: 'Design & Prototyping',
        description: 'App design and prototyping',
        project: projects[4]._id,
        dueDate: new Date('2024-01-25'),
        status: 'completed',
        assignedTo: employees[2]._id
      },
      {
        title: 'Development Phase 1',
        description: 'Core functionality development',
        project: projects[4]._id,
        dueDate: new Date('2024-02-15'),
        status: 'in-progress',
        assignedTo: employees[1]._id
      },
      {
        title: 'Development Phase 2',
        description: 'Advanced features and optimization',
        project: projects[4]._id,
        dueDate: new Date('2024-02-28'),
        status: 'pending',
        assignedTo: employees[4]._id
      }
    ]);
    console.log('Milestones created');

    // Create Tasks
    const tasks = await Task.create([
      // E-commerce Platform tasks
      {
        title: 'Setup Development Environment',
        description: 'Configure development environment and tools',
        project: projects[3]._id,
        milestone: milestones[0]._id,
        assignedTo: employees[0]._id,
        createdBy: pm1._id,
        dueDate: new Date('2024-01-10'),
        status: 'completed',
        priority: 'high'
      },
      {
        title: 'Create User Authentication',
        description: 'Implement user login and registration',
        project: projects[3]._id,
        milestone: milestones[1]._id,
        assignedTo: employees[0]._id,
        createdBy: pm1._id,
        dueDate: new Date('2024-01-25'),
        status: 'in-progress',
        priority: 'high'
      },
      {
        title: 'Design Product Catalog',
        description: 'Create product listing and search functionality',
        project: projects[3]._id,
        milestone: milestones[1]._id,
        assignedTo: employees[0]._id,
        createdBy: pm1._id,
        dueDate: new Date('2024-02-05'),
        status: 'pending',
        priority: 'normal'
      },
      {
        title: 'Implement Payment Gateway',
        description: 'Integrate payment processing system',
        project: projects[3]._id,
        milestone: milestones[2]._id,
        assignedTo: employees[1]._id,
        createdBy: pm1._id,
        dueDate: new Date('2024-02-20'),
        status: 'pending',
        priority: 'high'
      },

      // Mobile App tasks
      {
        title: 'Create App Wireframes',
        description: 'Design app wireframes and user flow',
        project: projects[4]._id,
        milestone: milestones[4]._id,
        assignedTo: employees[2]._id,
        createdBy: pm2._id,
        dueDate: new Date('2024-01-20'),
        status: 'completed',
        priority: 'normal'
      },
      {
        title: 'Implement Core Features',
        description: 'Develop main app functionality',
        project: projects[4]._id,
        milestone: milestones[5]._id,
        assignedTo: employees[1]._id,
        createdBy: pm2._id,
        dueDate: new Date('2024-02-10'),
        status: 'in-progress',
        priority: 'high'
      },
      {
        title: 'Add Push Notifications',
        description: 'Implement push notification system',
        project: projects[4]._id,
        milestone: milestones[6]._id,
        assignedTo: employees[4]._id,
        createdBy: pm2._id,
        dueDate: new Date('2024-02-25'),
        status: 'pending',
        priority: 'normal'
      }
    ]);
    console.log('Tasks created');

    // Update employees with their projects and tasks
    await Employee.findByIdAndUpdate(employees[0]._id, {
      projectsAssigned: [projects[3]._id],
      tasksAssigned: [tasks[0]._id, tasks[1]._id, tasks[2]._id]
    });

    await Employee.findByIdAndUpdate(employees[1]._id, {
      projectsAssigned: [projects[3]._id, projects[4]._id],
      tasksAssigned: [tasks[3]._id, tasks[5]._id]
    });

    await Employee.findByIdAndUpdate(employees[2]._id, {
      projectsAssigned: [projects[5]._id],
      tasksAssigned: [tasks[4]._id]
    });

    await Employee.findByIdAndUpdate(employees[3]._id, {
      projectsAssigned: [projects[3]._id],
      tasksAssigned: []
    });

    await Employee.findByIdAndUpdate(employees[4]._id, {
      projectsAssigned: [projects[4]._id],
      tasksAssigned: [tasks[6]._id]
    });

    console.log('Sample data created successfully!');
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Admin: admin@appzeto.com / admin123');
    console.log('PMs: david@appzeto.com / pm123, lisa@appzeto.com / pm123');
    console.log('Sales: priya@appzeto.com / sales123');
    console.log('Employees: emma@appzeto.com / emp123');
    console.log('\n=== PROJECT STATUS SUMMARY ===');
    console.log(`Total Projects: ${projects.length}`);
    console.log(`Pending Assignment: ${projects.filter(p => p.status === 'pending-assignment').length}`);
    console.log(`Active: ${projects.filter(p => p.status === 'active').length}`);
    console.log(`Completed: ${projects.filter(p => p.status === 'completed').length}`);
    console.log(`On Hold: ${projects.filter(p => p.status === 'on-hold').length}`);

  } catch (error) {
    console.error('Error creating sample data:', error);
  }
};

// Main execution
const runSeed = async () => {
  try {
    await connectDB();
    await clearDatabase();
    await createSampleData();
    console.log('\nDatabase seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runSeed();
}

module.exports = { runSeed, clearDatabase, createSampleData };
